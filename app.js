var http = require('http');
var config = require('./config.json');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('A reddit bot for /r/NHKEasyNews');
});

server.listen(process.env.PORT || 5000);

require('./index.js');
require('./ping.js')(config.pingInterval);

