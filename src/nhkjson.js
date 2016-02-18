let request = require('request');
let logger = require('./logger.js');

module.exports = function() {
  return new Promise(function(resolve, reject) {
    request({
      "url": 'http://www3.nhk.or.jp/news/easy/news-list.json',
      "encoding": 'utf8'
    }, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        logger.info('Got NHK JSON');
        resolve(body);
      } else {
        reject(err);
      }
    });
  })
}
