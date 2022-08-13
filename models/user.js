const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 20 },
  lastname: { type: String, required: true, maxLength: 20 },
  membershipStatus: {
    type: String,
    required: true,
    enum: ['member', 'admin'],
  },
  username: { type: String, required: true, maxLength: 20 },
  password: { type: String, required: true, maxLength: 20, minLenght: 6 },
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR));
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function (candidPass, cb) {
  bcrypt.compare(candidPass, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.virtual('full_name').get(function () {
  return `${this.lastname}-${this.firstname}`;
});

module.exports = mongoose.model('User', UserSchema);
