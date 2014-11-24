var http = require('http');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('A reddit bot for /r/NHKEasyNews');
});

server.listen(process.env.PORT || 5000);

require('./index.js');

// ping ourselves
setInterval(function() {
  http.get(process.env.URL || 'http://localhost:5000', function(res) {
    console.log('ping');
  })
}, 300000)