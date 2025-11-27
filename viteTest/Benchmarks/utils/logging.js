// Console logging utilities for benchmark tests
import chalk from "chalk";
import cliProgress from "cli-progress";
import ora from "ora";
import { PRODUCTION_LABEL, MAPS_LABEL } from "@benchmarks-config/constants.js";
import { getAllResults } from "@benchmarks-data/collector.js";
import { formatTestCaseResult, formatSummarySection } from "@benchmarks-utils/formatting.js";

// Constants
const SEPARATOR_WIDTH = 60;
const SEPARATOR = "=".repeat(SEPARATOR_WIDTH);

// Helper functions
function logSeparator() {
  console.log(`\n${SEPARATOR}`);
}


// Benchmark logging functions (logSection is defined later in the file)

export function logBenchmarkComparison(productionStats, mapsStats, comparison) {
  const productionLabel = comparison.result1.name || PRODUCTION_LABEL;
  const mapsLabel = comparison.result2.name || MAPS_LABEL;

  const prodTime = productionStats.avg || productionStats.mean || 0;
  const mapsTime = mapsStats.avg || mapsStats.mean || 0;
  const isProductionWinner = prodTime < mapsTime;

  // More explicit output with additional stats
  console.log(chalk.dim("  Execution Times:"));
  logBenchmarkResult(productionLabel, prodTime, "ms", isProductionWinner);
  logBenchmarkResult(mapsLabel, mapsTime, "ms", !isProductionWinner);

  // Show min/max ranges for context
  const prodMin = productionStats.min || 0;
  const prodMax = productionStats.max || 0;
  const mapsMin = mapsStats.min || 0;
  const mapsMax = mapsStats.max || 0;

  if (prodMin > 0 || mapsMin > 0) {
    console.log(chalk.dim("  Range:"));
    console.log(`    ${productionLabel}: ${prodMin.toFixed(4)}ms - ${prodMax.toFixed(4)}ms`);
    console.log(`    ${mapsLabel}: ${mapsMin.toFixed(4)}ms - ${mapsMax.toFixed(4)}ms`);
  }

  logComparison(
    comparison.faster,
    comparison.improvement,
    comparison.faster,
    comparison.slower || mapsLabel,
  );
}

export function logBenchmarkSection(
  title,
  productionStats,
  mapsStats,
  comparison,
  category = null,
) {
  // Extract category from title if not provided, or use provided category
  let categoryLabel = category;
  if (!categoryLabel) {
    // Try to infer from context or use generic
    categoryLabel = "Benchmark";
  }

  logSection(`${categoryLabel} - ${title}`);
  console.log(chalk.dim(`  Benchmarking: ${categoryLabel} - ${title}`));
  logBenchmarkComparison(productionStats, mapsStats, comparison);
}

export function logMemoryComparison(title, productionMemory, mapsMemory) {
  logSection(title);
  logMemory(PRODUCTION_LABEL, productionMemory);
  logMemory(MAPS_LABEL, mapsMemory);
}


export function logRecommendations(winner, message) {
  console.log("\nRECOMMENDATIONS:");
  console.log(`✓ ${winner}`);
  console.log(`  ${message}`);
}

export function logTestCaseResult(testCaseName, productionStats, mapsStats, comparison) {
  const { consoleOutput, reportContent } = formatTestCaseResult(
    testCaseName,
    productionStats,
    mapsStats,
    comparison,
  );
  console.log(consoleOutput);
  return reportContent;
}

export function logSummarySection(results) {
  const { output, overallWinner, productionWins, mapsWins } = formatSummarySection(results);
  console.log(output);
  return { overallWinner, productionWins, mapsWins, reportContent: output };
}

// Report generation logging functions
export function logReportGenerationHeader() {
  console.log(SEPARATOR);
  console.log("GENERATING BENCHMARK REPORT");
  console.log(SEPARATOR);
}

// logStep is defined later in the file (modern console utilities section)

export function logCollectingResults(stepNumber) {
  logStep(stepNumber, "Collecting benchmark results...");
}

export function logNoResultsWarning() {
  logWarning("No benchmark results found.");
  logInfo("Tests need to be modified to use addBenchmarkResult() from results.js");
  logInfo("For now, generating report with empty data structure...\n");
}

export function logRunningTest(stepNumber, testName) {
  logStep(stepNumber, `Running ${testName} Benchmark Tests...`);
}

export function logGeneratingCharts(stepNumber) {
  logStep(stepNumber, "Generating charts...");
}

export function logNoChartsWarning() {
  logWarning("No charts generated - no data available");
}

export function logGeneratingHTML(stepNumber) {
  logStep(stepNumber, "Generating HTML report...");
}

export function logFileSaved(fileType, path) {
  logSuccess(`${fileType} saved to: ${path}`);
}

export function logHTMLReportSaved(path) {
  logFileSaved("HTML Report", path);
}

export function logCSSFileSaved(path) {
  logFileSaved("CSS file", path);
}

export function logConvertingToPDF(stepNumber) {
  logStep(stepNumber, "Converting to PDF...");
}

export function logPDFReportSaved(path) {
  logFileSaved("PDF Report", path);
}

export function logSkippingPDFWarning() {
  logWarning("Skipping PDF generation - no charts available");
}

export function logReportCompleted(htmlPath, pdfPath) {
  logSeparator();
  console.log("REPORT GENERATION COMPLETED");
  console.log(SEPARATOR);
  console.log(`\n✓ HTML Report: ${htmlPath}`);
  if (pdfPath) {
    console.log(`✓ PDF Report: ${pdfPath}`);
  }
}

export function logNoTestFilesError(allTests) {
  console.error("No matching test files found. Available tests:");
  allTests.forEach(test => console.error(`  - ${test.file}`));
}

export function logReportError(error) {
  console.error("Error generating benchmark report:", error.message);
}

export function logClearingDirectory() {
  console.log("Clearing Benchmark directory...");
}

export function logCategorySummary(category, categoryLabel, allLabel) {
  const allResults = getAllResults();

  if (!allResults[category] || allResults[category].length === 0) {
    return;
  }

  const categoryTests = allResults[category];

  // Calculate averages for each implementation
  let productionTotal = 0;
  let mapsTotal = 0;
  let productionCount = 0;
  let mapsCount = 0;
  let productionWins = 0;
  let mapsWins = 0;

  categoryTests.forEach(result => {
    if (result.functionalStats) {
      const prodTime = result.functionalStats.avg || result.functionalStats.mean || 0;
      productionTotal += prodTime;
      productionCount++;
    }
    if (result.loopStats) {
      const mapsTime = result.loopStats.avg || result.loopStats.mean || 0;
      mapsTotal += mapsTime;
      mapsCount++;
    }

    // Count wins
    if (result.comparison) {
      const winner = result.comparison.faster || "";
      if (winner.includes("Production") || winner.includes(PRODUCTION_LABEL)) {
        productionWins++;
      } else if (winner.includes("Maps") || winner.includes(MAPS_LABEL)) {
        mapsWins++;
      }
    }
  });

  const productionAvg = productionCount > 0 ? productionTotal / productionCount : 0;
  const mapsAvg = mapsCount > 0 ? mapsTotal / mapsCount : 0;
  const winner = productionAvg < mapsAvg ? PRODUCTION_LABEL : MAPS_LABEL;
  const improvement =
    productionAvg > 0 && mapsAvg > 0
      ? ((Math.max(productionAvg, mapsAvg) - Math.min(productionAvg, mapsAvg)) /
          Math.max(productionAvg, mapsAvg)) *
        100
      : 0;

  // Call the internal logCategorySummary helper function (defined later in the file)
  _logCategorySummaryInternal(allLabel, {
    testCount: categoryTests.length,
    winner,
    wins: winner === PRODUCTION_LABEL ? productionWins : mapsWins,
    avgTime: winner === PRODUCTION_LABEL ? productionAvg : mapsAvg,
    improvement,
  });
}

// Modern console logging utilities with progress bars, colors, and spinners

// Color scheme
const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  dim: chalk.dim,
  bold: chalk.bold,
  cyan: chalk.cyan,
  magenta: chalk.magenta,
};

// Progress bar instance
let progressBar = null;

export function createProgressBar(total, label = "Progress") {
  if (progressBar) {
    progressBar.stop();
  }

  progressBar = new cliProgress.SingleBar(
    {
      format: `${colors.cyan(label)} |${chalk.cyan("{bar}")}| ${chalk.bold("{percentage}%")} | {value}/{total} | ETA: {eta}s`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
      clearOnComplete: true,
    },
    cliProgress.Presets.shades_classic,
  );

  progressBar.start(total, 0);
  return progressBar;
}

export function updateProgress(value) {
  if (progressBar) {
    progressBar.update(value);
  }
}

export function stopProgress() {
  if (progressBar) {
    progressBar.stop();
    progressBar = null;
  }
}

export function createSpinner(text) {
  return ora({
    text: colors.cyan(text),
    spinner: "dots",
  }).start();
}

export function logSuccess(message, icon = "✓") {
  console.log(colors.success(`${icon} ${message}`));
}


export function logWarning(message, icon = "⚠") {
  console.log(colors.warning(`${icon} ${message}`));
}

export function logInfo(message, icon = "ℹ") {
  console.log(colors.info(`${icon} ${message}`));
}

export function logSection(title, emoji = "📊") {
  console.log(`\n${colors.bold(colors.cyan(`${emoji} ${title}`))}`);
  console.log(colors.dim("─".repeat(60)));
}

function logBenchmarkResult(label, value, unit = "ms", isWinner = false) {
  const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
  const color = isWinner ? colors.success : colors.dim;
  console.log(`  ${color(label.padEnd(20))} ${colors.bold(formattedValue)}${unit}`);
}

function logComparison(winner, improvement, faster, slower) {
  console.log(`\n${colors.bold("Comparison:")}`);
  console.log(`  ${colors.success("Winner:")} ${colors.bold(winner)}`);
  console.log(
    `  ${colors.info("Improvement:")} ${colors.bold(improvement.toFixed(2))}% faster than ${slower}`,
  );
  console.log(`  ${colors.dim(`${faster} vs ${slower}`)}`);
}

export function logHeader(title, width = 60) {
  const border = "═".repeat(width);
  console.log(`\n${colors.bold(colors.cyan(border))}`);
  console.log(colors.bold(colors.cyan(title.padStart((width + title.length) / 2))));
  console.log(colors.bold(colors.cyan(border)));
}

export function logStep(stepNumber, message, status = "pending") {
  const icons = {
    pending: "○",
    running: "⟳",
    success: "✓",
    error: "✗",
  };
  const colors_map = {
    pending: colors.dim,
    running: colors.cyan,
    success: colors.success,
    error: colors.error,
  };

  const icon = icons[status] || icons.pending;
  const color = colors_map[status] || colors_map.pending;
  console.log(`\n${color(`${icon} [${stepNumber}]`)} ${message}`);
}

function _logCategorySummaryInternal(category, stats) {
  logSection(`${category} Summary`, "📈");
  console.log(`  ${colors.bold("Tests:")} ${stats.testCount}`);
  console.log(
    `  ${colors.bold("Winner:")} ${colors.success(stats.winner)} (${stats.wins}/${stats.testCount} wins)`,
  );
  console.log(`  ${colors.bold("Avg Time:")} ${stats.avgTime.toFixed(4)}ms`);
  if (stats.improvement) {
    console.log(
      `  ${colors.bold("Improvement:")} ${colors.success(stats.improvement.toFixed(2))}%`,
    );
  }
}


function logMemory(label, value, unit = "MB") {
  console.log(`  ${colors.dim(label.padEnd(20))} ${colors.bold(value.toFixed(2))}${unit}`);
}

function _clearLine() {
  process.stdout.write("\r\x1b[K");
}
