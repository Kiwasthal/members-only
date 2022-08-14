const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = require('../models/user');

const verifyCb = (req, username, password, done) => {
  //Reset error messages
  req.flash('message', '');
  User.findOne({ username: username }).exec((err, user) => {
    if (!user) return done(null, false, req.flash('message', 'User not found'));
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      else
        return done(null, false, req.flash('message', 'Incorrect password.'));
    });
  });
};

const strategy = new LocalStrategy({ passReqToCallback: true }, verifyCb);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId).exec((err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});
