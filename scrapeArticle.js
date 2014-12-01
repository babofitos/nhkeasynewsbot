var stream = require('stream');
var nhkeasy = require('nhkeasy');
var config = require('./config.json');


module.exports = function(date) {
  return function() {
    var scraper = new stream.Transform({objectMode: true});

    scraper._transform = function(chunk, encoding, done) {
      var id = chunk.toString('utf8');
      var that = this;
      var easyUrl = makeEasyUrl(id);
      
      nhkeasy({separator: config.separator}, easyUrl, function(err, d) {
        if (err) {
          scraper.emit('error', err);
        } else {
          d.date = date;
          d.url = easyUrl;
          logger.debug('Scraped nhkeasy: %s', d.title);
          that.push(d);
          done();
        }
      });

      function makeEasyUrl(id) {
        var url = 'http://www3.nhk.or.jp/news/easy/' + id + '/' + id + '.html';

        return url;
      }
    }
    
    return scraper;
  }
}