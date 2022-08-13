const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  text: { type: String, required: true },
  dateAdded: { type: Date },
});

MessageSchema.virtual('url').get(function () {
  return '/messages/' + this.id;
});

MessageSchema.virtual('date').get(function () {
  return moment(this.dateAdded).fromNow();
});

module.exports = mongoose.model('Message', MessageSchema);
