var stream = require('stream');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var logger = require('./logger.js');

function CheckDupe() {
  EventEmitter.call(this);
  this.index = 0;
  this.kids = [];
  this.max = 2;
  this.on('data', function(data, pos) {
    logger.log('debug', 'checkdupe %j for %d', data, pos);
    this.kids[pos] = data;
    logger.debug('this.index', this.index);
    if (++this.index === this.max) {
      logger.debug('Filtering article ids');
      var complement = this.kids[0].filter(function(id) {
        return this.kids[1].indexOf(id) < 0;
      }.bind(this));

      if (complement.length < 1) {
        logger.debug('Emitting empty');
        this.emit('empty');
      } else {
        var readable = new stream.Readable({objectMode: true});

        readable._read = function() {
          this.push(complement);
          this.push(null);
        };
        logger.debug('Non dupes found. Emitting ready');
        this.emit('ready', readable);
      }
    } 
  }.bind(this));

}

util.inherits(CheckDupe, EventEmitter);

module.exports = CheckDupe;