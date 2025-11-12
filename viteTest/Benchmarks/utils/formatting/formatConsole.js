// Formatting utilities for console output
import { logRecommendations } from "../logging/console.js";
import { formatTime } from "./formatMeasurement.js";

// Constants
const FUNCTIONAL_LABEL = "Functional Programming (using filter/every/some/includes)";
const NATIVE_LABEL = "Native Loops (using for loops)";
const SEPARATOR_WIDTH = 60;
const SEPARATOR = "=".repeat(SEPARATOR_WIDTH);

// Helper functions
function formatSeparator(withNewline = false) {
  return `${withNewline ? "\n" : ""}${SEPARATOR}\n`;
}

function formatStatsDetails(label, stats) {
  return `  ${label} Details:\n    Average: ${formatTime(stats.avg)}\n    Min: ${formatTime(stats.min)}\n    Max: ${formatTime(stats.max)}\n    Std Dev: ${formatTime(stats.stdDev)}\n    Ops/sec: ${stats.opsPerSecond.toFixed(2)}\n`;
}

function formatStatsLine(label, avgTime) {
  return `  ${label}: ${formatTime(avgTime)}\n`;
}

export function formatReportHeader() {
  const header = formatSeparator();
  const title = "COMPREHENSIVE BENCHMARK SUMMARY REPORT\n";
  const separator = formatSeparator(true);
  const timestamp = `Generated: ${new Date().toISOString()}\n\n`;
  return header + title + separator + timestamp;
}

export function formatTestCaseResult(testCaseName, functionalStats, nativeStats, comparison) {
  const testResult = `\n${testCaseName}:\n`;
  const functionalLine = formatStatsLine(FUNCTIONAL_LABEL, functionalStats.avg);
  const nativeLine = formatStatsLine(NATIVE_LABEL, nativeStats.avg);
  const winnerLine = `  Winner: ${comparison.faster} (${comparison.improvement.toFixed(2)}% faster)\n`;
  const functionalDetails = formatStatsDetails(FUNCTIONAL_LABEL, functionalStats);
  const nativeDetails = formatStatsDetails(NATIVE_LABEL, nativeStats);

  const summary = testResult + functionalLine + nativeLine + winnerLine;
  const consoleOutput = summary;
  const reportContent = summary + functionalDetails + nativeDetails;

  return { consoleOutput, reportContent };
}

export function formatSummarySection(results) {
  const winnerNames = results.map(r => r.winner);
  const functionalWins = winnerNames.filter(winner =>
    winner.includes("Functional Programming"),
  ).length;
  const nativeWins = winnerNames.filter(winner => winner.includes("Native Loops")).length;
  const overallWinner = functionalWins > nativeWins ? FUNCTIONAL_LABEL : NATIVE_LABEL;

  const summarySection = formatSeparator(true);
  const overallWinnerLine = `OVERALL WINNER: ${overallWinner}\n`;
  const functionalWinsLine = `${FUNCTIONAL_LABEL} wins: ${functionalWins}/${results.length}\n`;
  const nativeWinsLine = `${NATIVE_LABEL} wins: ${nativeWins}/${results.length}\n`;
  const separator = formatSeparator();

  const output = `${summarySection}${overallWinnerLine}${functionalWinsLine}${nativeWinsLine}${separator}`;

  return { output, overallWinner, functionalWins, nativeWins };
}

export function formatRecommendations(overallWinner) {
  const isNativeWinner = overallWinner.includes("Native Loops");
  const winner = isNativeWinner
    ? "Native loop implementation (using for loops) is faster overall"
    : "Functional programming implementation (using filter/every/some/includes) is faster overall";
  const message = isNativeWinner
    ? "Consider using native loops for better performance"
    : "Consider using functional methods for better readability";

  const recommendations = `\nRECOMMENDATIONS:\n✓ ${winner}\n  ${message}\n`;
  logRecommendations(winner, message);
  return recommendations;
}
