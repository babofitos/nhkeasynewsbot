var stream = require('stream');

module.exports = function() {
  var each = new stream.Transform({objectMode: true});

  each._transform = function(chunk, encoding, done) {
    chunk.forEach(push.bind(this));
    done();
  };

  each._flush = function(done) {
    done();
  };

  return each;
};

function push(element) {
  this.push(element);
}