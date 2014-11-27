var JSONStream = require('JSONStream');
var e = require('./emitters.js').getArticleIdsEmitter;

module.exports = function(date) {  
  return function() {
    var getArticleIds = JSONStream.parse([true, date, true, 'news_id']);

    getArticleIds.on('error', function(err) {
      e.emit('error', 'Error parsing JSON');
    })
    getArticleIds.on('end', function() {
      e.emit('end');
    })

    return getArticleIds;
  }
}