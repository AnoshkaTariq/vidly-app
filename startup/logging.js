const winston = require('winston');
require('express-async-errors');

module.exports = function () {
    winston.exceptions.handle(
        winston.add(new winston.transports.Console()),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
}