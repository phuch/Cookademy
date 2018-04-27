const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/register', (req, res) => {
  console.log('user signup');
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save((err) => {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/login', (req, res) => {
  console.log('user login');
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.toJSON(), process.env.SESSION_SECRET);
          // return the information including token as JSON
          res.send({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


router.get('/', (req, res, next) => {
  if (req.user) {
    res.json({ user: req.user })
  } else {
    res.json({ user: null })
  }
});

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send({ msg: 'logging out' })
  } else {
    res.send({ msg: 'no user to log out' })
  }
});

module.exports = router;