const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

const ExifImage = require('exif').ExifImage;
const multer = require("multer");
const moment = require("moment");
const sharp = require("sharp");

const upload = multer({ dest: 'public/original/' });
moment.locale();

// Middleware functions
const readExif = (req,res,next) => {
  if (req.file) {
    try {
      new ExifImage({image: req.file.path}, function(error, exifData) {
        const gpsData = exifData.gps;
        if (error) {
          console.log('Error: ' + error.message);
          next();
        } else {
          if (gpsData.GPSLatitude || gpsData.GPSLongitude) {
            req.body.coordinates = {
              lat: toDecimal(gpsData.GPSLatitude, gpsData.GPSLatitudeRef),
              lng: toDecimal(gpsData.GPSLongitude, gpsData.GPSLongitudeRef)
            }
          } else {
            console.log("NO GPS DATA");
            req.body.coordinates = null;
          }
          next();
        }
      });
    } catch (error) {
      console.log('Error: ' + error.message);
      next();
    }
  } else {
    next();
  }
};

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

const createDataToDB = (req,res) => {
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
router.get('/', (req, res) => {
  if (req.query.search) {
    console.log('searching');
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Recipe.find({title: regex}, (err, recipe) => {
      if (err)
        console.log(err);

      if(!recipe)
        return res.status(404).send({message: "Recipe not found"});

      res.send(recipe);
    });
  } else {
    Recipe.find().then(recipes => {
      res.send(recipes);
    });
  }
});


// upload recipe
router.post('/', upload.single('file'), (req, res, next) => {
  console.log('uploading');
  req.body.time = moment().format('MMMM Do YYYY, h:mm');
  req.body.original = 'original/' + req.file.filename;
  next();
}, readExif, makeThumbImg, makeMediumImg, createDataToDB);


// Update stored data
router.put('/:id', upload.single('file'), (req,res,next) => {
  if(req.file) {
    req.body.original = 'original/' + req.file.filename;
  }
  next();

}, readExif, makeThumbImg, makeMediumImg, updateDataToDB);

// Delete stored data
router.delete('/:id', (req,res) => {
  Recipe.findByIdAndRemove(req.params.id, (err, recipe) => {
    if (err)
      console.log("ERROR" + err);

    if (!recipe) {
      return res.status(404).
          send({message: "Recipe not found with id " + req.params.id});
    }

    res.send({message: "Recipe deleted successfully!"});
  });
});

module.exports = router;

const toDecimal = (gpsData,ref) => {
  let coordinate = gpsData[0] + gpsData[1]/60 + gpsData[2]/3600;
  return (ref == "S" || ref == "W") ? coordinate*-1 : coordinate;
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
