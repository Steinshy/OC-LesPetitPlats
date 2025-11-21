// Console logging utilities for benchmark tests
import chalk from "chalk";
import { PRODUCTION_LABEL, MAPS_LABEL } from "../constants.js";
import { getAllResults } from "../data/collector.js";
import { formatTestCaseResult, formatSummarySection } from "../formatting/formatConsole.js";
import { formatMemory } from "../formatting/formatMeasurement.js";
import {
  logSection as modernLogSection,
  logSuccess as modernLogSuccess,
  logWarning as modernLogWarning,
  logInfo as modernLogInfo,
  logBenchmarkResult,
  logComparison as modernLogComparison,
  logStep as modernLogStep,
  logCategorySummary as modernLogCategorySummary,
  logMemory as modernLogMemory,
  createSpinner,
  createProgressBar,
  updateProgress,
  stopProgress,
} from "./modernConsole.js";

// Constants
const SEPARATOR_WIDTH = 60;
const SEPARATOR = "=".repeat(SEPARATOR_WIDTH);

// Helper functions
function logSeparator() {
  console.log(`\n${SEPARATOR}`);
}


// Benchmark logging functions
export function logSection(title) {
  modernLogSection(title);
}

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

  modernLogComparison(
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
  modernLogMemory(PRODUCTION_LABEL, productionMemory);
  modernLogMemory(MAPS_LABEL, mapsMemory);
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

export function logStep(stepNumber, message, status = "pending") {
  modernLogStep(stepNumber, message, status);
}

export function logCollectingResults(stepNumber) {
  logStep(stepNumber, "Collecting benchmark results...");
}

export function logNoResultsWarning() {
  modernLogWarning("No benchmark results found.");
  modernLogInfo("Tests need to be modified to use addBenchmarkResult() from results.js");
  modernLogInfo("For now, generating report with empty data structure...\n");
}

export function logRunningTest(stepNumber, testName) {
  logStep(stepNumber, `Running ${testName} Benchmark Tests...`);
}

export function logGeneratingCharts(stepNumber) {
  logStep(stepNumber, "Generating charts...");
}

export function logNoChartsWarning() {
  modernLogWarning("No charts generated - no data available");
}

export function logGeneratingHTML(stepNumber) {
  logStep(stepNumber, "Generating HTML report...");
}

export function logFileSaved(fileType, path) {
  modernLogSuccess(`${fileType} saved to: ${path}`);
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
  modernLogWarning("Skipping PDF generation - no charts available");
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

  modernLogCategorySummary(allLabel, {
    testCount: categoryTests.length,
    winner,
    wins: winner === PRODUCTION_LABEL ? productionWins : mapsWins,
    avgTime: winner === PRODUCTION_LABEL ? productionAvg : mapsAvg,
    improvement,
  });
}

// Export modern console utilities
export { createSpinner, createProgressBar, updateProgress, stopProgress };
