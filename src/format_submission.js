let config = require('../config.js');
let source = require('../package.json').repository.url;

module.exports = function(articles) {
  let date = require('./date.js').current();
  return articles.map(function(article) {
    article.title = addDateToTitle(date, article.title);
    article.article = addUrlToArticle(article.url, article.article);
    article.article = addBotInfoToText(article.article);
    return article;
  })
};

function addUrlToArticle(url, article) {
  return url + config.separator + article;
}

function addDateToTitle(date, title) {
  function formatDate(date) {
    date = date.split('-');
    date = date.slice(1).concat(date[0]).join('/');
    return '[' + date + '] ';
  }

  return formatDate(date) + title;
}

function addBotInfoToText(article) {
  return article + config.separator + '*I am a bot* | [Source](' + source + ')';
}
