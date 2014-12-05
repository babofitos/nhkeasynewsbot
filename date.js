var logger = require('./logger.js');
var h;

exports.new = function(current) {
  current = current.getTime();
  var japanCurrent = convertToJapanTime(current);
  var date = new Date(japanCurrent);
  var year = date.getFullYear().toString();
  var month = calcMonth(date);
  var day = calcDay(date);
  var fullDate = year + '-' + month + '-' + day;
  logger.log('debug', 'Full date %s', date.toString());
  logger.log('debug', 'Parsed date %s', fullDate);

  h = fullDate;
};

exports.current = function() {
  return h;
};

function calcMonth(date) {
  var month = date.getMonth();
  month += 1;
  if (month < 10) {
    month = month.toString();
    month = '0' + month;
  } else {
    month = month.toString();
  }
  return month;
}

function convertToJapanTime(current) {
  var japanOffset = -540;
  var localOffset = new Date().getTimezoneOffset();
  var timezoneDifference = Math.abs(japanOffset - localOffset);
  var timezoneDifferenceMilliseconds = timezoneDifference * 60 * 1000;

  return current + timezoneDifferenceMilliseconds;
}

function calcDay(date) {
  var day = date.getDate();
  if (day < 10) {
    day = day.toString();
    day = '0' + day;
  } else {
    day = day.toString();
  }
  return day;
}