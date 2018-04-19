const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
  username: String,
  password: String
});

user.methods = {
  checkPassword: function (inputPassword) {
    return inputPassword === this.password;
  }
};

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', user);