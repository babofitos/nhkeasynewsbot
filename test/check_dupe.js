var assert = require('assert');
var nock = require('nock');
var stream = require('stream');
var reddit = require('../reddit.js');
var checkDupeInit = require('../check_dupe.js')(reddit);
var mockId = 'k123';
global.subreddit = 'asdfasdf';

describe('checkDupe', function() {
  this.timeout(2100);

  it('should emit error when cannot get new.json', function() {
    var checkDupe = checkDupeInit();
    var rs = createReadStream();
    
    nock('https://www.reddit.com')
      .get('/r/' + global.subreddit + '/new.json')
      .reply(404);

    rs.pipe(checkDupe);

    checkDupe.on('error', function(err) {
      assert.equal(err, 'Error getting reddit new.json');
    });
  });

  it('should emit error when no articles found', function() {
    var checkDupe = checkDupeInit();
    var rs = createEmptyReadStream();

    rs.pipe(checkDupe);

    checkDupe.on('error', function(err) {
      assert.equal(err, 'No articles for date found.');
    });
  });

  it('should push non duplicate ids', function(done) {
    var checkDupe = checkDupeInit();
    var rs = createReadStream();

    nock('https://www.reddit.com')
      .get('/r/' + global.subreddit + '/new.json')
      .reply(200, {
        data: {
          children: [
            {
              data: {
                selftext: 'k122'
              }
            }
          ]
        }
      });

    rs.pipe(checkDupe);

    checkDupe.on('error', function(err) {
      assert.equal(err, null);
    });

    checkDupe.on('data', function(data) {
      data = data.toString('utf8');
      assert.equal(data, mockId);
    });

    checkDupe.on('end', function() {
      done();
    })
  });

  it('should not push if all ids are dupes', function(done) {
    var checkDupe = checkDupeInit();
    var rs = createReadStream();

    nock('https://www.reddit.com')
      .get('/r/' + global.subreddit + '/new.json')
      .reply(200, {
        data: {
          children: [
            {
              data: {
                selftext: mockId
              }
            }
          ]
        }
      });

    rs.pipe(checkDupe);

    checkDupe.on('error', function(err) {
      assert.equal(err, 'No non-duplicates found.');
      done();
    });
  });
});

function createReadStream() {
  var rs = new stream.Readable();
  rs._read = function() {
    rs.push(mockId)
    rs.push(null);
  }

  return rs;
}

function createEmptyReadStream() {
  var rs = new stream.Readable();
  rs._read = function() {
    rs.push(null);
  }

  return rs;
}