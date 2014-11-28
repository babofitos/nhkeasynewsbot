var JSONStream = require('JSONStream');

module.exports = function(date) {  
  return function() {
    var getArticleIds = JSONStream.parse([true, date, true, 'news_id']);

    return getArticleIds;
  }
}