/**
 * Benchmark utility functions for measuring performance metrics.
 */

/**
 * Measures execution time using high-resolution timer
 * @param {Function} fn - Function to measure
 * @returns {number} Execution time in milliseconds
 */
export function measureTime(fn) {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
}

/**
 * Calculates operations per second
 * @param {number} timeMs - Time in milliseconds
 * @param {number} iterations - Number of iterations
 * @returns {number} Operations per second
 */
export function calculateOpsPerSecond(timeMs, iterations) {
  if (timeMs === 0) {
    return Infinity;
  }
  return (iterations / timeMs) * 1000;
}

/**
 * Measures memory usage delta
 * @param {Function} fn - Function to measure
 * @returns {number} Memory delta in MB (approximate)
 */
export function measureMemoryDelta(fn) {
  if (typeof performance.memory === "undefined") {
    // Node.js doesn't have performance.memory, return 0
    return 0;
  }

  const before = performance.memory.usedJSHeapSize;
  fn();
  const after = performance.memory.usedJSHeapSize;
  return (after - before) / 1024 / 1024; // Convert to MB
}

/**
 * Runs a function multiple times and collects statistics
 * @param {Function} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 * @returns {Object} Statistics object
 */
export function runBenchmark(fn, iterations = 100) {
  const times = [];
  let totalTime = 0;

  // Warm-up run
  fn();

  // Measure multiple iterations
  for (let i = 0; i < iterations; i++) {
    const time = measureTime(fn);
    times.push(time);
    totalTime += time;
  }

  // Calculate statistics
  const avg = totalTime / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);

  // Calculate standard deviation
  const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / iterations;
  const stdDev = Math.sqrt(variance);

  // Calculate operations per second
  const opsPerSecond = calculateOpsPerSecond(avg, 1);

  return {
    avg,
    min,
    max,
    stdDev,
    opsPerSecond,
    times,
  };
}

/**
 * Measures memory usage for a function
 * @param {Function} fn - Function to measure
 * @param {number} iterations - Number of iterations
 * @returns {number} Average memory delta in MB
 */
export function measureMemoryUsage(fn, iterations = 10) {
  if (typeof performance.memory === "undefined") {
    return 0;
  }

  let totalDelta = 0;
  for (let i = 0; i < iterations; i++) {
    totalDelta += measureMemoryDelta(fn);
  }

  return totalDelta / iterations;
}

/**
 * Formats time in milliseconds to readable string
 * @param {number} timeMs - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(timeMs) {
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
export function compareResults(result1, result2, name1 = "Implementation 1", name2 = "Implementation 2") {
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
 * Formats benchmark results for console output
 * @param {Object} stats - Statistics object from runBenchmark
 * @param {string} name - Name of the benchmark
 * @returns {string} Formatted string
 */
export function formatBenchmarkResults(stats, name) {
  return `
${name}:
  Average: ${formatTime(stats.avg)}
  Min: ${formatTime(stats.min)}
  Max: ${formatTime(stats.max)}
  Std Dev: ${formatTime(stats.stdDev)}
  Ops/sec: ${stats.opsPerSecond.toFixed(2)}
`;
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
