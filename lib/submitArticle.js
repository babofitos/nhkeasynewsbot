var reddit = require('./reddit.js');
var logger = require('./logger.js');

module.exports = function(data, cb) {
  submitArticle(data, function(err, articleAndTitle) {
    if (err) {
      cb(err);
    } else {
      cb(null, articleAndTitle);
    }
  });

  function submitArticle(articleAndTitle, cb) {
    var title = articleAndTitle.title;
    var text = articleAndTitle.article;
    reddit.submit(title, text, function(err) {
      if (err) {
        cb(err);
      } else {
        logger.info('Successful submit for %s', title);
        cb(null, articleAndTitle);
      }
    });
  }
};