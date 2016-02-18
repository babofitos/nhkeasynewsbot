let mocha = require('mocha');
let chai = require('chai');
let should = chai.should();
let date = require('../src/date.js');
let getArticleId = require('../src/get_article_id.js');

describe('get article id', function() {
  it('should return article ids for current date', function() {
    date.new(new Date(1455595371000));
    let mock = 
      [
        {
          '2016-02-16': [
            {
              'news_id': 'k1'
            },
            {
              'news_id': 'k2'
            }
          ]
        }
      ]
    mock = JSON.stringify(mock);
    getArticleId(mock).should.deep.equal(['k1', 'k2']);
  });

  it('should not return article ids if not current date', function() {
    date.new(new Date(1455595371000));
    let mock = 
      [
        {
          '2016-02-15': [
            {
              'news_id': 'k1'
            }
          ]
        }
      ]
    mock = JSON.stringify(mock);
    getArticleId(mock).should.deep.equal([]);
  });
});