var username = process.argv[2] || process.env.USER;
var password = process.argv[3] || process.env.PW;
global.subreddit = process.env.SUBREDDIT || 'nhkeasynewsscripttest';

var dateUtil = require('./date.js');

var request = require('request');
var reddit = require('./reddit.js');
var config = require('./config.json');
var submitArticleInit = require('./submitArticle.js')(reddit);
var checkDupeInit = require('./check_dupe.js')(reddit);
var addToArticleInit = require('./add_to_article.js');
var logger = require('./logger.js');

reddit.login(username, password, function(err) {
  if (err) {
    logger.error('Error logging in');
    throw err;
  } else {
      setInterval(main, config.loopInterval);

      function main() {
        logger.debug('Looping');
        var nhkJSONGet = require('./nhk_JSON.js');
        var date = dateUtil();
        var getArticleIdsInit = require('./get_article_id.js')(date);
        var scrapeArticleInit = require('./scrapeArticle.js')(date);
        var getArticleIds = getArticleIdsInit();
        var strip = require('./strip.js')();
        var checkDupe = checkDupeInit();
        var scrapeArticle = scrapeArticleInit(date);
        var addToArticle = addToArticleInit();
        var submitArticle = submitArticleInit();

        nhkJSONGet(function(err, nhkJSONStream) {
          if (err) {
            logger.error(err);
          } else {
            nhkJSONStream
            .pipe(strip)
            .pipe(getArticleIds)
              .on('error', error)
            .pipe(checkDupe)
              .on('error', error)
            .pipe(scrapeArticle)
              .on('error', error)
            .pipe(addToArticle)
            .pipe(submitArticle)
              .on('error', error)
              .on('success', successfulArticle)
              .on('done', clean)
          }
        });
        
        function error(err) {
          logger.error(err);
        }

        function successfulArticle(o) {
          logger.info('Successful submit for ' + o.title);
        }

        function clean() {
          logger.debug('Cleaning up event listeners');
          getArticleIds.removeListener('error', error);
          checkDupe.removeListener('error', error);
          scrapeArticle.removeListener('error', error);
          submitArticle.removeListener('error', error);
          submitArticle.removeListener('success', successfulArticle);
          submitArticle.removeListener('done', clean);
        }
        
      }
  }
})

