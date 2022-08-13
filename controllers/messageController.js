const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const moment = require('moment');

exports.index = (req, res, next) => {
  Message.find()
    .populate('author')
    .exec((err, messages) => {
      if (err) return next(err);
      if (!req.user) res.render('index', { title: 'Home', messages });
      else res.render('clubhouse', { title: 'Club-House', messages });
    });
};

exports.message_create_get = (req, res, next) => {
  if (!req.user) res.redirect('/messages');
  res.render('message_create_form', {
    title: 'Create Message',
  });
};

exports.message_create_post = [
  body('title', 'Title must not be empty')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Please add a more descriptive tile')
    .escape(),
  body('text', 'Message text must not be empty')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Please add a more descriptive message text')
    .escape(),
  (req, res, next) => {
    let errors = validationResult(req);

    User.findOne({ username: req.user.username }).exec((err, user) => {
      if (err) return next(err);
      let message = new Message({
        author: user,
        title: req.body.title,
        text: req.body.text,
        dateAdded: moment(),
      });
      if (!errors.isEmpty()) {
        res.render('message_create_form', {
          title: 'Create Message',
          errors: errors.array(),
        });
      } else {
        message.save(err => {
          if (err) return next(err);
          res.redirect('/messages');
        });
      }
    });
  },
];
