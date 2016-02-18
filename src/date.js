let logger = require('./logger.js');

let DateHelper = {
  current: function() {
    return this._current
  },
  _current: null,
  new: function(current) {
      //Get current datetime, convert to japanese time, format into YYYY-MM-DD
      logger.log('debug', 'current datetime ' + current);
      current = current.getTime();
      let japanCurrent = this._convertToJapanTime(current);
      let date = new Date(japanCurrent);
      let year = date.getFullYear().toString();
      let month = this._calcMonth(date);
      let day = this._calcDay(date);
      let fullDate = year + '-' + month + '-' + day;
      logger.log('debug', 'Full date %s', date.toString());
      logger.log('debug', 'Parsed date %s', fullDate);
      //store for later gets
      this._current = fullDate;
  },
  _calcMonth: function(date) {
    let month = date.getMonth();
    month += 1;
    if (month < 10) {
      month = month.toString();
      month = '0' + month;
    } else {
      month = month.toString();
    }
    return month;
  },
  _convertToJapanTime: function(current) {
    let japanOffset = -540;
    let localOffset = new Date().getTimezoneOffset();
    let timezoneDifference = Math.abs(japanOffset - localOffset);
    let timezoneDifferenceMilliseconds = timezoneDifference * 60 * 1000;

    return current + timezoneDifferenceMilliseconds;
  },
  _calcDay: function(date) {
    let day = date.getDate();
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