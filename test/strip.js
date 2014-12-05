var assert = require('assert');
var stream = require('stream');

describe('strip', function() {
  var strip;
  var i;
  var rs;

  beforeEach(function() {
    strip = require('../strip.js')();
    i = 0;
    rs = createReadStream();
  });

  it('should strip the first character of the first chunk',
    function(done) {
      rs.pipe(strip);
      strip
        .on('data', function(data) {
          if (i === 0) {
            assert.equal(data.toString('utf8'), 'i');
          }
          i++;
        })
        .on('end', function() {
          done();
        });
    }
  );

  it('should not strip if not first character',
    function(done) {
      rs.pipe(strip);
      strip
        .on('data', function(data) {
          if (i > 0) {
            assert.equal(data.toString('utf8'), 'there');
          }
          i++;
        })
        .on('end', function() {
          done();
        });
    }
  );
});

function createReadStream() {
  var rs = new stream.Readable();

  rs._read = function() {
    rs.push('hi');
    rs.push('there');
    rs.push(null);
  };

  return rs;
}