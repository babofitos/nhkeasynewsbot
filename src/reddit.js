let request = require('request');
let config = require('../config.js');
let logger = require('./logger.js');

let reddit = new Reddit();
module.exports = reddit;

function Reddit() {
  this.modhash = null;
  this.cookie = null;
  this.userAgent = 'nhk easy news article scraper bot by /u/babofitos';
  this.subreddit = config.subreddit;
}

Reddit.prototype.login = function(user, pw) {
  let that = this;
  let options = {
    url: 'https://ssl.reddit.com/api/login',
    headers: {
      'user-agent': that.userAgent
    },
    method: 'POST',
    form: {
      "api_type": "json",
      "user": user,
      "passwd": pw,
      "rem": true
    }
  };

  return new Promise(function(resolve, reject) {
    request(options, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        let parsed = JSON.parse(body);
        
        if (parsed.json.errors.length < 1) {
          let modhash = parsed.json.data.modhash;
          let cookie = parsed.json.data.cookie;

          that.modhash = modhash;
          that.cookie = cookie;

          logger.info('Login successful %s.', user);
          resolve();
        } else {
          reject(parsed.json.errors);
        }
      }
    });
  });
};

Reddit.prototype.submit = function(title, text) {
  let options = {
    url: 'https://api.reddit.com/api/submit',
    headers: {
      'user-agent': this.userAgent,
      'X-Modhash': this.modhash,
      'Cookie': 'reddit_session='+this.cookie
    },
    method: 'POST',
    form: {
      "api_type": "json",
      "kind": "self",
      "resubmit": "false",
      "extension": "json",
      "title": title,
      "text": text,
      "uh": this.modhash,
      "sr": this.subreddit
    }
  };
  return new Promise(function(resolve, reject) {
    request(options, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        let parsed = JSON.parse(body);

        if (parsed.json.errors.length < 1) {
          resolve();
        } else {
          reject(parsed.json.errors);
        }
      } else {
        reject('Unsuccessful reddit submit');
      }
    });
  });
  
};

Reddit.prototype.json = function() {
  let that = this;
  return new Promise(function(resolve, reject) {
    let options = {
      url: 'https://www.reddit.com/r/' + that.subreddit + '/new.json',
      headers: {
        'user-agent': that.userAgent,
        'X-Modhash': that.modhash,
        'Cookie': 'reddit_session='+that.cookie
      },
      method: 'GET'
    };
    request(options, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        logger.info('Got Reddit JSON');
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};