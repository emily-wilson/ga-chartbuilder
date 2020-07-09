const {google} = require("googleapis");
const http = require("http");
const url = require("url");
const opn = require("open");

function ReportBuilder(analytics, chartOptions) {
  this.analytics = analytics;
  this.chartOptions = chartOptions;
};

const validateOptions = (options) => {
  if (!options.keyFile) {
    throw err("Missing key file");
  }
}

async function config(options) {
  validateOptions(options);

  const {keyFile, scopes, ids, chartOptions} = options;

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: scopes || "https://www.googleapis.com/auth/analytics.readonly"
  });
  const authClient = await auth.getClient();

  google.options({
    auth: authClient
  });

  const analytics = google.analytics({
    version: "v3",
    auth: authClient
  });

  const rb = new ReportBuilder(analytics, chartOptions);
  rb.ids = ids;

  return rb;
}

exports.ReportBuilder = ReportBuilder;
exports.config = config;
