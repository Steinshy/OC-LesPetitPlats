// Formatting utilities for benchmark results
import { formatTime } from "./formatMeasurement.js";

export function formatBenchmarkResults(stats, name) {
  // Standard deviation
  const stdDev = Number.isNaN(stats.stdDev) || stats.stdDev === undefined ? 0 : stats.stdDev;
  return `
${name}:
  Average: ${formatTime(stats.avg)}
  Min: ${formatTime(stats.min)}
  Max: ${formatTime(stats.max)}
  Std Dev: ${formatTime(stdDev)}
  Ops/sec: ${stats.opsPerSecond.toFixed(2)}
`;
}

export function createComparisonRow(comparison) {
  return [
    comparison.result1.name,
    formatTime(comparison.result1.avg),
    formatTime(comparison.result1.min),
    formatTime(comparison.result1.max),
    comparison.result1.opsPerSecond.toFixed(2),
  ];
}
