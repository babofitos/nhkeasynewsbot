var environment = process.env.NODE_ENV || 'development';
var logLevel = environment == 'development' ? 'debug' : 'info';
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({level: logLevel})
  ]
});

module.exports = logger;