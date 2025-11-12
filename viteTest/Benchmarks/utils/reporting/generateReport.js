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

  // Group results by category for summary chart
  const categories = ["Search", "Ingredients", "Appliances", "Ustensils", "Combined"];
  const categoryAverages = categories.map(category => {
    const categoryResults = flattened.filter(r => r.category === category);
    if (categoryResults.length === 0) return { functional: 0, native: 0 };

    const functionalAvg =
      categoryResults.reduce((sum, r) => sum + r.functional.avg, 0) / categoryResults.length;
    const nativeAvg =
      categoryResults.reduce((sum, r) => sum + r.native.avg, 0) / categoryResults.length;

    return { functional: functionalAvg, native: nativeAvg };
  });

  // Performance comparison chart by category
  if (flattened.length > 0) {
    charts.performance = await chartJSNodeCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels: categories.filter(
          (_, index) =>
            categoryAverages[index].functional > 0 || categoryAverages[index].native > 0,
        ),
        datasets: [
          {
            label: "Functional Avg (ms)",
            data: categoryAverages
              .filter(avg => avg.functional > 0 || avg.native > 0)
              .map(avg => avg.functional),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
          {
            label: "Native Avg (ms)",
            data: categoryAverages
              .filter(avg => avg.functional > 0 || avg.native > 0)
              .map(avg => avg.native),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
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

    // Improvement percentage chart
    const improvements = flattened.map(r => r.improvement);
    if (improvements.length > 0) {
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
  }

  return charts;
}

// Generate HTML report
function generateHTMLReport(results, charts) {
  const flattened = results.flattened || [];
  const summary = results.summary || {};

  let chartsHTML = "";
  if (charts.performance) {
    chartsHTML += `
  <h2>Performance Comparison by Category</h2>
  <div class="chart">
    <img src="data:image/png;base64,${charts.performance.toString("base64")}" />
  </div>`;
  }

  if (charts.improvement) {
    chartsHTML += `
  <h2>Performance Improvement Trend</h2>
  <div class="chart">
    <img src="data:image/png;base64,${charts.improvement.toString("base64")}" />
  </div>`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Benchmark Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
    .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .summary { background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .summary-item { margin: 10px 0; font-size: 16px; }
    .chart { margin: 20px 0; text-align: center; }
    .chart img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #4CAF50; color: white; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    tr:hover { background-color: #f5f5f5; }
    .winner-functional { color: #2196F3; font-weight: bold; }
    .winner-native { color: #f44336; font-weight: bold; }
    .timestamp { color: #666; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Benchmark Performance Report</h1>
    <p class="timestamp">Generated: ${results.timestamp || new Date().toISOString()}</p>
    
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-item"><strong>Total Tests:</strong> ${summary.totalTests || 0}</div>
      <div class="summary-item"><strong>Functional Programming Wins:</strong> ${summary.functionalWins || 0}</div>
      <div class="summary-item"><strong>Native Loops Wins:</strong> ${summary.nativeWins || 0}</div>
      <div class="summary-item"><strong>Overall Winner:</strong> <span class="${summary.overallWinner === "Functional Programming" ? "winner-functional" : "winner-native"}">${summary.overallWinner || "N/A"}</span></div>
      ${summary.averageImprovement ? `<div class="summary-item"><strong>Average Improvement:</strong> ${summary.averageImprovement.toFixed(2)}%</div>` : ""}
    </div>
    
    ${chartsHTML}
    
    <h2>Detailed Results</h2>
    ${
      flattened.length > 0
        ? `
    <table>
      <tr>
        <th>Category</th>
        <th>Test Case</th>
        <th>Functional Avg (ms)</th>
        <th>Native Avg (ms)</th>
        <th>Winner</th>
        <th>Improvement %</th>
      </tr>
      ${flattened
        .map(
          r => `
        <tr>
          <td>${r.category}</td>
          <td>${r.testCase}</td>
          <td>${r.functional.avg.toFixed(4)}</td>
          <td>${r.native.avg.toFixed(4)}</td>
          <td class="${r.winner.includes("Functional") ? "winner-functional" : "winner-native"}">${r.winner}</td>
          <td>${r.improvement.toFixed(2)}%</td>
        </tr>
      `,
        )
        .join("")}
    </table>`
        : "<p>No benchmark results available. Please run the benchmark tests first.</p>"
    }
  </div>
</body>
</html>
  `;
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
