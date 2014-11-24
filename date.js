module.exports = function() {
  var current = convertToJapanTime(Date.now());
  var date = new Date(current);
  var year = date.getFullYear().toString();
  var month = calcMonth(date);
  var day = date.getDate().toString();
  var fullDate = year + '-' + month + '-' + day;

  console.log(date.toTimeString())

  return fullDate;
}

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