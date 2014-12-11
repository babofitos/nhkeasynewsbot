var config = require('../config.json');
var logger = require('./logger.js');
var map = require('map-stream');
var scrapeArticle = require('./scrapeArticle.js');
var addToArticle = require('./add_to_article.js');
var submitArticle = require('./submitArticle.js');
var request = require('request');
var reddit = require('./reddit.js');
var findSubmittedArticles = require('./find_submitted_articles.js');

function main(date, cb) {
  var d = require('domain').create();
  require('./date.js').new(date);
  logger.debug('Looping');
  var nhkJSONReq = request('http://www3.nhk.or.jp/news/easy/news-list.json');
  var redditJSONReq = reddit.json();
  var getArticleIds = require('./get_article_id.js')();
  var getSelftext = require('./get_selftext.js')();
  var strip = require('./strip.js')();
  var wait = require('./wait.js').bind(undefined, config.delay);
  var collect = require('./collect.js');
  var each = require('./each.js');
  var CheckDupe = require('./check_dupe.js');
  var checkDupe = new CheckDupe();

  d.run(function() {
    nhkJSONReq
      .on('response', function(res) {
        if (res.statusCode === 200) {
          nhkJSONReq
            .pipe(strip)
            .pipe(getArticleIds)
            .pipe(collect())
            .on('data', function(data) {
              checkDupe.emit('data', data, 0);
            });
        } else {
          nhkJSONReq.abort();
          cb("Couldn't get NHK JSON");
        }
      });
      
    redditJSONReq
      .on('response', function(res) {
        if (res.statusCode === 200) {
          redditJSONReq
            .pipe(getSelftext)
            .pipe(map(findSubmittedArticles))
            .pipe(collect())
            .on('data', function(data) {
              checkDupe.emit('data', data, 1);
            });
        } else {
          redditJSONReq.abort();
          cb("Couldn't get Reddit JSON");
        }
      });
      
    checkDupe.on('ready', submitPipeline);
    checkDupe.on('empty', function() {
      cb(null, 'All articles already submitted');
    });

    function submitPipeline(readable) {
      readable
        .pipe(each())
        .pipe(wait())
        .pipe(map(scrapeArticle))
        .pipe(map(addToArticle))
        .pipe(wait())
        .pipe(map(submitArticle))
        .on('end', function(d) {
          logger.debug('Submit end');
          cb(null, 'done');
        });
    }
  });
  d.on('error', cb);
}

module.exports = main;
