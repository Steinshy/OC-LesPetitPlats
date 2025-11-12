/**
 * Chart generation utilities for benchmark reports
 * Creates various charts using Chart.js
 */

import {
  flattenCategoryResults,
  getAverageExecutionTime,
  getAverageRME,
  getImplementations,
} from "../data/results.js";

/**
 * Generate a quick comparison chart showing all implementations side-by-side
 * @param {Object} categoryResults - Results organized by category
 * @returns {Object} Chart.js configuration object
 */
export function generateQuickComparisonChart(categoryResults) {
  const flattened = flattenCategoryResults(categoryResults);
  const implementations = getImplementations(flattened);

  const averages = implementations.map((impl) =>
    getAverageExecutionTime(flattened, impl)
  );

  return {
    type: "bar",
    data: {
      labels: implementations,
      datasets: [
        {
          label: "Average Execution Time (ms)",
          data: averages,
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Quick Comparison - Average Execution Time",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Time (ms)",
          },
        },
      },
    },
  };
}

/**
 * Generate a ranking chart ranking implementations by average performance
 * @param {Object} categoryResults - Results organized by category
 * @returns {Object} Chart.js configuration object
 */
export function generateRankingChart(categoryResults) {
  const flattened = flattenCategoryResults(categoryResults);
  const implementations = getImplementations(flattened);

  const averages = implementations.map((impl) => ({
    name: impl,
    avg: getAverageExecutionTime(flattened, impl),
  }));

  // Sort by average time (fastest first)
  averages.sort((a, b) => a.avg - b.avg);

  return {
    type: "bar",
    data: {
      labels: averages.map((item) => item.name),
      datasets: [
        {
          label: "Average Execution Time (ms)",
          data: averages.map((item) => item.avg),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Performance Ranking (Fastest to Slowest)",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Average Time (ms)",
          },
        },
      },
    },
  };
}

/**
 * Generate a consistency chart showing RME values across implementations
 * @param {Object} categoryResults - Results organized by category
 * @returns {Object} Chart.js configuration object
 */
export function generateConsistencyChart(categoryResults) {
  const flattened = flattenCategoryResults(categoryResults);
  const implementations = getImplementations(flattened);

  const rmeAverages = implementations.map((impl) =>
    getAverageRME(flattened, impl)
  );

  return {
    type: "bar",
    data: {
      labels: implementations,
      datasets: [
        {
          label: "Average RME (%)",
          data: rmeAverages,
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Consistency Analysis (Lower RME = More Consistent)",
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `RME: ${context.parsed.y.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Relative Measurement Error (%)",
          },
        },
      },
    },
  };
}

/**
 * Generate a heatmap chart for speed comparison across test cases and implementations
 * Uses a grouped bar chart with color coding to simulate heatmap visualization
 * @param {Object} categoryResults - Results organized by category
 * @returns {Object} Chart.js configuration object
 */
export function generateHeatmapChart(categoryResults) {
  const flattened = flattenCategoryResults(categoryResults);
  const implementations = getImplementations(flattened);

  // Group by test case
  const testCases = {};
  for (const result of flattened) {
    const key = `${result.category} - ${result.testName}`;
    if (!testCases[key]) {
      testCases[key] = {};
    }
    testCases[key][result.implementation] =
      result.mean || result.executionTime || 0;
  }

  const testCaseNames = Object.keys(testCases);

  // Normalize data for color coding (0-1 scale)
  const allValues = flattened.map(
    (r) => r.mean || r.executionTime || 0
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue || 1;

  // Create a color function for heatmap visualization
  const getColor = (value) => {
    const normalized = range > 0 ? (value - minValue) / range : 0;
    // Green (fast) to Red (slow) gradient
    const red = Math.round(normalized * 255);
    const green = Math.round((1 - normalized) * 255);
    return `rgba(${red}, ${green}, 0, 0.7)`;
  };

  // Create datasets for each implementation
  const colors = [
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
  ];

  const datasets = implementations.map((impl, index) => {
    const data = testCaseNames.map((testName) => {
      const value = testCases[testName][impl] || 0;
      return value;
    });

    return {
      label: impl,
      data: data,
      backgroundColor: data.map((value) => getColor(value)),
      borderColor: colors[index % colors.length],
      borderWidth: 1,
    };
  });

  return {
    type: "bar",
    data: {
      labels: testCaseNames.map((name) =>
        name.length > 30 ? name.substring(0, 27) + "..." : name
      ),
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Speed Comparison Heatmap (Green = Fast, Red = Slow)",
        },
        legend: {
          display: true,
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}ms`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
          title: {
            display: true,
            text: "Test Cases",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Execution Time (ms)",
          },
        },
      },
    },
  };
}

/**
 * Generate all charts for the benchmark report
 * @param {Object} categoryResults - Results organized by category
 * @returns {Object} Object containing all chart configurations
 */
export function generateAllCharts(categoryResults) {
  return {
    quickComparison: generateQuickComparisonChart(categoryResults),
    ranking: generateRankingChart(categoryResults),
    consistency: generateConsistencyChart(categoryResults),
    heatmap: generateHeatmapChart(categoryResults),
  };
}
