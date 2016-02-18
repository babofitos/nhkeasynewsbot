let mocha = require('mocha');
let chai = require('chai');
let should = chai.should();
let checkDupe = require('../src/check_dupe.js');

describe('check dupe', function() {
  it('should not return article ids found on reddit', function() {
    checkDupe(['k1'], ['k1']).should.deep.equal([]);
  });

  it('should return article ids not found on reddit', function() {
    checkDupe(['k2','k3','k4'], ['k1']).should.deep.equal(['k2','k3','k4']);
  });
});