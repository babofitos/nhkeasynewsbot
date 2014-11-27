var username = process.argv[2] || process.env.USER;
var password = process.argv[3] || process.env.PW;
global.subreddit = process.env.SUBREDDIT || 'nhkeasynewsscripttest';

var dateUtil = require('./date.js');

var request = require('request');
var reddit = require('./reddit.js');
var config = require('./config.json');
var submitArticleInit = require('./submitArticle.js')(reddit);
var checkDupeInit = require('./check_dupe.js')(reddit);

reddit.login(username, password, function(err) {
  if (err) {
    console.log('Error logging in');
    throw err;
  } else {
      setInterval(main, config.loopInterval);

      function main() {
        console.log('Looping');
        var nhkJSONGet = require('./nhk_JSON.js');
        var date = dateUtil();
        var getArticleIdsInit = require('./get_article_id.js')(date);
        var getArticleIds = getArticleIdsInit();
        var strip = require('./strip.js')();
        var checkDupe = checkDupeInit();
        var submitArticle = submitArticleInit(date);
        var getArticleIdsEmitter = require('./emitters.js').getArticleIdsEmitter;
        
        nhkJSONGet(function(err, nhkJSONStream) {
          if (err) {
            console.log(err);
          } else {
            nhkJSONStream
            .pipe(strip)
            .pipe(getArticleIds)
            .pipe(checkDupe)
            .on('error', error)
            .pipe(submitArticle)
            .on('error', error)
            .on('done', clean)
          
          }
        });
        
        getArticleIdsEmitter.on('error', error);
        function error(err) {
          console.log(err);
        }

        function clean() {
          console.log('Cleaning up event listeners');
          getArticleIdsEmitter.removeListener('error', error);
          checkDupe.removeListener('error', error);
          submitArticle.removeListener('error', error);
        }
        
      }
  }
})

