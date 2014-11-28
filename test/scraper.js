var assert = require('assert');
var stream = require('stream');
var nock = require('nock');
var date = require('../date.js')();
var scrapeArticleInit = require('../scrapeArticle.js')(date);
var articleId = 'k123';
var fs = require('fs');
var mockResponse = fs.readFileSync(__dirname + '/mock.html');

describe('scrapeArticle', function() {
  it('should emit error if unable to reach nhk site', function(done) {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/' + articleId + '/' + articleId + '.html')
      .reply(404);

    var rs = createReadStream();
    var scrapeArticle = scrapeArticleInit();
    rs.pipe(scrapeArticle);

    scrapeArticle.on('error', function(err) {
      assert.equal(err, 
        'Unable to resolve http://www3.nhk.or.jp/news/easy/k123/k123.html'
      );
      done();
    });
  });

  it('should emit error if bad html', function(done) {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/' + articleId + '/' + articleId + '.html')
      .reply(200, '');

    var rs = createReadStream();
    var scrapeArticle = scrapeArticleInit();
    rs.pipe(scrapeArticle);

    scrapeArticle.on('error', function(err) {
      assert.equal(err, 'Cannot find relevant nodes to scrape');
      done();
    });  
  });

  it('should return text and title on success', function(done) {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/' + articleId + '/' + articleId + '.html')
      .reply(200, mockResponse);

    var rs = createReadStream();
    var scrapeArticle = scrapeArticleInit();
    rs.pipe(scrapeArticle);

    scrapeArticle.on('error', function(err) {
      assert.equal(err, null);
    });

    scrapeArticle.on('data', function(data) {
      assert.deepEqual(data, { 
        article: '２２日午後１０時ころ、長野県でマグニチュード６．７（Ｍ６．７）の地震がありました。長野市と小谷村、小川村で震度６弱でした。白馬村と信濃町は震度５強でした。\n\n&nbsp;\n\nこの地震で４５人がけがをしたと、２５日の昼までにわかっています。そして、３１の家が全部壊れて、４６の家が半分壊れました。',
        title: '長野県で震度６弱の地震　これからも十分に注意して',
        date: date,
        url: 'http://www3.nhk.or.jp/news/easy/k123/k123.html'
      });
    });

    scrapeArticle.on('end', function() {
      done();
    });
  });
  
})

function createReadStream() {
  var rs = new stream.Readable();

  rs._read = function() {
    rs.push(articleId);
    rs.push(null);
  }

  return rs;
}