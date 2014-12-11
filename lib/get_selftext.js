var JSONStream = require('JSONStream');

module.exports = function() {
  return JSONStream.parse(['data', 'children', true, 'data', 'selftext']);
};