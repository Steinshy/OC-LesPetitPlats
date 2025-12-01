import { writeFileSync } from "node:fs";
import chalk from "chalk";
import { getAllResults, getFlattenedResults, getSummary, clearResults, setTimestamp } from "@benchmarks-data/collector.js";
import { generateHtmlReport } from "@benchmarks-reporting/generateHtml.js";
import { createSpinner } from "@benchmarks-utils/logging.js";
import { generateReportPath } from "../../../../scripts/reportUtils.js";
import { generateCharts } from "./charts.js";
import { cleanupBenchmarkFiles } from "./cleanup.js";
import { handleRunningVitest } from "./runner.js";

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

// Display header banner
function displayHeader() {
  console.log(`\n${chalk.bold(chalk.cyan(`╔${"═".repeat(58)}╗`))}`);
  console.log(
    chalk.bold(chalk.cyan(`║${" ".repeat(15)}BENCHMARK REPORT GENERATOR${" ".repeat(18)}║`)),
  );
  console.log(chalk.bold(chalk.cyan(`╚${"═".repeat(58)}╝`)));
}




// Initialize benchmark process (cleanup and setup)
async function initializeBenchmark() {
  const cleanupSpinner = createSpinner("Cleaning up existing benchmark files...");
  cleanupBenchmarkFiles();
  cleanupSpinner.succeed("Cleaned up existing benchmark files");

  const clearSpinner = createSpinner("Clearing previous benchmark results...");
  clearResults();
  clearSpinner.succeed("Cleared previous benchmark results");

  await handleRunningVitest();
}


// Get list of tests to run based on command line arguments
function getTestsToRun() {
  const testFiles = process.argv.slice(2);
  const allTests = [
    { name: "Search", file: "viteTest/Benchmarks/tests/search.test.js" },
    { name: "Ingredients", file: "viteTest/Benchmarks/tests/filterByIngredients.test.js" },
    { name: "Appliances", file: "viteTest/Benchmarks/tests/filterByAppliances.test.js" },
    { name: "utensils", file: "viteTest/Benchmarks/tests/filterByutensils.test.js" },
  ];

  const testsToRun =
    testFiles.length > 0
      ? allTests.filter(test => testFiles.some(arg => test.file.includes(arg)))
      : allTests;

  if (testsToRun.length === 0) {
    console.error("No matching test files found. Available tests:");
    allTests.forEach(test => console.error(`  - ${test.file}`));
    process.exit(1);
  }

  return testsToRun;
}


// Generate and save the report
async function generateAndSaveReport(results, testsToRun, runAllTests) {
  const chartsSpinner = createSpinner("Generating charts...");
  const chartsResult = await generateCharts(results);
  if (Object.keys(chartsResult).length === 0) {
    chartsSpinner.warn("No charts generated - no data available");
  } else {
    chartsSpinner.succeed(`Generated ${Object.keys(chartsResult).length} chart(s)`);
  }

  const htmlSpinner = createSpinner("Generating HTML report...");
  const html = await generateHTMLReport(results, chartsResult);
  htmlSpinner.succeed("Generated HTML report");

  // Determine report suffix based on number of tests and whether "All" tests were run
  let reportSuffix;
  if (testsToRun.length === 1) {
    reportSuffix = testsToRun[0].name.toLowerCase().replace(/\s+/g, "-");
  } else if (runAllTests) {
    reportSuffix = "all";
  } else {
    reportSuffix = "partial";
  }
  const htmlPath = generateReportPath(`benchmark-${reportSuffix}`, "html", process.cwd());
  writeFileSync(htmlPath, html, "utf-8");

  return htmlPath;
}

// Generate HTML report using the enhanced HTML generator
function generateHTMLReport(results, charts) {
  return generateHtmlReport(results, charts);
}

export { collectBenchmarkResults, displayHeader, initializeBenchmark, getTestsToRun, generateAndSaveReport, generateHTMLReport };
