// Console logging utilities for benchmark tests
import { formatBenchmarkResults } from "../formatting/formatBenchmarkResults.js";
import { formatTestCaseResult, formatSummarySection } from "../formatting/formatConsole.js";
import { formatMemory } from "../formatting/formatMeasurement.js";

// Constants
const FUNCTIONAL_LABEL = "Functional Programming (using filter/every/some/includes)";
const NATIVE_LABEL = "Native Loops (using for loops)";
const SEPARATOR_WIDTH = 60;
const SEPARATOR = "=".repeat(SEPARATOR_WIDTH);

// Helper functions
function logSeparator() {
  console.log(`\n${SEPARATOR}`);
}

function logMemoryLine(label, memory, prefix = "") {
  const formatted = formatMemory(memory);
  console.log(prefix ? `${prefix} - ${label}: ${formatted}` : `${label}: ${formatted}`);
}

// Benchmark logging functions
export function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

export function logBenchmarkComparison(functionalStats, nativeStats, comparison) {
  const functionalLabel = comparison.result1.name || "Functional";
  const nativeLabel = comparison.result2.name || "Native";
  console.log(formatBenchmarkResults(functionalStats, functionalLabel));
  console.log(formatBenchmarkResults(nativeStats, nativeLabel));
  console.log(`\nWinner: ${comparison.faster}`);
  console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);
}

export function logBenchmarkSection(title, functionalStats, nativeStats, comparison) {
  logSection(title);
  logBenchmarkComparison(functionalStats, nativeStats, comparison);
}

export function logMemoryComparison(title, functionalMemory, nativeMemory) {
  logSection(title);
  logMemoryLine(FUNCTIONAL_LABEL, functionalMemory);
  logMemoryLine(NATIVE_LABEL, nativeMemory);
}

/**
 * Logs all implementations with their performance stats
 * @param {Object} allStats - Stats object from runAllBenchmarks
 * @param {Object} labels - Implementation labels object
 */
export function logAllImplementations(allStats, labels) {
  console.log("\nAll Implementations:");
  console.log(`  ${labels.MAPS}: ${allStats.mapsStats.avg.toFixed(2)}ms`);
  console.log(`  ${labels.LOOPS}: ${allStats.loopsStats.avg.toFixed(2)}ms`);
  console.log(`  ${labels.FOREACH}: ${allStats.forEachStats.avg.toFixed(2)}ms`);
  console.log(`  ${labels.REDUCE}: ${allStats.reduceStats.avg.toFixed(2)}ms`);
  console.log(`  ${labels.FOR}: ${allStats.forStats.avg.toFixed(2)}ms`);
  console.log(`  ${labels.WHILE}: ${allStats.whileStats.avg.toFixed(2)}ms`);
}

/**
 * Logs all memory usages for all implementations
 * @param {Object} memoryUsages - Object with memory usage for each implementation
 * @param {Object} labels - Implementation labels object
 */
export function logAllMemoryUsages(memoryUsages, labels) {
  console.log("\nAll Memory Usages:");
  console.log(`  ${labels.MAPS}: ${memoryUsages.maps.toFixed(2)}MB`);
  console.log(`  ${labels.LOOPS}: ${memoryUsages.loops.toFixed(2)}MB`);
  console.log(`  ${labels.FOREACH}: ${memoryUsages.forEach.toFixed(2)}MB`);
  console.log(`  ${labels.REDUCE}: ${memoryUsages.reduce.toFixed(2)}MB`);
  console.log(`  ${labels.FOR}: ${memoryUsages.for.toFixed(2)}MB`);
  console.log(`  ${labels.WHILE}: ${memoryUsages.while.toFixed(2)}MB`);
}

export function logMemoryUsage(label, functionalMemory, nativeMemory) {
  logMemoryLine(FUNCTIONAL_LABEL, functionalMemory, label);
  logMemoryLine(NATIVE_LABEL, nativeMemory, label);
}

export function logReportHeader(title, width = SEPARATOR_WIDTH) {
  console.log(`\n${"=".repeat(width)}`);
  console.log(title);
  console.log("=".repeat(width));
}

export function logSuccess(message) {
  console.log(`\n✓ ${message}`);
}

export function logRecommendations(winner, message) {
  console.log("\nRECOMMENDATIONS:");
  console.log(`✓ ${winner}`);
  console.log(`  ${message}`);
}

export function logTestCaseResult(testCaseName, functionalStats, nativeStats, comparison) {
  const { consoleOutput, reportContent } = formatTestCaseResult(
    testCaseName,
    functionalStats,
    nativeStats,
    comparison,
  );
  console.log(consoleOutput);
  return reportContent;
}

export function logSummarySection(results) {
  const { output, overallWinner, functionalWins, nativeWins } = formatSummarySection(results);
  console.log(output);
  return { overallWinner, functionalWins, nativeWins, reportContent: output };
}

// Report generation logging functions
export function logReportGenerationHeader() {
  console.log(SEPARATOR);
  console.log("GENERATING BENCHMARK REPORT");
  console.log(SEPARATOR);
}

export function logStep(stepNumber, message) {
  console.log(`\n${stepNumber}. ${message}`);
}

export function logCollectingResults(stepNumber) {
  logStep(stepNumber, "Collecting benchmark results...");
}

export function logNoResultsWarning() {
  console.warn("\n⚠ Warning: No benchmark results found.");
  console.warn("Tests need to be modified to use addBenchmarkResult() from results.js");
  console.warn("For now, generating report with empty data structure...\n");
}

export function logRunningTest(stepNumber, testName) {
  logStep(stepNumber, `Running ${testName} Benchmark Tests...`);
}

export function logGeneratingCharts(stepNumber) {
  logStep(stepNumber, "Generating charts...");
}

export function logNoChartsWarning() {
  console.warn("⚠ No charts generated - no data available");
}

export function logGeneratingHTML(stepNumber) {
  logStep(stepNumber, "Generating HTML report...");
}

export function logFileSaved(fileType, path) {
  console.log(`✓ ${fileType} saved to: ${path}`);
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
  console.warn("⚠ Skipping PDF generation - no charts available");
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
