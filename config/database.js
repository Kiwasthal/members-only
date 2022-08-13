const mongoose = require('mongoose');

require('dotenv').config();
const mongoString = process.env.MONGO_URI || process.env.MONGO_DEV_STRING;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = mongoose
  .connect(mongoString, mongoOptions)
  .then(monG => monG.connection.getClient());

module.exports = client;
