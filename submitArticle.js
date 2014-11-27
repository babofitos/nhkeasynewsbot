var stream = require('stream');
var nhkeasy = require('nhkeasy');
var config = require('./config.json');
var source = require('./package.json').repository.url

module.exports = function(reddit) {
  return function(date) {
    var submitter = new stream.Transform({objectMode: true});

    submitter._transform = function (chunk, encoding, done) {
      var id = chunk.toString('utf8');
      var that = this;

      submitArticle(id, function(err) {
        if (err) {
          submitter.emit('error', err);
        } else {
          that.push(id + '\n');
        }
        done();
      });
    }

    submitter._flush = function(done) {
      submitter.emit('done');
      done();
    }

    function makeEasyUrl(id) {
      var url = 'http://www3.nhk.or.jp/news/easy/' + id + '/' + id + '.html';

      return url;
    }

    function addUrlToArticle(url, article) {
      return url + config.separator + article;
    }

    function addDateToTitle(date, title) {
      function formatDate(date) {
        date = date.split('-');
        date = date.slice(1).concat(date[0]).join('/');
        return '[' + date + '] ';
      }

      var formatDate = formatDate(date);

      return formatDate + title;
    }

    function addBotInfoToText(article) {
      return article + config.separator + '*I am a bot* | [Source](' + source + ')';
    }

    function submitArticle(id, cb) {
      var easyUrl = makeEasyUrl(id);

      nhkeasy({separator: config.separator}, easyUrl, function(err, d) {
        //submit to reddit here
        if (err) {
          console.log('Error scraping NHK site at ' + easyUrl);
          cb(err);
        } else {
          var text = addBotInfoToText(addUrlToArticle(easyUrl, d.article));
          var title = addDateToTitle(date, d.title);

          reddit.submit(title, text, function(err) {
            if (err) {
              console.log('Error submitting for ' + title);
              cb(err);
            } else {
              console.log('Successful submit: ' + title);
              cb(null);
            }
          })
        }
      });
    }
    return submitter;
  }
}
