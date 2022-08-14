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
    .withMessage({
      errCode: 1,
      errMsg: 'User Name is too long',
    })
    .escape(),
  body('password', 'Password must not be empty')
    .isLength({ min: 6 })
    .withMessage({
      errCode: 2,
      errMsg: 'Password is too short',
    })
    .isLength({ max: 20 })
    .withMessage({
      errCode: 2,
      errMsg: 'Password is too long',
    })
    .escape(),
  body('firstname', 'First name must not be empty')
    .trim()
    .isLength({ max: 20 })
    .withMessage({
      errCode: 3,
      errMsg: 'First name is too long',
    })
    .escape(),
  body('lastname', 'Last name must not be empty')
    .trim()
    .isLength({ max: 20 })
    .withMessage({
      errCode: 4,
      errMsg: 'Last name is too long',
    })
    .escape(),
  check('username')
    .custom(value => !/\s/.test(value))
    .withMessage({
      errCode: 1,
      errerrMsg: 'No spaces are allowed in the username',
    })
    .custom(async value => {
      return User.findOne({ username: value }).then(user => {
        if (user)
          return Promise.reject({
            errCode: 1,
            errMsg: 'Username already in use',
          });
      });
    }),
  check('password')
    .exists()
    .custom(value => !/\s/.test(value))
    .withMessage({
      errCode: 2,
      errMsg: 'No spaces are allowed in the password',
    }),
  check('repeat_password', { errCode: 2, errMsg: 'Passwords do not match' })
    .exists()
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    let errors = validationResult(req);
    console.log(errors);

    let user = new User({
      membershipStatus: 'member',
      password: req.body.password,
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    if (!errors.isEmpty()) {
      res.render('user_create_form', {
        title: 'Sign-Up',
        errors: errors.array(),
        user,
      });
      return;
    } else {
      user.save(err => {
        if (err) return next(err);
        res.redirect('/messages');
      });
    }
  },
];

exports.user_login_get = (req, res, next) => {
  let errM = req.flash('message');
  console.log(errM[0]);
  if (!req.user)
    res.render('user_login_form', {
      title: 'Log-in',
      error:
        typeof errM[0] === 'undefined'
          ? ''
          : { message: errM[0], code: errM[0] === 'User not found' ? 1 : 2 },
    });
  else res.redirect('/messages');
};

exports.user_login_post = passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/',
  failureFlash: true,
});

exports.user_logout_get = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/messages');
  });
};
