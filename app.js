require('look').start();

var http = require('http');
var config = require('./config.js');
var reddit = require('./lib/reddit.js');
var username = config.username;
var password = config.password;
var main = require('./lib/index.js');
var logger = require('./lib/logger.js');

logger.info('ENV %s', config.env);

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('A reddit bot for /r/NHKEasyNews');
});

server.listen(config.port);

reddit.login(username, password, function(err) {
  if (err) {
    logger.error('Error logging in');
    throw err;
  } else {
    setInterval(function() {

      main(new Date(), function(err, stat) {
        if (err) {
          logger.warn(err);
        } else {
          logger.info(stat);
        }
      });

    }, config.loopInterval);
  }
});


require('./lib/ping.js')(config.pingInterval);
