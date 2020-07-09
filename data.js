const buildParams = (options) => {
  const params = {};

  params["dimensions"] = "";
  options.dimensions.forEach(dim => params["dimensions"] += `ga:${dim},`);
  params["dimensions"] = params["dimensions"].substr(0, params["dimensions"].length - 1);

  params["metrics"] = "";
  options.metrics.forEach(met => params["metrics"] += `ga:${met},`);
  params["metrics"] = params["metrics"].substr(0, params["metrics"].length - 1);

  params["start-date"] = options.startDate || "30daysAgo";

  params["end-date"] = options.endDate || "today";

  if (options.filters) {
    params["filters"] = options.filters;
  }

  params["ids"] = options.ids;

  params["include-empty-rows"] = options.includeEmptyRows || "false";

  return params;
}

const getData = (analytics, options) => {
  if (!analytics) {
    throw "Must configure first";
  }

  const params = buildParams(options);

  return analytics.data.ga.get(params);
};

module.exports = getData;
