var assert = require('assert');
var stream = require('stream');
var nock = require('nock');
var reddit = require('../reddit.js');
var submitArticleInit = require('../submitArticle.js')(reddit);
global.subreddit = 'asdfasdf';
var mockObj = {
  title: 'title',
  article: 'article'
}

describe('submitArticle', function() {
  it('should emit error when unable to reddit submit', function(done) {
    nock('https://api.reddit.com')
      .filteringRequestBody(function(path) {
        return 'ABC';
      })
      .post('/api/submit',
        'ABC')
      .reply(404);

    var rs = createReadStream();
    var submitArticle = submitArticleInit();
    rs.pipe(submitArticle);

    submitArticle.on('error', function(err) {
      assert.equal(err, 'Unsuccessful reddit submit');
      done();
    });
  });

  it('should emit success on good submit', function(done) {
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

    var rs = createReadStream();
    var submitArticle = submitArticleInit();
    rs.pipe(submitArticle);

    submitArticle.on('success', function(obj) {
      assert.equal(obj.title, mockObj.title);
      assert.equal(obj.article, mockObj.article);
      done();
    });
  });
});

function createReadStream() {
  var rs = new stream.Readable({objectMode: true});

  rs._read = function() {
    rs.push(mockObj);
    rs.push(null);
  }

  return rs;
}