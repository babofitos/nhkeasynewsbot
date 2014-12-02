var assert = require('assert');
var stream = require('stream');
var addToArticleInit = require('../add_to_article.js');
var send = {
  title: 'title',
  article: 'article',
  date: '2014-11-01',
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

  it('should reverse date and separate by /', function() {
    var date = send.date.split('-');
    date = date.slice(1).concat(date[0]).join('/');
    date = '[' + date + ']';

    addToArticle.on('data', function(data) {
      var returnedDate = data.title.split(' ')[0];

      assert.equal(returnedDate, date);
    });
  });

  it('should add date to title', function() {
    addToArticle.on('data', function(data) {
      var date = send.date.split('-');
      date = date.slice(1).concat(date[0]).join('/');
      
      assert.equal(data.title, '[' + date + '] ' + send.title);
    });
  });

  it('should add url and bot info to article', function() {
    addToArticle.on('data', function(data) {
      assert.equal(data.article, 
        send.url + separator + send.article + separator + '*I am a bot* | [Source](' + source + ')' 
      );
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