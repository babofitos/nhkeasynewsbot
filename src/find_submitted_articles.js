let logger = require('./logger.js');
let urlre = /http:\/\/www3\.nhk\.or\.jp\/news\/easy\/k\d+\/k\d+\.html/;
let kidre = /k\d+/;

module.exports = function(json) {
  let foundArticleIds = [];
  json = JSON.parse(json);
  for (let child of json.data.children) {
    let selftext = child.data.selftext;
    let nhkurl = selftext.match(urlre);
    if (nhkurl !== null) {
      let kid = nhkurl[0].match(kidre);

      foundArticleIds.push(kid[0]);
    }
  }
  logger.info('foundArticleIds %j', foundArticleIds);
  return foundArticleIds;
};