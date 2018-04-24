const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Authentication failed' });
        }
        if (!user.checkPassword(password)) {
          return done(null, false, { message: 'Authentication failed' });
        }
        user.password = '';
        return done(null, user);
      })
    })
);

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
  done(null, { _id: user._id });
});

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
  User.findOne(
      { _id: id },
      'username',
      (err, user) => {
        user.password = '';
        done(null, user);
      }
  )
});

module.exports = passport;
