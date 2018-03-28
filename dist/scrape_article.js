'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nhkeasy = require('nhkeasy');
var config = require('../config.js');
var logger = require('./logger.js');
var request = require('request');

module.exports = function (articleIds) {
  //id -> article url -> article object
  return articleIds.map(makeEasyUrl).map(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', scrapeArticle(url));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

function makeEasyUrl(id) {
  var url = 'http://www3.nhk.or.jp/news/easy/' + id + '/' + id + '.html';

  return url;
}

function scrapeArticle(url) {
  return new _promise2.default(function (resolve, reject) {
    request(url, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        nhkeasy({ separator: config.separator }, body, function (err, d) {
          if (err) {
            reject(err);
          } else {
            d.url = url;
            logger.info('Scraped ' + d.url);
            resolve(d);
          }
        });
      } else {
        reject(err);
      }
    });
  });
}