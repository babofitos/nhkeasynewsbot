var config = require('../config.json');
var checkDupe = require('./check_dupe.js');
var logger = require('./logger.js');
var map = require('map-stream');
var scrapeArticle = require('./scrapeArticle.js');
var addToArticle = require('./add_to_article.js');
var submitArticle = require('./submitArticle.js');

function main(date, cb) {
  var d = require('domain').create();
  require('./date.js').new(date);
  logger.debug('Looping');
  var nhkJSONGet = require('./nhk_JSON.js');
  var getArticleIds = require('./get_article_id.js')();
  var strip = require('./strip.js')();
  var wait = require('./wait.js').bind(undefined, config.delay);
  var collect = require('./collect.js');
  var each = require('./each.js');

  nhkJSONGet(function(err, nhkJSONStream) {
    if (err) {
      logger.error(err);
    } else {
      d.run(function() {
        nhkJSONStream
          .pipe(strip)
          .pipe(getArticleIds)
          .on('error', function(err) {
            cb(err.message);
          })
          .pipe(collect())
          .pipe(map(checkDupe))
          .pipe(each())
          .pipe(wait())
          .pipe(map(scrapeArticle))
          .pipe(map(addToArticle))
          .pipe(wait())
          .pipe(map(submitArticle))
          .on('end', function(d) {
            logger.debug('Submit end');
            cb(null);
          });
      });
      d.on('error', cb);
      
    }
  });
}

module.exports = main;
