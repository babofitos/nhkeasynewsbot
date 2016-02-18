'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = require('./logger.js');
var urlre = /http:\/\/www3\.nhk\.or\.jp\/news\/easy\/k\d+\/k\d+\.html/;
var kidre = /k\d+/;

module.exports = function (json) {
  var foundArticleIds = [];
  json = JSON.parse(json);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(json.data.children), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var child = _step.value;

      var selftext = child.data.selftext;
      var nhkurl = selftext.match(urlre);
      if (nhkurl !== null) {
        var kid = nhkurl[0].match(kidre);

        foundArticleIds.push(kid[0]);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  logger.info('foundArticleIds %j', foundArticleIds);
  return foundArticleIds;
};