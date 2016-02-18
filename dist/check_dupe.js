'use strict';

var logger = require('./logger.js');

module.exports = function (nhkJSONArticleIds, redditSubmittedArticleIds) {
  var unsubmitted = nhkJSONArticleIds.filter(function (id) {
    return redditSubmittedArticleIds.indexOf(id) < 0;
  });
  logger.info('Unsubmitted Articles %j', unsubmitted);
  return unsubmitted;
};