var stream = require('stream');

module.exports = function() {
  var collect = new stream.Transform({objectMode: true});
  var all = [];

  collect._transform = function(chunk, encoding, done) {
    all.push(chunk);
    done();  
  };

  collect._flush = function(done) {
    this.push(all);
    done();
  };

  return collect;
};