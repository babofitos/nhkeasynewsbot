let mocha = require('mocha');
let chai = require('chai');
let should = chai.should();
let date = require('../src/date.js');

describe('date', function() {
  it('should change months to index one', function() {
    date.new(new Date('Jan 01 1970 GMT-0500'));
    date.current().should.equal('1970-01-01');
  });

  it('should not pad double digit months', function() {
    date.new(new Date('Dec 01 1970 GMT-0500'));
    date.current().should.equal('1970-12-01');
  });

  it('should not pad double digit days', function() {
    date.new(new Date('Dec 11 1970 GMT-0500'));
    date.current().should.equal('1970-12-11');
  });
  
  it('should format date and convert to japan YYYY-MM-DD', function() {
    date.new(new Date(1455595371000));
    date.current().should.equal('2016-02-16');
  });
});