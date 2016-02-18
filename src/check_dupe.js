let logger = require('./logger.js');

module.exports = function(nhkJSONArticleIds, redditSubmittedArticleIds) {
  let unsubmitted = nhkJSONArticleIds.filter(function(id) {
    return redditSubmittedArticleIds.indexOf(id) < 0;
  });
  logger.info('Unsubmitted Articles %j', unsubmitted);
  return unsubmitted;
}