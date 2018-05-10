const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recipe = new Schema({
  category: String,
  title: String,
  details: String,
  ingredients: [{
    id: Number,
    name: String,
    quantity: String,
  }],
  instruction: String,
  time: String,
  imagePublicId: String,
  imageUrl: String,
  secureImageUrl: String,
  thumbnail: String,
  image: String,
  original: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Recipe', recipe);