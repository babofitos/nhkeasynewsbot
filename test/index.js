var assert = require('assert');
var nock = require('nock');
var index = require('../lib/index.js');
var fs = require('fs');
var mockResponse = fs.readFileSync(__dirname + '/mock.html');
var articleId = 'k10013688691000';
var date = new Date('Dec 4 2014');
var reddit = require('../lib/reddit.js');

describe('index', function() {
  this.timeout(4200);

  it('should submit article', function(done) {
    nock('http://www3.nhk.or.jp')
    .get('/news/easy/news-list.json')
    .reply(200, '0[{"2014-12-04":[{"news_id":"' + articleId + '"}]}]');

    nock('https://www.reddit.com')
    .get('/r/' + reddit.subreddit + '/new.json')
    .reply(200, {
      data: {
        children: [
        {
          data: {
            selftext: 'k1'
          }
        }
        ]
      }
    });

    nock('http://www3.nhk.or.jp')
    .get('/news/easy/' + articleId + '/' + articleId + '.html')
    .reply(200, mockResponse);

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

    index(date, function(err) {
      assert.equal(err, null);
      done();
    });


  });
});
