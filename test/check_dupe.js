var assert = require('assert');
var CheckDupe = require('../lib/check_dupe.js');
var mockCurrentIds = ['k1','k2','k3'];
var mockSubmittedIds = ['k4','k5'];

describe('checkDupe', function() {
  var checkDupe;

  beforeEach(function() {
    checkDupe = new CheckDupe();
  });

  it('should return the non duplicate ids in first array', function(done) {
    checkDupe.on('ready', function(readable) {
      readable.on('data', function(data) {
        var complement = mockCurrentIds.filter(function(id) {
          return mockSubmittedIds.indexOf(id) < 0;
        });
        assert.deepEqual(data, complement);
        done();
      });
    });
    checkDupe.emit('data', mockCurrentIds, 0);
    checkDupe.emit('data', mockSubmittedIds, 1);
  });

  it('should emit empty when all dupes', function(done) {
    checkDupe.on('empty', function() {
      done();
    });

    checkDupe.emit('data', mockCurrentIds, 0);
    checkDupe.emit('data', mockCurrentIds, 1);
  });
});