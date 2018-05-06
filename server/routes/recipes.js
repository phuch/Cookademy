const express = require('express');
const Recipe = require('../models/Recipe');
const passport = require('passport');

const router = express.Router();

const multer = require("multer");
const moment = require("moment");
const sharp = require("sharp");

const upload = multer({ dest: 'public/original/' });
moment.locale();

// Middleware functions
const makeThumbImg = (req,res,next) => {
  if (req.file) {
    const url = 'thumb/' + req.file.filename;
    sharp(req.file.path).
        resize(320, 240).
        toFile('public/' + url, (err, info) => {
          req.body.thumbnail = url;
          next();
        });
  } else {
    next();
  }
};

const makeMediumImg = (req,res,next) => {
  if (req.file) {
    const url = 'image/' + req.file.filename;
    sharp(req.file.path).
        resize(770, 720).
        toFile('public/' + url, (err, info) => {
          req.body.image = url;
          next();
        });
  } else {
    next();
  }
};

const createDataToDB = (req,res, next) => {
  console.log("Creating data to db...");
  Recipe.create(req.body).then(post => {
    res.send(post);
  });
};

const updateDataToDB = (req,res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err)
      console.log(err);

    if(!recipe) {
      return res.status(404).send({message: "Recipe not found with id " + req.params.id});
    }

    for(const key in req.body) {
      if (req.body[key]) {
        recipe[key] = req.body[key];
      }
    }

    recipe.save((err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send({message: "Recipe updated successfully!"});
        console.log("Recipe updated succesfully");
      }
    });
  });
};

// get all recipes or find recipes by name
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  if (token) {
    if (req.query.search) {
      console.log('searching');
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      Recipe.find({title: regex})
      .populate('user', '_id name')
      .exec((err, recipes) => {
        if (err)
          console.log(err);

        if (!recipes)
          return res.status(404).send({message: "Recipe not found"});
        res.send(recipes);
      });
    } else {
      Recipe.find()
      .populate('user', '_id name')
      .exec((err, recipes) => {
        if (err)
          console.log(err);

        if (!recipes)
          return res.status(404).send({message: "Recipe not found"});
        res.send(recipes);
      });
    }
  }
});


// upload recipe
router.post('/', passport.authenticate('jwt', { session: false}), upload.single('file'), (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    console.log('uploading');
    req.body.time = moment().format('MMMM Do YYYY, h:mm');
    req.body.original = 'original/' + req.file.filename;
    req.body.ingredients = JSON.parse(req.body.ingredients);
    next();
  }
}, makeThumbImg, makeMediumImg, createDataToDB);


// Update stored data
router.put('/:id', passport.authenticate('jwt', { session: false}), upload.single('file'), (req,res,next) => {
  const token = getToken(req.headers);
  if (token) {
    if (req.file) {
      req.body.original = 'original/' + req.file.filename;
    }
    req.body.ingredients = JSON.parse(req.body.ingredients);
    next();
  }
}, makeThumbImg, makeMediumImg, updateDataToDB);

// Delete stored data
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req,res) => {
  const token = getToken(req.headers);
  if (token) {
    Recipe.findByIdAndRemove(req.params.id, (err, recipe) => {
      if (err)
        console.log("ERROR" + err);

      if (!recipe) {
        return res.status(404).
            send({message: "Recipe not found with id " + req.params.id});
      }

      res.send({message: "Recipe deleted successfully!"});
    });
  }
});

module.exports = router;

const toDecimal = (gpsData,ref) => {
  let coordinate = gpsData[0] + gpsData[1]/60 + gpsData[2]/3600;
  return (ref == "S" || ref == "W") ? coordinate*-1 : coordinate;
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const getToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
