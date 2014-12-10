var assert = require('assert');
var nock = require('nock');
var reddit = require('../lib/reddit.js');
var checkDupe = require('../lib/check_dupe.js');
var mockId = 'k123';
var mockId2 = 'k124';
var format = require('util').format;
var mockSelfText = format('http://www3.nhk.or.jp/news/easy/%s/%s.html', mockId, mockId);
var mockSelfTextNonDupe = format('http://www3.nhk.or.jp/news/easy/%s/%s.html', 'k122', 'k122');
describe('checkDupe', function() {
  it('should error when cannot get new.json', function(done) {
    nock('https://www.reddit.com')
      .get('/r/' + reddit.subreddit + '/new.json')
      .reply(404);

    checkDupe([1,2,3], function(err) {
      assert.equal(err, 'Error getting reddit new.json');
      done();
    });
  });

  it('should error when no articles found', function(done) {
    checkDupe([], function(err) {
      assert.equal(err, 'No articles for date found.');
      done();
    });
  });

  it('should push non duplicate ids', function(done) {
    nock('https://www.reddit.com')
      .get('/r/' + reddit.subreddit + '/new.json')
      .reply(200, {
        data: {
          children: [
            {
              data: {
                selftext: mockSelfTextNonDupe
              }
            }
          ]
        }
      });

    checkDupe([mockId, mockId2], function(err, ids) {
      assert.equal(err, null);
      assert.deepEqual(ids, [mockId, mockId2]);
      done();
    });
  });

  it('should not push if all ids are dupes', function(done) {
    nock('https://www.reddit.com')
      .get('/r/' + reddit.subreddit + '/new.json')
      .reply(200, {
        data: {
          children: [
            {
              data: {
                selftext: mockSelfText
              }
            }
          ]
        }
      });

    checkDupe([mockId], function(err, ids) {
      assert.equal(err, 'No non-duplicates found.');
      done();
    });
  });

  it('should not error when no url in selftext', function(done) {
    nock('https://www.reddit.com')
      .get('/r/' + reddit.subreddit + '/new.json')
      .reply(200, {
        data: {
          children: [
            {
              data: {
                selftext: 'blah'
              }
            }
          ]
        }
    });

    checkDupe([mockId], function(err, ids) {
      assert.equal(err, null);
      assert.equal(ids, mockId)
      done();
    });
  });
});