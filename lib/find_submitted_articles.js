var logger = require('./logger.js');
var urlre = /http:\/\/www3\.nhk\.or\.jp\/news\/easy\/k\d+\/k\d+\.html/;
var kidre = /k\d+/;

module.exports = function(data, cb) {
  var selftext = data;
  logger.log('debug', 'selftext', data);
  var nhkurl = selftext.match(urlre);
  logger.log('debug', 'matched', nhkurl);

  if (nhkurl !== null) {
    var kid = nhkurl[0].match(kidre);

    cb(null, kid[0]);
  } else {
    cb();
  }
};