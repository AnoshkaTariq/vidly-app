const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
    mongoose.connect('mongodb://localhost:27017/vidly', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
        .then(() => winston.info('Connected to mongoDB'));
};