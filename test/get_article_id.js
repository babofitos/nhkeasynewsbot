var stream = require('stream');
var assert = require('assert');
var date = '2014-11-1';
var getArticleIdsInit = require('../get_article_id.js')(date);

describe('getArticleIds', function() {
  var getArticleIds;

  beforeEach(function() {
    getArticleIds = getArticleIdsInit();
  });

  it('should error on bad JSON', function(done) {
    var rs = createReadStream('[{"' + date + '":[{"news_id": ""}}]}]');

    rs.pipe(getArticleIds);

    getArticleIds.on('error', function(err) {
      assert.equal(err.message, 
        'Unexpected RIGHT_BRACE("}") in state COMMA'
      );
      done();
    });
  });

  it('should not error on good JSON', function(done) {
    var rs = createReadStream('[{"' + date + '":[{"news_id":123}]}]');
    
    rs.pipe(getArticleIds);

    getArticleIds.on('error', function(err) {
      assert.equal(err, null);
    });

    getArticleIds.on('end', function() {
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

