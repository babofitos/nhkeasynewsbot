var reddit = require('./reddit.js');
var logger = require('./logger.js');

module.exports = function(articles) {
  articles.map(function(article, i) {
    setTimeout(function() {
      submitArticle(article)
    }, 10000*i);
  });

  async function submitArticle(article) {
    var title = article.title;
    var text = article.article;
    try {
      await reddit.submit(title, text);
      logger.info('Successful submit for %s', title);
    } catch(err) {
      console.log(err);
    }
  }
};