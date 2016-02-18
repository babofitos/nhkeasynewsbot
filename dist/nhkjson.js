'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request');
var logger = require('./logger.js');

module.exports = function () {
  return new _promise2.default(function (resolve, reject) {
    request({
      "url": 'http://www3.nhk.or.jp/news/easy/news-list.json',
      "encoding": 'utf8'
    }, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        logger.info('Got NHK JSON');
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};