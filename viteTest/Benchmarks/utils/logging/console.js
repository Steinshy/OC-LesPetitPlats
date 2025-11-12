// Console logging utilities for benchmark tests
import { formatBenchmarkResults } from "../formatting/formatBenchmarkResults.js";
import { formatMemory, formatTime } from "../formatting/formatMeasurement.js";
import {
  formatTestCaseResult,
  formatSummarySection,
} from "../formatting/formatConsole.js";

export function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

export function logBenchmarkComparison(functionalStats, nativeStats, comparison) {
  // Functional implementation label
  const functionalLabel = comparison.result1.name || "Functional";
  // Native implementation label
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
  console.log(
    `Functional Programming (using filter/every/some/includes): ${formatMemory(functionalMemory)}`,
  );
  console.log(`Native Loops (using for loops): ${formatMemory(nativeMemory)}`);
}

export function logMemoryUsage(label, functionalMemory, nativeMemory) {
  console.log(
    `${label} - Functional Programming (using filter/every/some/includes): ${formatMemory(functionalMemory)}`,
  );
  console.log(`${label} - Native Loops (using for loops): ${formatMemory(nativeMemory)}`);
}

export function logReportHeader(title, width = 60) {
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
