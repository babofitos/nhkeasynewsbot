logger = global.logger;
module.exports = function(pingInterval) {
  // ping ourselves
  setInterval(function() {
    http.get(process.env.URL || 'http://localhost:5000', function(res) {
      logger.info('ping');
    })
  }, pingInterval)
}
