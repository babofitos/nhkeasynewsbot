var logger = require('./logger.js');
var request = require('request');
var reddit = require('./reddit.js');
var urlre = /http:\/\/www3\.nhk\.or\.jp\/news\/easy\/k\d+\/k\d+\.html/;

module.exports = function(data, cb) {
  var ids = data;

  checkRedditPosts(ids, function(err, ids) {
    if (err) {
      cb(err);
    } else {
      cb(null, ids);
    }
  });

  function checkRedditPosts(ids, cb) {
    if (ids.length === 0) {
      return cb('No articles for date found.');
    }
    request(
      {
        url: 'https://www.reddit.com/r/' + reddit.subreddit + '/new.json',
        encoding: 'utf8',
        json: true,
        headers: {
        'user-agent': reddit.userAgent,
        'X-Modhash': reddit.modhash,
        'Cookie': 'reddit_session='+reddit.cookie
        }
      },
      function (err, res, body) {
        if (!err && res.statusCode == 200) {
          var posts = body.data.children;

          posts.forEach(function(post) {
            ids.forEach(function(id) {
              //look for nhk easy url in selftext
              var url = post.data.selftext.match(urlre);
              var idre = new RegExp(id);
              var kid;

              //if found look for article id in url
              if (url !== null) {
                kid = url[0].match(idre);
                //if article id found it's a dupe
                if (kid !== null) {
                  logger.log('debug', 'Article ID %s is a dupe', id);
                  ids.splice(ids.indexOf(kid[0]), 1);
                }
              }
              //else we don't care
            });
          });
          if (!ids.length) {
            return cb('No non-duplicates found.');
          }
          cb(null, ids);
        }  else {
          cb("Error getting reddit new.json");
        }
      }
    );
  }
};