const express = require('express');
const Recipe = require('../models/Recipe');
const passport = require('../passport');

const router = express.Router();

const multer = require("multer");
const moment = require("moment");
const sharp = require("sharp");

const upload = multer({ dest: 'public/original/' });
moment.locale();

// Middleware functions
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

/**
* @api {get} /recipes List all recipes
* @apiGroup Recipes
* @apiSuccess {Object[]} recipes List of recipes
* @apiSuccess {String} recipes._id Recipe id
* @apiSuccess {Object[]} reicpes.ingredients List of ingredients
* @apiSuccess {String} recipes.category Recipe category
* @apiSuccess {String} reicpes.title Recipe title
* @apiSuccess {String} recipes.details Recipe description
* @apiSuccess {Number} recipes.instruction Recipe instruction
* @apiSuccess {String} recipes.time Time posted
* @apiSuccess {String} recipes.imageUrl Recipe image url
* @apiSuccess {String} recipes.imagePublicId Recipe image public id
* @apiSuccess {String} recipes.secureImageUrl Recipe secured image url
* @apiSuccess {String} recipes.user User which recipe belong to
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    [{
*       "ingredients": [
*         {
*           "name": "milk",
*           "quantity": "200ml"
*         },
*         {
*           "name": "sugar",
*           "quantity": "100gr"
*         }
*       ],
*      "_id": "5ac65aab6725cd685c6346f1",
*      "category": "Dessert",
*      "title": "Sweetened milk ",
*      "details": "A delicious milk",
*      "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
*      "time": "May 3rd 2018, 6:38"
*      "imageUrl": "http://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "imagePublicId": "shrimp-and-zucchini-recipe-5_nlbnxw",
*      "secureImageUrl":
*        "https://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "user": {
*         "_id" : "5aeb2cd48781704af2a10e57",
*         "name": "John Doe"
*       }
*    }]
* @apiErrorExample {json} List error
*    HTTP/1.1 500 Internal Server Error
*/

/**
* @api {get} /recipes/?query_param=:title Find recipes by name
* @apiGroup Recipes
* @apiParam {String} query_id Search query parameter
* @apiParam {String} title Recipe's title
* @apiSuccess {Object[]} recipes List of recipes
* @apiSuccess {String} recipes._id Recipe id
* @apiSuccess {Object[]} reicpes.ingredients List of ingredients
* @apiSuccess {String} recipes.category Recipe category
* @apiSuccess {String} reicpes.title Recipe title
* @apiSuccess {String} recipes.details Recipe description
* @apiSuccess {String} recipes.instruction Recipe instruction
* @apiSuccess {String} recipes.time Time posted
* @apiSuccess {String} recipes.imageUrl Recipe image url
* @apiSuccess {String} recipes.imagePublicId Recipe image public id
* @apiSuccess {String} recipes.secureImageUrl Recipe secured image url
* @apiSuccess {String} recipes.user User which recipe belong to
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    [{
*       "ingredients": [
*         {
*           "name": "milk",
*           "quantity": "200ml"
*         },
*         {
*           "name": "sugar",
*           "quantity": "100gr"
*         }
*       ],
*      "_id": "5ac65aab6725cd685c6346f1",
*      "category": "Dessert",
*      "title": "Sweetened milk ",
*      "details": "A delicious milk",
*      "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
*      "time": "May 3rd 2018, 6:38"
*      "imageUrl": "http://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "imagePublicId": "shrimp-and-zucchini-recipe-5_nlbnxw",
*      "secureImageUrl":
*        "https://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "user": {
*         "_id" : "5aeb2cd48781704af2a10e57",
*         "name": "John Doe"
*       }
*    }]
* @apiErrorExample {json} Recipe not found
*    HTTP/1.1 404 Recipe Not Found
* @apiErrorExample {json} Find error
*    HTTP/1.1 500 Internal Server Error
*/
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  if (token) {
    if (req.query.search) {
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


/**
* @api {get} /recipes/:userid Find recipes belong to a user
* @apiGroup Recipes
* @apiParam {String} User id param
* @apiSuccess {Object[]} recipes List of recipes
* @apiSuccess {String} recipes._id Recipe id
* @apiSuccess {Object[]} reicpes.ingredients List of ingredients
* @apiSuccess {String} recipes.category Recipe category
* @apiSuccess {String} reicpes.title Recipe title
* @apiSuccess {String} recipes.details Recipe description
* @apiSuccess {String} recipes.instruction Recipe instruction
* @apiSuccess {String} recipes.time Time posted
* @apiSuccess {String} recipes.imageUrl Recipe image url
* @apiSuccess {String} recipes.imagePublicId Recipe image public id
* @apiSuccess {String} recipes.secureImageUrl Recipe secured image url
* @apiSuccess {String} recipes.user User which recipe belong to
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    [{
*       "ingredients": [
*         {
*           "name": "milk",
*           "quantity": "200ml"
*         },
*         {
*           "name": "sugar",
*           "quantity": "100gr"
*         }
*       ],
*      "_id": "5ac65aab6725cd685c6346f1",
*      "category": "Dessert",
*      "title": "Sweetened milk",
*      "details": "A delicious milk",
*      "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
*      "time": "May 3rd 2018, 6:38"
*      "imageUrl": "http://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "imagePublicId": "shrimp-and-zucchini-recipe-5_nlbnxw",
*      "secureImageUrl": "https://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "user": "5aeb2cd48781704af2a10e57"
*    },
*    {
*       "ingredients": [
*         {
*           "name": "eggs",
*           "quantity": "2"
*         },
*         {
*           "name": "flour",
*           "quantity": "300gr"
*         }
*       ],
*      "_id": "5ac65aab6725cd685c6346f1",
*      "category": "Dessert",
*      "title": "Pancakes",
*      "details": "A fantastic pancake",
*      "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
*      "time": "May 3rd 2018, 6:38"
*      "imageUrl": "http://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "imagePublicId": "shrimp-and-zucchini-recipe-5_nlbnxw",
*      "secureImageUrl": "https://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "user": {
*         "_id" : "5aeb2cd48781704af2a10e57",
*         "name": "John Doe"
*       }
*    }]
* @apiErrorExample {json} Recipe not found
*    HTTP/1.1 404 Recipe Not Found
* @apiErrorExample {json} Find error
*    HTTP/1.1 500 Internal Server Error
*/
router.get('/:userid', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  if (token) {
    Recipe.find({user: req.params.userid})
    .populate('user', '_id name')
    .exec((err, recipes) => {
      if (err)
        console.log(err);

      if (!recipes)
        return res.status(404).send({message: "Recipe not found"});
      res.send(recipes);
    });
  }
});


/**
* @api {post} /recipes Add a new recipe
* @apiGroup Recipes
* @apiParam {String} category Recipe category
* @apiParam {String} title Recipe title
* @apiParam {String} details Recipe description
* @apiParam {String} instruction Recipe instruction
* @apiParam {Object[]} ingredients Recipe ingredients
* @apiParam {String} user Owner id of the recipe
* @apiParam {String} imageUrl Recipe image url
* @apiParam {String} imagePublicId Recipe image public id
* @apiParam {String} secureImageUrl Recipe secured image url
* @apiParamExample {json} Input
*    {
*     "category": "Main Dish",
*     "title": "Fried Egg",
*     "details": "Fried egg to eat with rice",
*     "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
*     "ingredients": "[{\"id\":1525985964240,\"name\":\"eggs\",\"quantity\":\"2\"}]",
*     "user": "5adf32533ea8200e0caf47df",
*     "imageUrl": "http://res.cloudinary.com/syris/image/upload/v1525984513/shrimp-and-zucchini-recipe-5_ks1kcr.jpg",
*     "imagePublicId": "shrimp-and-zucchini-recipe-5_ks1kcr",
*     "secureImageUrl": "https://res.cloudinary.com/syris/image/upload/v1525984513/shrimp-and-zucchini-reci-5_ks1kcr.jpg"
*    }
* @apiSuccess {String} _id Recipe id
* @apiSuccess {String} category Recipe category
* @apiSuccess {String} title Recipe title
* @apiSuccess {String} details Recipe's description
* @apiSuccess {Object[]} ingredients List of ingredients
* @apiSuccess {String} instruction Recipe instruction
* @apiSuccess {String} time Time posted
* @apiSuccess {String} imageUrl Recipe image url
* @apiSuccess {String} imagePublicId Recipe image public id
* @apiSuccess {String} secureImageUrl Recipe secured image url
* @apiSuccess {String} user User id which recipe belong to
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    [{
*       "ingredients": [
*         "name":"eggs",
*         "quantity":"2"
*       ],
*      "_id": "5ac65aab6725cd685c6346f1",
*      "category": "Main Dish",
*      "title": "Fried egg",
*      "description": "Fried egg to eat with rice",
*      "direction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
*      "time": "May 3rd 2018, 6:38",
*      "imageUrl": "http://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "imagePublicId": "shrimp-and-zucchini-recipe-5_nlbnxw",
*      "secureImageUrl": "https://res.cloudinary.com/syris/image/upload/v1525945949/shrimp-and-zucchini-recipe-5_nlbnxw.jpg",
*      "user": "5aeb2cd48781704af2a10e57"
*    }]
* @apiErrorExample {json} Register error
*    HTTP/1.1 500 Internal Server Error
*/
router.post('/', passport.authenticate('jwt', { session: false}), upload.single('file'), (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    req.body.time = moment().format('MMMM Do YYYY, h:mm');
    req.body.ingredients = JSON.parse(req.body.ingredients);
    next();
  }
}, createDataToDB);

/**
* @api {put} /recipes/:id Update a recipe
* @apiGroup Recipes
* @apiParam {String} category Recipe category
* @apiParam {String} title Recipe title
* @apiParam {String} details Recipe description
* @apiParam {String} instruction Recipe instruction
* @apiParam {Object[]} ingredients Recipe ingredients
* @apiParam {String} imageUrl Recipe image url
* @apiParam {String} imagePublicId Recipe image public id
* @apiParam {String} secureImageUrl Recipe secured image url
* @apiParamExample {json} Input
*    {
*     "category": "Main Dish",
*     "title": "Fried Egg",
*     "details": "A delicious fried egg",
*     "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
*     "ingredients": "[{\"id\":1525985964240,\"name\":\"egg\",\"quantity\":\"3\"}]",
*     "user": "5adf32533ea8200e0caf47df",
*     "imageUrl": "http://res.cloudinary.com/syris/image/upload/v1525984513/shrimp-and-zucchini-recipe-5_ks1kcr.jpg",
*     "imagePublicId": "shrimp-and-zucchini-recipe-5_ks1kcr",
*     "secureImageUrl": "https://res.cloudinary.com/syris/image/upload/v1525984513/shrimp-and-zucchini-reci-5_ks1kcr.jpg"
*    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 Recipe updated successfully.
 * @apiErrorExample {json} Recipe not found
 *    HTTP/1.1 404 Recipe Not Found
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
// Update stored data
router.put('/:id', passport.authenticate('jwt', { session: false}), upload.single('file'), (req,res,next) => {
  const token = getToken(req.headers);
  if (token) {
    if (req.body.ingredients) {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }
    next();
  }
}, updateDataToDB);

/**
* @api {delete} /recipes/:id Remove a recipe
* @apiGroup Recipes
* @apiParam {Number} id Recipe id
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Recipe deleted successfully.
* @apiErrorExample {json} Recipe not found
*    HTTP/1.1 404 Recipe Not Found
* @apiErrorExample {json} Delete error
*    HTTP/1.1 500 Internal Server Error
*/
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
