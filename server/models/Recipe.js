const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recipe = new Schema({
  id: Number,
  time: String,
  category: String,
  title: String,
  details: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  thumbnail: String,
  image: String,
  original: String
});

module.exports = mongoose.model('Recipe', recipe);