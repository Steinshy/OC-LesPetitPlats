import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import chroma from "chroma-js";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "@benchmarks-data/results.js";
import { getShortLabel } from "@benchmarks-reporting-helpers/formatting.js";

// Helper function to create chart labels
function createChartLabels(implementations) {
  const shortLabels = implementations.map(impl => getShortLabel(impl, 15));

  const legendLabels = implementations.map(impl => {
    const label = getShortLabel(impl, 20);
    return label.split(" ")[0];
  });

  return { shortLabels, legendLabels };
}

// Helper function to get color palette using chroma-js
function getColorPalette() {
  // Generate colors using chroma-js for better color management
  const productionColor = chroma("#36a2eb"); // Blue
  const mapsColor = chroma("#ff6384"); // Red/Pink

  return [
    {
      bg: productionColor.alpha(0.6).css(),
      border: productionColor.css(),
      name: "Production",
    },
    {
      bg: mapsColor.alpha(0.6).css(),
      border: mapsColor.css(),
      name: "Maps",
    },
  ];
}

// Generate quick comparison chart
async function generateQuickComparisonChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  legendLabels,
  colors,
  implAverages,
) {
  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: shortLabels,
      datasets: [
        {
          label: "Average Execution Time (ms)",
          data: implAverages.map(impl => impl.avg),
          backgroundColor: implementations.map((_, index) => colors[index % colors.length].bg),
          borderColor: implementations.map((_, index) => colors[index % colors.length].border),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 80,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Quick Comparison - Average Execution Time",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            generateLabels: () => {
              return implementations.map((impl, index) => ({
                text: legendLabels[index],
                fillStyle: colors[index % colors.length].bg,
                strokeStyle: colors[index % colors.length].border,
                lineWidth: 2,
                padding: 8,
              }));
            },
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            font: { size: 8 },
            maxTicksLimit: 15,
            autoSkip: true,
          },
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Time (ms)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
          grid: {
            display: true,
          },
        },
      },
    },
  });
}

// Generate performance comparison chart by category
async function generatePerformanceChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  colors,
  flattened,
) {
  const categories = ["Search", "Ingredients", "Appliances", "Ustensils", "Combined"];
  const categoryAverages = categories.map(category => {
    const categoryResults = flattened.filter(r => r.category === category);
    if (categoryResults.length === 0) {
      return implementations.reduce((acc, impl) => {
        acc[impl] = 0;
        return acc;
      }, {});
    }

    const avgs = {};
    implementations.forEach(impl => {
      const implResults = categoryResults.filter(r => r.implementation === impl);
      avgs[impl] =
        implResults.length > 0
          ? implResults.reduce((sum, r) => sum + (r.mean || r.executionTime || 0), 0) /
            implResults.length
          : 0;
    });
    return avgs;
  });

  const validCategories = categories.filter((category, index) => {
    const avgs = categoryAverages[index];
    return implementations.some(impl => (avgs[impl] || 0) > 0);
  });

  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: validCategories,
      datasets: implementations.map((impl, index) => ({
        label: shortLabels[index],
        data: validCategories.map(category => {
          const catIndex = categories.indexOf(category);
          return categoryAverages[catIndex][impl] || 0;
        }),
        backgroundColor: colors[index % colors.length].bg,
        borderColor: colors[index % colors.length].border,
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 80,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Performance Comparison by Category",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 8 },
            maxTicksLimit: 10,
            autoSkip: true,
          },
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Time (ms)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
        },
      },
    },
  });
}

// Generate ranking chart
async function generateRankingChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  legendLabels,
  colors,
  implAverages,
) {
  const rankings = [...implAverages].sort((a, b) => a.avg - b.avg);

  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: rankings.map(item => {
        const index = implementations.indexOf(item.name);
        return index >= 0 ? shortLabels[index] : item.name;
      }),
      datasets: [
        {
          label: "Average Execution Time (ms)",
          data: rankings.map(item => item.avg),
          backgroundColor: rankings.map(item => {
            const index = implementations.indexOf(item.name);
            return index >= 0 ? colors[index % colors.length].bg : "rgba(75, 192, 192, 0.6)";
          }),
          borderColor: rankings.map(item => {
            const index = implementations.indexOf(item.name);
            return index >= 0 ? colors[index % colors.length].border : "rgba(75, 192, 192, 1)";
          }),
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 60,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Performance Ranking (Fastest to Slowest)",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            generateLabels: () => {
              return rankings.map(item => {
                const index = implementations.indexOf(item.name);
                return {
                  text: index >= 0 ? legendLabels[index] : item.name.split(" ")[0],
                  fillStyle:
                    index >= 0 ? colors[index % colors.length].bg : "rgba(75, 192, 192, 0.6)",
                  strokeStyle:
                    index >= 0 ? colors[index % colors.length].border : "rgba(75, 192, 192, 1)",
                  lineWidth: 2,
                  padding: 8,
                };
              });
            },
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Average Time (ms)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
        },
        y: {
          ticks: {
            font: { size: 9 },
          },
        },
      },
    },
  });
}

// Generate consistency chart (RME)
async function generateConsistencyChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  legendLabels,
  colors,
  flattened,
) {
  const rmeAverages = implementations.map(impl => getAverageRME(flattened, impl));

  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: shortLabels,
      datasets: [
        {
          label: "Average RME (%)",
          data: rmeAverages,
          backgroundColor: implementations.map((_, index) => colors[index % colors.length].bg),
          borderColor: implementations.map((_, index) => colors[index % colors.length].border),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 80,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Consistency Analysis (Lower RME = More Consistent)",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            generateLabels: () => {
              return implementations.map((impl, index) => ({
                text: legendLabels[index],
                fillStyle: colors[index % colors.length].bg,
                strokeStyle: colors[index % colors.length].border,
                lineWidth: 2,
                padding: 8,
              }));
            },
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `RME: ${context.parsed.y.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            font: { size: 8 },
            maxTicksLimit: 15,
            autoSkip: true,
          },
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Relative Measurement Error (%)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
        },
      },
    },
  });
}

// Generate improvement chart
async function generateImprovementChart(chartJSNodeCanvas, flattened) {
  // Group results by test case (category + testName)
  const testCases = {};
  flattened.forEach(result => {
    const key = `${result.category} - ${result.testName || result.testCase || "Unknown"}`;
    if (!testCases[key]) {
      testCases[key] = {};
    }
    testCases[key][result.implementation] = {
      time: result.mean || result.executionTime || 0,
      category: result.category,
      testName: result.testName || result.testCase || "Unknown",
    };
  });

  // Calculate improvement for each test case
  const improvementData = [];
  const labels = [];

  Object.entries(testCases).forEach(([key, implementations]) => {
    const productionTime = implementations["Production"]?.time || 0;
    const mapsTime = implementations["Maps"]?.time || 0;

    if (productionTime > 0 && mapsTime > 0) {
      // Calculate improvement: positive if Maps is faster, negative if Production is faster
      // Improvement = ((slower - faster) / slower) * 100
      const slower = Math.max(productionTime, mapsTime);
      const faster = Math.min(productionTime, mapsTime);
      const improvement = slower > 0 ? ((slower - faster) / slower) * 100 : 0;

      // Make it positive if Maps is faster, negative if Production is faster
      const improvementValue = mapsTime < productionTime ? improvement : -improvement;

      improvementData.push(improvementValue);

      // Create a short label for the test
      const testName =
        implementations["Production"]?.testName || implementations["Maps"]?.testName || key;
      const shortName = testName.length > 30 ? `${testName.substring(0, 27)}...` : testName;
      labels.push(shortName);
    }
  });

  if (improvementData.length === 0 || !improvementData.some(imp => imp !== 0)) {
    return null;
  }

  return await chartJSNodeCanvas.renderToBuffer({
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Maps vs Production (%)",
          data: improvementData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 70,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Performance Improvement: Maps vs Production",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            font: { size: 11, weight: "bold" },
            padding: 15,
            boxWidth: 30,
            boxHeight: 18,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed.y;
              const sign = value >= 0 ? "+" : "";
              return `${sign}${value.toFixed(2)}% ${value >= 0 ? "(Maps faster)" : "(Production faster)"}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 9 },
            maxTicksLimit: 20,
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Improvement % (positive = Maps faster)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
            callback(value) {
              return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
            },
          },
        },
      },
    },
  });
}

// Generate charts using Chart.js
export async function generateCharts(results) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1200, height: 400 });
  const charts = {};
  const flattened = results.flattened || [];

  if (flattened.length === 0) {
    return charts;
  }

  const implementations = getImplementations(flattened);
  const { shortLabels, legendLabels } = createChartLabels(implementations);
  const colors = getColorPalette();
  const implAverages = implementations.map(impl => ({
    name: impl,
    avg: getAverageExecutionTime(flattened, impl),
  }));

  charts.quickComparison = await generateQuickComparisonChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    legendLabels,
    colors,
    implAverages,
  );

  charts.performance = await generatePerformanceChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    colors,
    flattened,
  );

  charts.ranking = await generateRankingChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    legendLabels,
    colors,
    implAverages,
  );

  charts.consistency = await generateConsistencyChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    legendLabels,
    colors,
    flattened,
  );

  const improvementChart = await generateImprovementChart(chartJSNodeCanvas, flattened);
  if (improvementChart) {
    charts.improvement = improvementChart;
  }

  return charts;
}
