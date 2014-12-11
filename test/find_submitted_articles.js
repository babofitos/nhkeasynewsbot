var assert = require('assert');
var findSubmittedArticles = require('../lib/find_submitted_articles.js');

describe('findSubmittedArticles', function() {
  it('should return id from nhk url in a post', function(done) {
    var url = 'http://www3.nhk.or.jp/news/easy/k10013783971000/k10013783971000.html';
    
    findSubmittedArticles(url, function(err, id) {
      assert.equal('k10013783971000', id);
      done();
    });
  });

  it('should not return if no url in post', function(done) {
    findSubmittedArticles('foo', function(err, id) {
      assert.equal(null, id);
      done();
    });
  });
});