var assert = require('assert');
var addToArticle = require('../lib/add_to_article.js');
var send = {
  title: 'title',
  article: 'article',
  url: 'http://www.example.com'
};
var config = require('../config.json');
var separator = config.separator;
var source = require('../package.json').repository.url;
var date = require('../lib/date.js');

describe('addToArticle', function() {
  it('should reverse date and separate by /', function(done) {
    date.new(new Date('Nov 1 2014'));
    var now = date.current();
    now = now.split('-');
    now = now.slice(1).concat(now[0]).join('/');
    now = '[' + now + ']';

    addToArticle(send, function(err, data) {
      var returnedDate = data.title.split(' ')[0];

      assert.equal(returnedDate, now);
      done();
    });
  });

  it('should add date to title', function(done) {
    addToArticle(send, function(err, data) {
      date.new(new Date('Nov 1 2014'));
      var now = date.current();
      now = now.split('-');
      now = now.slice(1).concat(now[0]).join('/');
      
      assert.equal(data.title, '[' + now + '] ' + send.title);
      done();
    });
  });

  it('should add url and bot info to article', function() {
    addToArticle(send, function(err, data) {
      assert.equal(data.article, 
        send.url + separator + send.article + separator + '*I am a bot* | [Source](' + source + ')' 
      );
    });
  });
});