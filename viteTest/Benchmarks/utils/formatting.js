// Formatting utilities for console output
import numeral from "numeral";
import { PRODUCTION_LABEL, MAPS_LABEL } from "@benchmarks-config/constants.js";

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

// Time formatting constants
const NS_THRESHOLD = 0.001;
const NS_PRECISION_THRESHOLD = 0.01;
const US_THRESHOLD = 1;
const MS_THRESHOLD = 1000;
const NS_MULTIPLIER = 1_000_000;
const US_MULTIPLIER = 1000;
const S_DIVISOR = 1000;

// Memory formatting constants
const MEMORY_THRESHOLD = 0.001;

export function formatTime(timeMs) {
  if (timeMs < NS_THRESHOLD) {
    const ns = timeMs * NS_MULTIPLIER;
    const precision = ns < NS_PRECISION_THRESHOLD ? 4 : 2;
    return `${numeral(ns).format(`0.${"0".repeat(precision)}`)} ns`;
  }
  if (timeMs < US_THRESHOLD) {
    return `${numeral(timeMs * US_MULTIPLIER).format("0.00")} µs`;
  }
  if (timeMs < MS_THRESHOLD) {
    return `${numeral(timeMs).format("0.00")} ms`;
  }
  return `${numeral(timeMs / S_DIVISOR).format("0.00")} s`;
}

export function formatMemory(memoryMB) {
  if (Math.abs(memoryMB) < MEMORY_THRESHOLD) {
    return "~0 MB";
  }
  const sign = memoryMB >= 0 ? "+" : "";
  return `${sign}${numeral(memoryMB).format("0.000")} MB`;
}
