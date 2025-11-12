// Enhanced script to generate a comprehensive benchmark report with PDF output
import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import puppeteer from "puppeteer";
import {
  getAllResults,
  getFlattenedResults,
  getSummary,
  clearResults,
  setTimestamp,
} from "../data/dataCollector.js";
import {
  getAverageExecutionTime,
  getAverageRME,
  getImplementations,
  organizeByCategory,
} from "../data/results.js";
import { generateHtmlReport } from "./generateHtml.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const benchmarkDir = join(__dirname, "../../../../Benchmark");

// Collect benchmark results from test execution
async function collectBenchmarkResults() {
  // Set timestamp
  setTimestamp(new Date().toISOString());

  // Get results from data collector
  // Note: Results are persisted to file by tests via addBenchmarkResult()
  const allResults = getAllResults();
  const flattened = getFlattenedResults();
  const summary = getSummary();

  return {
    all: allResults,
    flattened,
    summary,
    timestamp: allResults.timestamp,
  };
}

// Generate charts using Chart.js
async function generateCharts(results) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });

  const charts = {};
  const flattened = results.flattened || [];

  if (flattened.length === 0) {
    return charts;
  }

  // Get all implementations (supports up to 6)
  const implementations = getImplementations(flattened);
  
  // Color palette for up to 6 implementations
  const colors = [
    { bg: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)" },
    { bg: "rgba(255, 99, 132, 0.6)", border: "rgba(255, 99, 132, 1)" },
    { bg: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)" },
    { bg: "rgba(255, 206, 86, 0.6)", border: "rgba(255, 206, 86, 1)" },
    { bg: "rgba(153, 102, 255, 0.6)", border: "rgba(153, 102, 255, 1)" },
    { bg: "rgba(255, 159, 64, 0.6)", border: "rgba(255, 159, 64, 1)" },
  ];

  // Calculate averages for each implementation
  const implAverages = implementations.map(impl => ({
    name: impl,
    avg: getAverageExecutionTime(flattened, impl),
  }));

  // Quick Comparison Chart - all implementations side-by-side
  charts.quickComparison = await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: implementations,
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
  });

  // Group results by category for summary chart
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
      avgs[impl] = implResults.length > 0
        ? implResults.reduce((sum, r) => sum + (r.mean || r.executionTime || 0), 0) / implResults.length
        : 0;
    });
    return avgs;
  });

  // Performance comparison chart by category
  const validCategories = categories.filter((category, index) => {
    const avgs = categoryAverages[index];
    return implementations.some(impl => (avgs[impl] || 0) > 0);
  });

  charts.performance = await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: validCategories,
      datasets: implementations.map((impl, index) => ({
        label: `${impl} Avg (ms)`,
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
      plugins: {
        title: {
          display: true,
          text: "Performance Comparison by Category",
        },
        legend: {
          display: true,
          position: "top",
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
  });

  // Performance Ranking Chart - horizontal bar chart ranking implementations
  const rankings = [...implAverages].sort((a, b) => a.avg - b.avg);

  charts.ranking = await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: rankings.map(item => item.name),
      datasets: [
        {
          label: "Average Execution Time (ms)",
          data: rankings.map(item => item.avg),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
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
  });

  // Consistency Analysis Chart (RME)
  const rmeAverages = implementations.map(impl => getAverageRME(flattened, impl));

  charts.consistency = await chartJSNodeCanvas.renderToBuffer({
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
  });

  // Speed Comparison Heatmap - grouped bar chart with color coding
  // Group by test case
  const testCases = {};
  flattened.forEach(result => {
    const key = `${result.category} - ${result.testName || result.testCase || "Unknown"}`;
    if (!testCases[key]) {
      testCases[key] = {};
    }
    testCases[key][result.implementation] = result.mean || result.executionTime || 0;
  });

  const testCaseNames = Object.keys(testCases);
  const allValues = flattened.map(r => r.mean || r.executionTime || 0).filter(v => v > 0);
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1;
  const range = maxValue - minValue || 1;

  const getColor = (value) => {
    const normalized = range > 0 ? (value - minValue) / range : 0;
    const red = Math.round(normalized * 255);
    const green = Math.round((1 - normalized) * 255);
    return `rgba(${red}, ${green}, 0, 0.7)`;
  };

  charts.heatmap = await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: testCaseNames.map(name =>
        name.length > 30 ? name.substring(0, 27) + "..." : name
      ),
      datasets: implementations.map((impl, index) => ({
        label: impl,
        data: testCaseNames.map(testName => testCases[testName][impl] || 0),
        backgroundColor: testCaseNames.map(testName => {
          const value = testCases[testName][impl] || 0;
          return getColor(value);
        }),
        borderColor: colors[index % colors.length].border,
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Speed Comparison Heatmap (Green = Fast, Red = Slow)",
        },
        legend: {
          display: true,
          position: "right",
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
  });

  // Improvement percentage chart
  const improvements = flattened.map(r => r.improvement || 0);
  if (improvements.length > 0 && improvements.some(imp => imp !== 0)) {
    charts.improvement = await chartJSNodeCanvas.renderToBuffer({
      type: "line",
      data: {
        labels: flattened.map((r, index) => `Test ${index + 1}`),
        datasets: [
          {
            label: "Improvement %",
            data: improvements,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Performance Improvement Percentage",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Improvement %",
            },
          },
        },
      },
    });
  }

  return charts;
}

// Generate HTML report using the enhanced HTML generator
function generateHTMLReport(results, charts) {
  return generateHtmlReport(results, charts);
}

// Generate PDF from HTML
async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
  });
  await browser.close();
}

// Main execution
async function main() {
  console.log("=".repeat(60));
  console.log("GENERATING BENCHMARK REPORT");
  console.log("=".repeat(60));

  try {
    // Get test files from command line arguments, or use all tests by default
    const testFiles = process.argv.slice(2);
    const allTests = [
      { name: "Search", file: "viteTest/Benchmarks/search.test.js" },
      { name: "Ingredients", file: "viteTest/Benchmarks/filterByIngredients.test.js" },
      { name: "Appliances", file: "viteTest/Benchmarks/filterByAppliances.test.js" },
      { name: "Ustensils", file: "viteTest/Benchmarks/filterByUstensils.test.js" },
      { name: "Filters Recipes", file: "viteTest/Benchmarks/filtersRecipes.test.js" },
    ];

    // Filter tests based on arguments, or use all if no arguments
    const testsToRun = testFiles.length > 0
      ? allTests.filter(test => testFiles.some(arg => test.file.includes(arg)))
      : allTests;

    if (testsToRun.length === 0) {
      console.error("No matching test files found. Available tests:");
      allTests.forEach(test => console.error(`  - ${test.file}`));
      process.exit(1);
    }

    // 0. Clear previous results before running tests
    clearResults();

    // 1. Run benchmark tests
    testsToRun.forEach((test, index) => {
      console.log(`\n${index + 1}. Running ${test.name} Benchmark Tests...`);
      execSync(`vitest run --reporter=verbose ${test.file}`, {
        stdio: "inherit",
      });
    });

    // 2. Collect results from data collector
    console.log(`\n${testsToRun.length + 1}. Collecting benchmark results...`);
    const results = await collectBenchmarkResults();

    if (results.flattened.length === 0) {
      console.warn("\n⚠ Warning: No benchmark results found.");
      console.warn("Tests need to be modified to use addBenchmarkResult() from dataCollector.js");
      console.warn("For now, generating report with empty data structure...\n");
    }

    // 3. Generate charts
    console.log(`${testsToRun.length + 2}. Generating charts...`);
    const charts = await generateCharts(results);

    if (Object.keys(charts).length === 0) {
      console.warn("⚠ No charts generated - no data available");
    }

    // 4. Generate HTML report
    console.log(`${testsToRun.length + 3}. Generating HTML report...`);
    const html = generateHTMLReport(results, charts);

    // Save HTML version as well
    mkdirSync(benchmarkDir, { recursive: true });
    // Generate report filename based on tests run
    const reportSuffix = testsToRun.length === 1
      ? testsToRun[0].name.toLowerCase().replace(/\s+/g, "-")
      : "all";
    const htmlPath = join(benchmarkDir, `benchmark-report-${reportSuffix}.html`);
    writeFileSync(htmlPath, html, "utf-8");
    console.log(`✓ HTML Report saved to: ${htmlPath}`);

    // 5. Convert to PDF
    if (Object.keys(charts).length > 0) {
      console.log(`${testsToRun.length + 4}. Converting to PDF...`);
      const pdfPath = join(benchmarkDir, `benchmark-report-${reportSuffix}.pdf`);
      await generatePDF(html, pdfPath);
      console.log(`✓ PDF Report saved to: ${pdfPath}`);
    } else {
      console.warn("⚠ Skipping PDF generation - no charts available");
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log("REPORT GENERATION COMPLETED");
    console.log("=".repeat(60));
    console.log(`\n✓ HTML Report: ${htmlPath}`);
    if (Object.keys(charts).length > 0) {
      console.log(`✓ PDF Report: ${join(benchmarkDir, `benchmark-report-${reportSuffix}.pdf`)}`);
    }
  } catch (error) {
    console.error("Error generating benchmark report:", error.message);
    process.exit(1);
  }
}

main();
