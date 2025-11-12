// Enhanced script to generate a comprehensive benchmark report with PDF output
import { execSync } from "child_process";
import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import puppeteer from "puppeteer";
import { pdfConfig } from "../../../../puppeteer.config.js";
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

// Helper function to create chart labels
function createChartLabels(implementations) {
  const shortLabels = implementations.map(impl => {
    if (impl.includes("Production") || impl.includes("production filter")) return "Production";
    if (impl.includes("Loops") && impl.includes("filter-loops")) return "Loops";
    if (impl.includes("forEach")) return "forEach";
    if (impl.includes("reduce")) return "reduce";
    if (impl.includes("for (using for loops)")) return "for";
    if (impl.includes("while")) return "while";
    return impl.length > 15 ? `${impl.substring(0, 15)  }...` : impl;
  });

  const legendLabels = implementations.map(impl => {
    if (impl.includes("Production") || impl.includes("production filter")) return "Production";
    if (impl.includes("Loops") && impl.includes("filter-loops")) return "Loops";
    if (impl.includes("forEach")) return "forEach";
    if (impl.includes("reduce")) return "reduce";
    if (impl.includes("for (using for loops)")) return "for";
    if (impl.includes("while")) return "while";
    return impl.split(" ")[0];
  });

  return { shortLabels, legendLabels };
}

// Helper function to get color palette
function getColorPalette() {
  return [
    { bg: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)", name: "Production" },
    { bg: "rgba(255, 99, 132, 0.6)", border: "rgba(255, 99, 132, 1)", name: "Loops" },
    { bg: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)", name: "forEach" },
    { bg: "rgba(255, 206, 86, 0.6)", border: "rgba(255, 206, 86, 1)", name: "reduce" },
    { bg: "rgba(153, 102, 255, 0.6)", border: "rgba(153, 102, 255, 1)", name: "for" },
    { bg: "rgba(255, 159, 64, 0.6)", border: "rgba(255, 159, 64, 1)", name: "while" },
  ];
}

// Generate quick comparison chart
async function generateQuickComparisonChart(chartJSNodeCanvas, implementations, shortLabels, legendLabels, colors, implAverages) {
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
async function generatePerformanceChart(chartJSNodeCanvas, implementations, shortLabels, colors, flattened) {
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
async function generateRankingChart(chartJSNodeCanvas, implementations, shortLabels, legendLabels, colors, implAverages) {
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
                  fillStyle: index >= 0 ? colors[index % colors.length].bg : "rgba(75, 192, 192, 0.6)",
                  strokeStyle: index >= 0 ? colors[index % colors.length].border : "rgba(75, 192, 192, 1)",
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
async function generateConsistencyChart(chartJSNodeCanvas, implementations, shortLabels, legendLabels, colors, flattened) {
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
            label (context) {
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
  const improvements = flattened.map(r => r.improvement || 0);
  if (improvements.length === 0 || !improvements.some(imp => imp !== 0)) {
    return null;
  }

  return await chartJSNodeCanvas.renderToBuffer({
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
          text: "Performance Improvement Percentage",
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
      },
      scales: {
        x: {
          ticks: {
            font: { size: 9 },
            maxTicksLimit: 15,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Improvement %",
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

// Generate charts using Chart.js
async function generateCharts(results) {
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

// Generate HTML report using the enhanced HTML generator
function generateHTMLReport(results, charts) {
  return generateHtmlReport(results, charts);
}

// Generate PDF from HTML using configuration file
async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch(pdfConfig.browser);
  const page = await browser.newPage();

  try {
    // Set content and wait for it to load
    await page.setContent(html, pdfConfig.page);

    // Emulate print media to ensure print CSS (@media print) is applied
    // This is critical for page-break CSS properties to work
    await page.emulateMediaType(pdfConfig.mediaType);

    // Generate PDF with configuration from config file
    await page.pdf({
      ...pdfConfig.pdf,
      path: outputPath,
    });
  } finally {
    await browser.close();
  }
}

// Clean up existing benchmark files
function cleanupBenchmarkFiles() {
  try {
    if (existsSync(benchmarkDir)) {
      const files = readdirSync(benchmarkDir);
      const filesToDelete = files.filter(file =>
        file.endsWith(".html") ||
        file.endsWith(".pdf"),
        // Note: .json file is handled by clearResults() separately
      );

      if (filesToDelete.length > 0) {
        console.log(`\nCleaning up ${filesToDelete.length} existing benchmark file(s)...`);
        filesToDelete.forEach(file => {
          const filePath = join(benchmarkDir, file);
          try {
            unlinkSync(filePath);
            console.log(`  ✓ Deleted: ${file}`);
          } catch (error) {
            console.warn(`  ⚠ Failed to delete ${file}: ${error.message}`);
          }
        });
      }
    }
  } catch (error) {
    console.warn(`⚠ Warning: Could not clean up benchmark files: ${error.message}`);
  }
}

// Main execution
async function main() {
  console.log("=".repeat(60));
  console.log("GENERATING BENCHMARK REPORT");
  console.log("=".repeat(60));

  try {
    // 0. Clean up existing benchmark files (HTML/PDF)
    cleanupBenchmarkFiles();

    // 0.5. Always clear benchmark results at the very start
    // This ensures we start with a clean slate, even if tests were run manually before
    console.log("\n0. Clearing previous benchmark results...");
    clearResults();

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

    // 4. Generate charts
    console.log(`${testsToRun.length + 2}. Generating charts...`);
    const charts = await generateCharts(results);

    if (Object.keys(charts).length === 0) {
      console.warn("⚠ No charts generated - no data available");
    }

    // 5. Generate HTML report
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

    // 6. Convert to PDF
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
