module.exports = function() {
  var current = Date.now();
  var date = new Date("November 20 2014");
  var year = date.getFullYear().toString();
  var month = calcMonth(date);
  var day = date.getDate().toString();
  var fullDate = year + '-' + month + '-' + day;

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