// Formatting utilities for console output
import { PRODUCTION_LABEL, MAPS_LABEL } from "../constants.js";
import { logRecommendations } from "../logging/console.js";
import { formatTime } from "./formatMeasurement.js";

// Constants
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

export function formatTestCaseResult(testCaseName, productionStats, mapsStats, comparison) {
  const testResult = `\n${testCaseName}:\n`;
  const productionLine = formatStatsLine(PRODUCTION_LABEL, productionStats.avg);
  const mapsLine = formatStatsLine(MAPS_LABEL, mapsStats.avg);
  const winnerLine = `  Winner: ${comparison.faster} (${comparison.improvement.toFixed(2)}% faster)\n`;
  const productionDetails = formatStatsDetails(PRODUCTION_LABEL, productionStats);
  const mapsDetails = formatStatsDetails(MAPS_LABEL, mapsStats);

  const summary = testResult + productionLine + mapsLine + winnerLine;
  const consoleOutput = summary;
  const reportContent = summary + productionDetails + mapsDetails;

  return { consoleOutput, reportContent };
}

export function formatSummarySection(results) {
  const winnerNames = results.map(r => r.winner);
  const productionWins = winnerNames.filter(winner => winner.includes("Production")).length;
  const mapsWins = winnerNames.filter(winner => winner.includes("Maps")).length;
  const overallWinner = productionWins > mapsWins ? PRODUCTION_LABEL : MAPS_LABEL;

  const summarySection = formatSeparator(true);
  const overallWinnerLine = `OVERALL WINNER: ${overallWinner}\n`;
  const productionWinsLine = `${PRODUCTION_LABEL} wins: ${productionWins}/${results.length}\n`;
  const mapsWinsLine = `${MAPS_LABEL} wins: ${mapsWins}/${results.length}\n`;
  const separator = formatSeparator();

  const output = `${summarySection}${overallWinnerLine}${productionWinsLine}${mapsWinsLine}${separator}`;

  return { output, overallWinner, productionWins, mapsWins };
}

export function formatRecommendations(overallWinner) {
  const isMapsWinner = overallWinner.includes("Maps");
  const winner = isMapsWinner
    ? "Map-based implementation (using map/filter) is faster overall"
    : "Production implementation (using forEach) is faster overall";
  const message = isMapsWinner
    ? "Consider using map/filter methods for better performance"
    : "Consider using forEach-based implementation for better performance";

  const recommendations = `\nRECOMMENDATIONS:\n✓ ${winner}\n  ${message}\n`;
  logRecommendations(winner, message);
  return recommendations;
}
