var request = require('request');

module.exports = function(cb) {
  var nhkJSONGet = request({url: 'http://www3.nhk.or.jp/news/easy/news-list.json', json: true});
  nhkJSONGet
    .on('error', function(err) {
      cb('Error requesting nhk JSON' + err);
    })
    .on('response', function(response) {
      if (response.statusCode != 200) {
        cb('Unsuccessful status code. Aborting');
        nhkJSONGet.abort();
      } else {
        cb(null, nhkJSONGet);
      }
  });
};
