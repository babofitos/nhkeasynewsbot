'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request');
var config = require('../config.js');
var logger = require('./logger.js');

var reddit = new Reddit();
module.exports = reddit;

function Reddit() {
  this.modhash = null;
  this.cookie = null;
  this.userAgent = 'nhk easy news article scraper bot by /u/babofitos';
  this.subreddit = config.subreddit;
}

Reddit.prototype.login = function (user, pw) {
  var that = this;
  var options = {
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

  return new _promise2.default(function (resolve, reject) {
    request(options, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsed = JSON.parse(body);

        if (parsed.json.errors.length < 1) {
          var modhash = parsed.json.data.modhash;
          var cookie = parsed.json.data.cookie;

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

Reddit.prototype.submit = function (title, text) {
  var options = {
    url: 'https://api.reddit.com/api/submit',
    headers: {
      'user-agent': this.userAgent,
      'X-Modhash': this.modhash,
      'Cookie': 'reddit_session=' + this.cookie
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
  return new _promise2.default(function (resolve, reject) {
    request(options, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        var parsed = JSON.parse(body);

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

Reddit.prototype.json = function () {
  var that = this;
  return new _promise2.default(function (resolve, reject) {
    var options = {
      url: 'https://www.reddit.com/r/' + that.subreddit + '/new.json',
      headers: {
        'user-agent': that.userAgent,
        'X-Modhash': that.modhash,
        'Cookie': 'reddit_session=' + that.cookie
      },
      method: 'GET'
    };
    request(options, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        logger.info('Got Reddit JSON');
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};