let mocha = require('mocha');
let chai = require('chai');
let should = chai.should();
let findSubmittedArticles = require('../src/find_submitted_articles.js');

describe('find submitted article', function() {
  it('should be returning article ids', function() {
    let mock = {
      data: {
        children: [
          {
            data: {
              selftext: 'http:\/\/www3.nhk.or.jp\/news\/easy\/k10010409121000\/k10010409121000.html\n\n&amp;nbsp;\n\n'
            }
          }
        ]
      }
    }
    mock = JSON.stringify(mock);
    return findSubmittedArticles(mock).should.deep.equal(['k10010409121000']);
  });

  it('should not return article id if no nhk url', function() {
    let mock = {
      data: {
        children: [
          {
            data: {
              selftext: 'k10010409121000'
            }
          }
        ]
      }
    }
    mock = JSON.stringify(mock);
    return findSubmittedArticles(mock).should.deep.equal([]);
  })
});