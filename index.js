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
        var nhkJSONGet = request({url: 'http://www3.nhk.or.jp/news/easy/news-list.json', json: true})
        var date = dateUtil();
        var JSONStream = require('JSONStream');
        var getArticleIds = JSONStream.parse([true, date, true, 'news_id']);
        var strip = require('./strip.js')();
        var checkDupe = checkDupeInit();
        var submitArticle = submitArticleInit(date);

        nhkJSONGet
          .on('error', function(err) {
            console.log('Error requesting nhk JSON' + err);
          })
          .on('response', function(response) {
            if (response.statusCode != 200) {
              console.log('Unsuccessful status code. Aborting');
              nhkJSONGet.abort();
            } else {
              nhkJSONGet
                .pipe(strip)
                .pipe(getArticleIds)
                .on('error', function(err) {
                  console.log('Error parsing JSON');
                })
                .pipe(checkDupe)
                .on('error', function(err) {
                  console.log(err);
                })
                .pipe(submitArticle)
                .on('error', function(err) {
                  console.log(err);
                })
            }
          })
      }
  }
})


