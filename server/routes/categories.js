const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// get all recipes or find recipes by name
router.get('/', (req, res) => {
    Category.find().then(categories => {
      res.send(categories);
    });
});

module.exports = router;
