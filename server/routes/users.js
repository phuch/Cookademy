const express = require('express');
const passport = require('../passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();


/**
* @api {post} /users/register Register a new account
* @apiGroup Users
* @apiParam {String} name Full name
* @apiParam {String} username Username
* @apiParam {String} password Password
* @apiParamExample {json} Input
*    {
*      "name": "John Doe",
*      "username": "j.d@gmail.com",
*      "password": "******"
*    }
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Successful created new user.
* @apiErrorExample {json} Register error
*    HTTP/1.1 500 Internal Server Error
*/
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


/**
* @api {post} /users/login Register a new account
* @apiGroup Users
* @apiParam {String} username Username
* @apiParam {String} password Password
* @apiParamExample {json} Input
*    {
*      "username": "j.d@gmail.com",
*      "password": "******"
*    }
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Successfully logged in.
* @apiErrorExample {json} Athentication error
*    HTTP/1.1 401 Authentication failed.
* @apiErrorExample {json} Login error
*    HTTP/1.1 500 Internal Server Error
*/
router.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          user.password = '';
          const token = jwt.sign(user.toJSON(), process.env.SESSION_SECRET);
          // return the information including token as JSON
          res.send({success: true, token: 'JWT ' + token, msg: 'Successfully' +
            ' logged in.'});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed.'});
        }
      });
    }
  });
});

/**
* @api {get} /users List all user
* @apiGroup Users
* @apiSuccess {Object[]} users User list
* @apiSuccess {Number} user._id User id
* @apiSuccess {String} user.name User full name
* @apiSuccess {String} user.username Username
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    [{
*      "_id": 5adf32533ea8200e0caf47df,
*      "name": "John Doe",
*      "username": "j.d@gmail.com"
*    }]
* @apiErrorExample {json} List user error
*    HTTP/1.1 500 Internal Server Error
*/
router.get('/', (req, res, next) => {
  Category.find().then(u => {
    const users = u.map(user => {
      delete user.password;
    });
    res.send(users);
  });
});

module.exports = router;