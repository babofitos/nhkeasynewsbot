var config = require('../config.json');
var source = require('../package.json').repository.url;

module.exports = function(data, cb) {
  var date = require('./date.js').current();
  var title = addDateToTitle(date, data.title);
  var article = addUrlToArticle(data.url, data.article);
  article = addBotInfoToText(article);

  cb(null, {
    title: title,
    article: article
  });
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
