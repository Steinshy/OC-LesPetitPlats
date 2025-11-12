// Formatting utilities for benchmark results
import { formatTime } from "./formatMeasurement.js";

// Constants
const OPS_PRECISION = 2;

// Helper functions
function getStdDev(stats) {
  return Number.isNaN(stats.stdDev) || stats.stdDev === undefined ? 0 : stats.stdDev;
}

export function formatBenchmarkResults(stats, name) {
  const stdDev = getStdDev(stats);
  return `
${name}:
  Average: ${formatTime(stats.avg)}
  Min: ${formatTime(stats.min)}
  Max: ${formatTime(stats.max)}
  Std Dev: ${formatTime(stdDev)}
  Ops/sec: ${stats.opsPerSecond.toFixed(OPS_PRECISION)}
`;
}

export function createComparisonRow(comparison) {
  return [
    comparison.result1.name,
    formatTime(comparison.result1.avg),
    formatTime(comparison.result1.min),
    formatTime(comparison.result1.max),
    comparison.result1.opsPerSecond.toFixed(OPS_PRECISION),
  ];
}
