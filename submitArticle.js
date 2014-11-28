var stream = require('stream');
var nhkeasy = require('nhkeasy');
var config = require('./config.json');


module.exports = function(reddit) {
  return function() {
    var submitter = new stream.Transform({objectMode: true});

    submitter._transform = function (chunk, encoding, done) {
      var articleAndTitle = chunk;

      submitArticle(articleAndTitle, function(err, title) {
        if (err) {
          submitter.emit('error', err);
        } else {
          submitter.emit('success', articleAndTitle);
        }
        done();
      });
    }

    submitter._flush = function(done) {
      submitter.emit('done');
      done();
    }

    function submitArticle(articleAndTitle, cb) {
      var title = articleAndTitle.title;
      var text = articleAndTitle.article;

      reddit.submit(title, text, function(err) {
        if (err) {
          cb(err);
        } else {
          cb(null, title);
        }
      });
    }
    return submitter;
  }
}
