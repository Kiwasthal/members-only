const User = require('../models/user');
const { body, validationResult, check } = require('express-validator');
const passport = require('passport');

exports.user_create_get = (req, res, next) => {
  if (!req.user) res.render('user_create_form', { title: 'Sign-Up' });
  else res.redirect('/messages');
};

exports.user_create_post = [
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ max: 20 })
    .withMessage('User Name is too long')
    .escape(),
  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password is too short')
    .isLength({ max: 20 })
    .withMessage('Password is too long')
    .escape(),
  body('firstname', 'First name must not be empty')
    .trim()
    .isLength({ max: 20 })
    .withMessage('First name is too long')
    .escape(),
  body('lastname', 'Last name must not be empty')
    .trim()
    .isLength({ max: 20 })
    .withMessage('Last name is too long')
    .escape(),
  check('username')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username'),
  check('password')
    .exists()
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the password'),
  check('repeat_password', 'Passwords do not match')
    .exists()
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    let errors = validationResult(req);

    let user = new User({
      membershipStatus: 'member',
      password: req.body.password,
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    User.findOne({ username: req.body.username }).exec((err, existingUser) => {
      if (!errors.isEmpty() || existingUser) {
        res.render('user_create_form', {
          title: 'Sign-Up',
          errors: errors.array(),
          exerr: existingUser ? 'Username already exists' : null,
          user,
        });
        return;
      } else {
        user.save(err => {
          if (err) return next(err);
          res.redirect('/messages');
        });
      }
    });
  },
];

exports.user_login_get = (req, res, next) => {
  if (!req.user)
    res.render('user_login_form', {
      title: 'Log-in',
    });
  else res.redirect('/messages');
};

exports.user_login_post = passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/',
  failureMessage: true,
});

exports.user_logout_get = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/messages');
  });
};
