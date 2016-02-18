let nhkeasy = require('nhkeasy');
let config = require('../config.js');
let logger = require('./logger.js');
let request = require('request');

module.exports = function(articleIds) {
  //id -> article url -> article object
  return articleIds
    .map(makeEasyUrl)
    .map(async function(url) {
      return scrapeArticle(url);
    });
};

function makeEasyUrl(id) {
  let url = 'http://www3.nhk.or.jp/news/easy/' + id + '/' + id + '.html';

  return url;
}

function scrapeArticle(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        nhkeasy({separator: config.separator}, body, function(err, d) {
          if (err) {
            reject(err);
          } else {
            d.url = url;
            logger.info(`Scraped ${d.url}`);
            resolve(d);
          }
        });
      } else {
        reject(err);
      }
    });
  });
}