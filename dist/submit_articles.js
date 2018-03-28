'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reddit = require('./reddit.js');
var logger = require('./logger.js');

module.exports = function (articles) {
  var submitArticle = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(article) {
      var title, text;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              title = article.title;
              text = article.article;
              _context.prev = 2;
              _context.next = 5;
              return reddit.submit(title, text);

            case 5:
              logger.info('Successful submit for %s', title);
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context['catch'](2);

              console.log(_context.t0);

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 8]]);
    }));

    return function submitArticle(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  articles.map(function (article, i) {
    setTimeout(function () {
      submitArticle(article);
    }, 10000 * i);
  });
};