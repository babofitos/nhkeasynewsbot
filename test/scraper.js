var assert = require('assert');
var nock = require('nock');
var mockDate = new Date('Nov 1 2014');
require('../lib/date.js').new(mockDate);
var date = require('../lib/date.js').current();
var scrapeArticle = require('../lib/scrapeArticle.js');
var articleId = 'k123';
var fs = require('fs');
var mockResponse = fs.readFileSync(__dirname + '/mock.html');

describe('scrapeArticle', function() {
  it('should error if unable to reach nhk site', function(done) {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/' + articleId + '/' + articleId + '.html')
      .reply(404);

    scrapeArticle(articleId, function(err) {
      assert.equal(err, 
        'Unable to resolve http://www3.nhk.or.jp/news/easy/' + 
        articleId + '/' + articleId + '.html'
      );
      done();
    });
  });

  it('should error if bad html', function(done) {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/' + articleId + '/' + articleId + '.html')
      .reply(200, '');

    scrapeArticle(articleId, function(err) {
      assert.equal(err, 'Cannot find relevant nodes to scrape');
      done();
    });
  });

  it('should return text and title on success', function(done) {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/' + articleId + '/' + articleId + '.html')
      .reply(200, mockResponse);

    scrapeArticle(articleId, function(err, data) {
      assert.equal(err, null);
      assert.deepEqual(data, { 
        article: '２２日午後１０時ころ、長野県でマグニチュード６．７（Ｍ６．７）の地震がありました。長野市と小谷村、小川村で震度６弱でした。白馬村と信濃町は震度５強でした。\n\n&nbsp;\n\nこの地震で４５人がけがをしたと、２５日の昼までにわかっています。そして、３１の家が全部壊れて、４６の家が半分壊れました。',
        title: '長野県で震度６弱の地震　これからも十分に注意して',
        url: 'http://www3.nhk.or.jp/news/easy/' + articleId +
          '/' + articleId + '.html'
      });
      done();
    });
  });
  
});