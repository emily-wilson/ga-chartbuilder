const Chart = require("chart.js");
const {CanvasRenderService} = require("chartjs-node-canvas");
const {formatDate, normalize} = require("./utils");

const buildDataPoints = (data, renderAsImage) => {
  if (renderAsImage) {
    return data.map(row => row[1]);
  }
  return data.map(row => `"${row[1]}"`);
}

const buildLabels = (data, dateFormat, renderAsImage) => {
  if (renderAsImage) {
    return data.map(row => formatDate(row[0], dateFormat));
  }
  return data.map(row => `"${formatDate(row[0], dateFormat)}"`);
}

const chartContainer = (ind, script) => (`
  <html>
    <canvas id=chart${ind}></canvas>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
    <script>
      ${script}
    </script>
  </html>
`);

// If labelsFromData flag is set to be true, use data for labels and labels field will be overwritten
const chart = async (data, options, ind) => {
  let labels = [];
  let dataPoints = [];

  if (options.labelsFromData) {
    labels = buildLabels(data, options.dateFormat, options.renderAsImage);
    dataPoints = buildDataPoints(data, options.renderAsImage);
  } else {
    labels = options.labels;
    dataPoints = data;
  }

  if (options.type === "pie" || options.type === "doughnut") {
    dataPoints = normalize(dataPoints);
  }

  if (dataPoints.length != labels.length) {
    throw "Data points and labels length mismatches";
  }

  if (options.renderAsImage) {
    const canvasRenderService = new CanvasRenderService(options.width || 400, options.height || 400, ChartJS => {});

    const image = await canvasRenderService.renderToDataURL({
      type: options.type,
      data: {
        labels: labels,
        datasets: [Object.assign({
          data: dataPoints
        }, options.datasetOptions)]
      },
      options: Object.assign({
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              suggestedMin: 0
            }
          }]
        }
      }, options.chartOptions)
    });
    return image;
  }

  const script = (`
    var ctx = document.getElementById("chart${ind}").getContext("2d")
    var chart = new Chart(ctx, {
      type: "${options.type}",
      data: {
        labels: [${labels}],
        datasets: [{
          label: "${options.datasetLabel}",
          data: [${dataPoints}]
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  `);
  return chartContainer(ind, script);
}

const table = (data, options) => {
  return (
    `<html>
      <table>
        <tr>
          ${options.columnHeaders.reduce((acc, header) => `${acc}<th>${header}</th>`, "")}
        </tr>
        ${data.reduce((acc, row) => (
          `${acc}
          <tr>
            ${row.reduce((acc, item) => `${acc}<td>${item}</td>`, "")}
          </tr>`
        ), "")}
      </table>
    </html>`
  )
}

const makeChart = (data, options, ind) => {
  if (!options.type || options.type === "table") {
    return table(data.rows, options);
  }
  return chart(data.rows, options, ind);
};

module.exports = makeChart;
