var JSONStream = require('JSONStream');

module.exports = function() {
  var date = require('./date.js').current();
  return JSONStream.parse([true, date, true, 'news_id']);
};