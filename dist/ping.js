'use strict';

var logger = require('./logger.js');
var http = require('http');
var config = require('../config.js');

module.exports = function (pingInterval) {
  // ping ourselves
  setInterval(function () {
    http.get(config.url, function (res) {
      logger.info('ping');
    });
  }, pingInterval);
};