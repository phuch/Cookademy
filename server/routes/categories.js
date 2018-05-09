const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

/**
* @api {get} /categories List all categories
* @apiGroup Categories
* @apiSuccess {Object[]} categories Category list
* @apiSuccess {Number} categoy._id Category id
* @apiSuccess {String} category.name Category name
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    [{
*      "_id": 5ae6e5ce783d660392b96fb5,
*      "name": "Dessert"
*    }]
* @apiErrorExample {json} List category error
*    HTTP/1.1 500 Internal Server Error
*/

router.get('/', (req, res) => {
    Category.find().then(categories => {
      res.send(categories);
    });
});

module.exports = router;
