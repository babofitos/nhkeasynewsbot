var nhkeasy = require('nhkeasy');
var config = require('../config.json');
var logger = require('./logger.js');

module.exports = function(data, cb) {
  var id = data;
  var easyUrl = makeEasyUrl(id);
  
  nhkeasy({separator: config.separator}, easyUrl, push);

  function push(err, d) {
    if (err) {
      cb(err);
    } else {
      d.url = easyUrl;
      logger.debug('Scraped nhkeasy: %s', d.title);
      cb(null, d);
    }
  }
};

function makeEasyUrl(id) {
  var url = 'http://www3.nhk.or.jp/news/easy/' + id + '/' + id + '.html';

  return url;
}