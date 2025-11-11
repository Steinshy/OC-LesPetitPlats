/**
 * Formatting and comparison utilities for benchmark results.
 */

/**
 * Formats time in milliseconds to readable string
 * @param {number} timeMs - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(timeMs) {
  if (timeMs < 0.001) {
    // For very small values, show in nanoseconds with more precision
    const ns = timeMs * 1_000_000;
    if (ns < 0.01) {
      return `${ns.toFixed(4)} ns`;
    }
    return `${ns.toFixed(2)} ns`;
  }
  if (timeMs < 1) {
    return `${(timeMs * 1000).toFixed(2)} µs`;
  }
  if (timeMs < 1000) {
    return `${timeMs.toFixed(2)} ms`;
  }
  return `${(timeMs / 1000).toFixed(2)} s`;
}

/**
 * Formats memory in MB to readable string
 * @param {number} memoryMB - Memory in MB
 * @returns {string} Formatted memory string
 */
export function formatMemory(memoryMB) {
  if (Math.abs(memoryMB) < 0.001) {
    return "~0 MB";
  }
  return `${memoryMB >= 0 ? "+" : ""}${memoryMB.toFixed(3)} MB`;
}

/**
 * Formats benchmark results for console output
 * @param {Object} stats - Statistics object from runBenchmark
 * @param {string} name - Name of the benchmark
 * @returns {string} Formatted string
 */
export function formatBenchmarkResults(stats, name) {
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

/**
 * Calculates speed improvement percentage
 * @param {number} baselineTime - Baseline execution time
 * @param {number} comparisonTime - Comparison execution time
 * @returns {number} Improvement percentage (positive = faster, negative = slower)
 */
export function calculateImprovement(baselineTime, comparisonTime) {
  if (baselineTime === 0) {
    return comparisonTime === 0 ? 0 : -Infinity;
  }
  return ((baselineTime - comparisonTime) / baselineTime) * 100;
}

/**
 * Compares two benchmark results
 * @param {Object} result1 - First benchmark result
 * @param {Object} result2 - Second benchmark result
 * @param {string} name1 - Name of first implementation
 * @param {string} name2 - Name of second implementation
 * @returns {Object} Comparison object
 */
export function compareResults(
  result1,
  result2,
  name1 = "Implementation 1",
  name2 = "Implementation 2",
) {
  const improvement = calculateImprovement(result1.avg, result2.avg);
  const faster = result1.avg < result2.avg ? name1 : name2;
  const slower = result1.avg < result2.avg ? name2 : name1;

  return {
    faster,
    slower,
    improvement: Math.abs(improvement),
    isFaster: result1.avg < result2.avg,
    result1: {
      name: name1,
      ...result1,
    },
    result2: {
      name: name2,
      ...result2,
    },
  };
}

/**
 * Creates a comparison table row
 * @param {Object} comparison - Comparison object from compareResults
 * @returns {Array} Table row data
 */
export function createComparisonRow(comparison) {
  return [
    comparison.result1.name,
    formatTime(comparison.result1.avg),
    formatTime(comparison.result1.min),
    formatTime(comparison.result1.max),
    comparison.result1.opsPerSecond.toFixed(2),
  ];
}
