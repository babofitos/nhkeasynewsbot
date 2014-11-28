var assert = require('assert');
var stream = require('stream');
var addToArticleInit = require('../add_to_article.js');
var send = {
  title: 'title',
  article: 'article',
  date: '11/1/2014',
  url: 'http://www.example.com'
}
var config = require('../config.json');
var separator = config.separator;
var source = require('../package.json').repository.url;

describe('addToArticle', function() {
  var rs;
  var addToArticle;

  beforeEach(function() {
    rs = createReadStream();
    addToArticle = addToArticleInit();
    rs.pipe(addToArticle);
  });

  it('should add date to title', function() {
    addToArticle.on('data', function(data) {
      assert.equal(data.title, '[' + send.date + '] ' + send.title)
    });
  });

  it('should add url and bot info to article', function() {
    addToArticle.on('data', function(data) {
      assert.equal(data.article, 
        send.url + separator + send.article + separator + '*I am a bot* | [Source](' + source + ')' 
      )
    });
  });
});

function createReadStream() {
  var rs = new stream.Readable({objectMode: true});
  rs._read = function() {
    rs.push(send);
    rs.push(null);
  }
  return rs;
}