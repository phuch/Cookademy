const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('user signup');
  // ADD VALIDATION
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log('Users.js post error: ', err)
    } else if (user) {
      res.json({
        error: `Username ${req.body.username} already exist`
      });
    } else {
      console.log('create user');
      // create new user in the database
      User.create(req.body).then(user => {
        res.send(user);
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
      const userInfo = {
        username: req.user.username
      };
      res.send(userInfo);
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