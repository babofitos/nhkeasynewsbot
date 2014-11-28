var stream = require('stream');
var config = require('./config.json');
var source = require('./package.json').repository.url;

module.exports = function() {
  var add = new stream.Transform({objectMode: true});
  var total = [];

  add._transform = function(chunk, encoding, done) {
    var title = chunk.title;
    var article = chunk.article;
    var date = chunk.date;
    var url = chunk.url;

    title = addDateToTitle(date, title);
    article = addUrlToArticle(url, article);
    article = addBotInfoToText(article);
    total.push({
      title: title, 
      article: article
    });
    done();
  }

  add._flush = function(done) {
    bufferPush.call(this, total, done);
  }

  return add;
}

function bufferPush(total, cb) {
  var articleAndTitle = total.shift();
  
  setTimeout(pushArticleAndTitle.bind(this), config.delay);

  function pushArticleAndTitle() {
    this.push(articleAndTitle);
    if (total.length) {
      bufferPush.call(this, total, cb);
    } else {
      cb();
    }
  }
}

function addUrlToArticle(url, article) {
  return url + config.separator + article;
}

function addDateToTitle(date, title) {
  function formatDate(date) {
    date = date.split('-');
    date = date.slice(1).concat(date[0]).join('/');
    return '[' + date + '] ';
  }

  var formatDate = formatDate(date);

  return formatDate + title;
}

function addBotInfoToText(article) {
  return article + config.separator + '*I am a bot* | [Source](' + source + ')';
}
