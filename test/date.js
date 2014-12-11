var assert = require('assert');

describe('date', function() {
  it('should parse date as correct', function() {
    var now = new Date('Nov 11 2014');
    require('../lib/date.js').new(now);
    var date = require('../lib/date.js').current(); 
    assert.equal(date, '2014-11-11');
  });

  it('should pad days less than 10 with a 0', function() {
    var now = new Date('Nov 1 2014');
    require('../lib/date.js').new(now);
    var date = require('../lib/date.js').current(); 
    assert.equal(date, '2014-11-01');
  });

  it('should not pad days more than 10 with a 0', function() {
    var now = new Date('Nov 20 2014');
    require('../lib/date.js').new(now);
    var date = require('../lib/date.js').current(); 
    assert.equal(date, '2014-11-20');
  });

  it('should pad months less than 10 with a 0', function() {
    var now = new Date('Jan 11 2014');
    require('../lib/date.js').new(now);
    var date = require('../lib/date.js').current(); 
    assert.equal(date, '2014-01-11');
  });

  it('should not pad months more than 10 with a 0', function() {
    var now = new Date('Dec 11 2014');
    require('../lib/date.js').new(now);
    var date = require('../lib/date.js').current(); 
    assert.equal(date, '2014-12-11');
  });

  it('should move months from zero index to one', function() {
    var now = new Date('Jan 11 2014');
    require('../lib/date.js').new(now);
    var date = require('../lib/date.js').current(); 
    var month = date.split('-')[1];
    assert.equal(month, '01');
  });

  it('should make time utc +9', function() {
    var now = new Date('Jan 11 2014 15:00');
    require('../lib/date.js').new(now);
    var date = require('../lib/date.js').current(); 

    assert.equal(date, '2014-01-12');
  })
})