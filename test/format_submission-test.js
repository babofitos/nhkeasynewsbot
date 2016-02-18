let mocha = require('mocha');
let chai = require('chai');
let should = chai.should();
let formatSubmission = require('../src/format_submission.js');
let date = require('../src/date.js');

describe('format submission', function() {
  it('should format text properly', function() {
    date.new(new Date(1455595371000));
    let articles = [
      {
        title: 'title',
        article: 'article',
        url: 'http://example.com'
      }
    ];

    let result = [
      {
        "article": "http://example.com\n\n&nbsp;\n\n" +
          "article\n\n&nbsp;\n\n" +
          "*I am a bot* | [Source](https://github.com/babofitos/nhkeasynewsbot.git)",
        "title": "[02/16/2016] title",
        "url": "http://example.com"
      }
    ]

    formatSubmission(articles).should.deep.equal(result);
  });
});