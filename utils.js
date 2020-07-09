const monthYear = (date) => {
  return date.substr(4) + "-" + date.substr(0, 4);
}

const monthYearDay = (date) => {
  return date.substr(4, 2) + "-" + date.substr(6) + "-" + date.substr(0, 4);
}

const formatDate = (date, format) => {
  if (!format) {
    return date;
  } else if (format == "YYYYMM") {
    return monthYear(date);
  } else if (format == "YYYYMMDD") {
    return monthYearDay(date);
  }
  throw "Unrecognized format";
}

const normalize = (data) => {
  const sum = data.reduce((a, x) => a + x);

  return data.map(item => item / sum);
}

exports.formatDate = formatDate;
exports.normalize = normalize;
