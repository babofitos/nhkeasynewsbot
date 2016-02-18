'use strict';

var logger = require('./logger.js');

var DateHelper = {
  current: function current() {
    return this._current;
  },
  _current: null,
  new: function _new(current) {
    //Get current datetime, convert to japanese time, format into YYYY-MM-DD
    logger.log('debug', 'current datetime ' + current);
    current = current.getTime();
    var japanCurrent = this._convertToJapanTime(current);
    var date = new Date(japanCurrent);
    var year = date.getFullYear().toString();
    var month = this._calcMonth(date);
    var day = this._calcDay(date);
    var fullDate = year + '-' + month + '-' + day;
    logger.log('debug', 'Full date %s', date.toString());
    logger.log('debug', 'Parsed date %s', fullDate);
    //store for later gets
    this._current = fullDate;
  },
  _calcMonth: function _calcMonth(date) {
    var month = date.getMonth();
    month += 1;
    if (month < 10) {
      month = month.toString();
      month = '0' + month;
    } else {
      month = month.toString();
    }
    return month;
  },
  _convertToJapanTime: function _convertToJapanTime(current) {
    var japanOffset = -540;
    var localOffset = new Date().getTimezoneOffset();
    var timezoneDifference = Math.abs(japanOffset - localOffset);
    var timezoneDifferenceMilliseconds = timezoneDifference * 60 * 1000;

    return current + timezoneDifferenceMilliseconds;
  },
  _calcDay: function _calcDay(date) {
    var day = date.getDate();
    if (day < 10) {
      day = day.toString();
      day = '0' + day;
    } else {
      day = day.toString();
    }
    return day;
  }
};

module.exports = DateHelper;