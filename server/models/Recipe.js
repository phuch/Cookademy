const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recipe = new Schema({
  category: String,
  title: String,
  details: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  time: String,
  thumbnail: String,
  image: String,
  original: String
});

module.exports = mongoose.model('Recipe', recipe);