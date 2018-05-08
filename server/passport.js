const passport = require('passport');
const User = require('./models/User');
const JwtStrategy   = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require('dotenv').config();


const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey   : process.env.SESSION_SECRET
}

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  User.findOne({_id: jwt_payload._id}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));

// called on login, saves the id to session req.session.passport.user = {id:'..'}
// passport.serializeUser((user, done) => {
//   done(null, { _id: user._id });
// });

// user object attaches to the request as req.user
// passport.deserializeUser((id, done) => {
//   User.findOne(
//       { _id: id },
//       'username',
//       (err, user) => {
//         user.password = '';
//         done(null, user);
//       }
//   )
// });

module.exports = passport;
