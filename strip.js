//this is needed because for some reason the nhk easy json returned has a weird character in front that screws up json parsing
//as expected of japan
module.exports = function() {
  var stream = require('stream');
  var strip = new stream.Transform();
  var first = true;

  strip._transform = function(chunk, encoding, done) {
    var data = chunk;
    if (first) {
      first = false;
      var data = data.toString('utf8');
      this.push(data.slice(1));
    } else {
      this.push(data);
    }
    done();
  }

  return strip;
}