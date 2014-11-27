var stream = require('stream');
var assert = require('assert');
var date = '2014-11-1';
var getArticleIdsInit = require('../get_article_id.js')(date);
var getArticleIdsEmitter = require('../emitters.js').getArticleIdsEmitter;

describe('getArticleIds', function() {
  it('should error on bad JSON', function() {
    var rs = createReadStream('[' + date + ':[{news_id: [[]}]]');

    var getArticleIds = getArticleIdsInit();

    rs.pipe(getArticleIds);

    getArticleIdsEmitter.on('error', function(err) {
      assert.equal(err, 'Error parsing JSON');
    });
  });

  it('should not error on good JSON', function(done) {
    var rs = createReadStream('[{"' + date + '":[{"news_id":123}]}]');
    var getArticleIds = getArticleIdsInit();
    
    rs.pipe(getArticleIds);

    getArticleIdsEmitter.on('error', function(err) {
      assert.equal(err, null);
    })

    getArticleIdsEmitter.on('end', function() {
      done();
    });
  });
});

function createReadStream(data) {
  var rs = new stream.Readable();

  rs._read = function() {
    rs.push(data);
    rs.push(null);
  }

  return rs;
}

