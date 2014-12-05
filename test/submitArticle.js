var assert = require('assert');
var stream = require('stream');
var nock = require('nock');
var submitArticle = require('../submitArticle.js');
var mockObj = {
  title: 'title',
  article: 'article'
};

describe('submitArticle', function() {
  it('should error when unable to reddit submit', function(done) {
    nock('https://api.reddit.com')
      .filteringRequestBody(function(path) {
        return 'ABC';
      })
      .post('/api/submit',
        'ABC')
      .reply(404);

    submitArticle(mockObj, function(err, articleAndTitle) {
      assert.equal(err, 'Unsuccessful reddit submit');
      done();
    });
  });

  it('should return article and title on good submit', function(done) {
    nock('https://api.reddit.com')
      .filteringRequestBody(function(path) {
        return 'ABC';
      })
      .post('/api/submit',
        'ABC')
      .reply(200, {
        json: {
          errors: []
        }
      });

    submitArticle(mockObj, function(err, articleAndTitle) {
      assert.equal(articleAndTitle.title, mockObj.title);
      assert.equal(articleAndTitle.article, mockObj.article);
      done();
    });
  });
});
