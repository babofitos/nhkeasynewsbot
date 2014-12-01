var request = require('request');
var stream = require('stream');
var config = require('./config.json');
logger = global.logger;

module.exports = function(reddit) {
  return function() {
    var checkDupe = new stream.Transform();
    var ids = [];

    checkDupe._transform = function(chunk, encoding, done) {
      var data = chunk.toString('utf8');

      logger.log('debug', 'Checking dupe on article ID %s', data);

      ids.push(data);
      done();
    }

    checkDupe._flush = function (done) {
      if (ids.length < 1) {
        checkDupe.emit('error', 'No articles for date found.');
        return done();
      }

      var that = this;
      
      checkRedditPosts(ids, function(err, ids) {
        if (err) {
          checkDupe.emit('error', err);
          return done();
        }
          bufferid.call(that, ids, done);
      });
    }

    function bufferid(ids, cb) {
      setTimeout(pushId.bind(this), config.delay);

      function pushId() {
        var id = ids.shift();

        logger.log('debug', 'Pushing new article id %s', id);
        this.push(id);
        
        if (ids.length) {
          bufferid.call(this, ids, cb);
        } else {
          cb();
        }
      }
    }

    function checkRedditPosts(ids, cb) {
      request(
        {
          url: 'https://www.reddit.com/r/' + global.subreddit + '/new.json',
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
                var index = post.data.selftext.indexOf(id);

                if (index > -1) {
                  logger.log('debug', 'Article ID %s is a dupe', id);
                  ids.splice(ids.indexOf(id), 1);
                }
              })
            })
            if (!ids.length) {
              return cb('No non-duplicates found.');
            }
            cb(null, ids);    
          }  else {
            cb("Error getting reddit new.json");
          }
        }
      )
    }
    return checkDupe;
  }
}

