import { writeFileSync } from "node:fs";
import chalk from "chalk";
import { getAllResults, getFlattenedResults, getSummary, clearResults, setTimestamp } from "@benchmarks-data/collector.js";
import { generateHtmlReport } from "@benchmarks-reporting/generateHtml.js";
import { createSpinner, logWarning } from "@benchmarks-utils/console.js";
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
    { name: "utensils", file: "viteTest/Benchmarks/tests/filterByUstensils.test.js" },
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
  try {
    const chartsSpinner = createSpinner("Generating charts...");
    let chartsResult = {};
    try {
      chartsResult = await generateCharts(results);
      if (Object.keys(chartsResult).length === 0) {
        chartsSpinner.warn("No charts generated - no data available");
        logWarning("No charts generated - no data available");
      } else {
        chartsSpinner.succeed(`Generated ${Object.keys(chartsResult).length} chart(s)`);
      }
    } catch (error) {
      chartsSpinner.fail("Failed to generate charts");
      logWarning(`Chart generation error: ${error.message}`);
      console.error(chalk.red(`Chart generation error: ${error.message}`));
      console.error(error.stack);
      // Continue with empty charts
    }

    const htmlSpinner = createSpinner("Generating HTML report...");
    let html;
    try {
      html = await generateHTMLReport(results, chartsResult);
      htmlSpinner.succeed("Generated HTML report");
    } catch (error) {
      htmlSpinner.fail("Failed to generate HTML report");
      console.error(chalk.red(`HTML generation error: ${error.message}`));
      console.error(error.stack);
      throw error;
    }

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
  } catch (error) {
    console.error(chalk.red(`\n❌ Error in generateAndSaveReport: ${error.message}`));
    console.error(error.stack);
    throw error;
  }
}

// Generate HTML report using the enhanced HTML generator
async function generateHTMLReport(results, charts) {
  return await generateHtmlReport(results, charts);
}

export { collectBenchmarkResults, displayHeader, initializeBenchmark, getTestsToRun, generateAndSaveReport, generateHTMLReport };
