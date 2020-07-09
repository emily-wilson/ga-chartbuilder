const makeChart = require("./charts");
const {ReportBuilder, config} = require("./config");
const getData = require("./data");

const getReport = (analytics, gaOptions, chartOptions) => {
  if (gaOptions.length != chartOptions.length) {
    throw err("GA Options length and Chart options length do not match");
  }
  return getData(analytics, gaOptions)
    .then(res => {
      if (res.data.totalResults > 0) {
        console.log(res.data.rows)
        const chart = makeChart(res.data, chartOptions);
        return chart;
      }
      return null;
    });
  //TODO: add catch statement
}

ReportBuilder.prototype.generateReports = async function (gaOptions, chartOptions) {
  let reports = [];
  for (let i = 0; i < gaOptions.length; i++) {
    if (!gaOptions[i].ids) {
      gaOptions[i].ids = this.ids;
    }

    const _chartOptions = Object.assign(this.chartOptions, chartOptions[i]);

    const report = await getReport(this.analytics, gaOptions[i], _chartOptions);
    if (report) {
      reports.push(report);
    }
  }
  return reports;
}

module.exports = {
  config
};
