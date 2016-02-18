'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var main = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return reddit.login(config.username, config.password);

          case 3:
            setInterval((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
              var nhkBody, todaysArticleIds, redditBody, submittedArticleIds, unsubmittedArticleIds, articles;
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      date.new(new Date());
                      _context.next = 3;
                      return nhkJSON();

                    case 3:
                      nhkBody = _context.sent;
                      todaysArticleIds = getArticleId(nhkBody);
                      _context.next = 7;
                      return reddit.json();

                    case 7:
                      redditBody = _context.sent;
                      submittedArticleIds = findSubmittedArticles(redditBody);
                      unsubmittedArticleIds = checkDupe(todaysArticleIds, submittedArticleIds);
                      _context.next = 12;
                      return _promise2.default.all(scrapeArticle(unsubmittedArticleIds));

                    case 12:
                      articles = _context.sent;

                      articles = formatSubmission(articles);
                      submitArticles(articles);

                    case 15:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, this);
            })), config.loopInterval);

            _context2.next = 10;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](0);

            console.error(_context2.t0);
            throw _context2.t0;

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 6]]);
  }));
  return function main() {
    return ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nhkJSON = require('./nhkjson.js');
var getArticleId = require('./get_article_id.js');
var reddit = require('./reddit.js');
var findSubmittedArticles = require('./find_submitted_articles.js');
var checkDupe = require('./check_dupe.js');
var scrapeArticle = require('./scrape_article.js');
var formatSubmission = require('./format_submission.js');
var submitArticles = require('./submit_articles.js');
var config = require('../config.js');
var http = require('http');
//parse today's date into YYYY-MM-DD format
var date = require('./date.js');

var server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('A reddit bot for /r/NHKEasyNews');
});
server.listen(config.port);

require('./ping.js')(config.pingInterval);

module.exports = main;