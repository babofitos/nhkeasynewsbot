var nock = require('nock');
var nhkJSONGet = require('../nhk_JSON.js');
var assert = require('assert');
var stream = require('stream');

describe('nhkJSONGet', function() {
  it('should error on bad statusCode', function(done) {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/news-list.json')
      .reply(404, {})
    
    nhkJSONGet(function(err) {
      assert.equal(err, 'Unsuccessful status code. Aborting');
      done();
    })
  });

  it('should return stream when statusCode 200', function() {
    nock('http://www3.nhk.or.jp')
      .get('/news/easy/news-list.json')
      .reply(200, [{'2014-11-1': 'blah'}])

    nhkJSONGet(function(err, nhkStream) {
      assert.equal(err, null);
      assert.ok(nhkStream instanceof stream);
    })
  })
})