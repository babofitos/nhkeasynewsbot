let logger = require('./logger.js');
let date = require('./date.js');

module.exports = function(json) {
  json = JSON.parse(json);
  let now = date.current();
  let result = [];
  //check if there's an article today
  if (json[0].hasOwnProperty(now)) {
    for (let article of json[0][now]) {
      result.push(article['news_id']);
    }
  }
  //return today's article ids or empty array if no articles
  logger.info(`Articles for ${now} %j`, result);
  return result;
}