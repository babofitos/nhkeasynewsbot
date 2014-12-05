var http = require('http');
var config = require('./config.json');
var reddit = require('./reddit.js');
var username = process.argv[2] || process.env.USER;
var password = process.argv[3] || process.env.PW;
var main = require('./index.js');
var logger = require('./logger.js');

logger.info('ENV %s', process.env.NODE_ENV);

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('A reddit bot for /r/NHKEasyNews');
});

server.listen(process.env.PORT || 5000);

reddit.login(username, password, function(err) {
  if (err) {
    logger.error('Error logging in');
    throw err;
  } else {
    setInterval(main.bind(undefined, new Date(), function(err) {
      if (err) {
        console.error(err);
      } else {
        logger.info('done');
      }
    }), config.loopInterval);

  }
});


require('./ping.js')(config.pingInterval);
