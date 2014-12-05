var stream = require('stream');

module.exports = function(time) {
  var wait = new stream.Transform({objectMode: true});

  wait._transform = function(chunk, encoding, done) {
    setTimeout(push.bind(this), time);

    function push() {
      this.push(chunk);
      done();
    }
  };

  return wait;
};