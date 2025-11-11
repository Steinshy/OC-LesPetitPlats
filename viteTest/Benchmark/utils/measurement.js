/**
 * Core measurement functions for benchmarking performance using tinybench.
 */

import { Bench } from "tinybench";

/**
 * Calculates operations per second
 * @param {number} timeMs - Time in milliseconds
 * @returns {number} Operations per second
 */
export function calculateOpsPerSecond(timeMs) {
  if (timeMs === 0) {
    return Infinity;
  }
  return 1000 / timeMs;
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
 * Measures memory usage for a function
 * @param {Function} fn - Function to measure
 * @param {number} iterations - Number of iterations
 * @returns {number} Average memory delta in MB
 */
export function measureMemoryUsage(fn, iterations = 10) {
  if (typeof performance.memory === "undefined") {
    return 0;
  }

  // Use while loop for memory measurement
  let totalDelta = 0;
  let i = 0;
  while (i < iterations) {
    totalDelta += measureMemoryDelta(fn);
    i++;
  }

  return totalDelta / iterations;
}

/**
 * Converts tinybench result to our stats format
 * @param {Object} result - Tinybench result object
 * @returns {Object} Statistics object compatible with existing code
 */
function convertTinybenchResult(result) {
  // tinybench returns time in nanoseconds, convert to milliseconds
  const avg = result.mean / 1_000_000; // ns to ms
  const min = result.min / 1_000_000; // ns to ms
  const max = result.max / 1_000_000; // ns to ms
  // Handle NaN stdDev (can happen with very fast operations)
  const stdDev = Number.isNaN(result.stdDev) ? 0 : result.stdDev / 1_000_000; // ns to ms

  // Use reduce to calculate total samples if needed
  const sampleArray = result.samples || [];
  const totalSamples =
    sampleArray.reduce((sum, sample) => sum + 1, 0) || result.samples?.length || 0;

  return {
    avg,
    min,
    max,
    stdDev,
    opsPerSecond: calculateOpsPerSecond(avg),
    samples: totalSamples,
    rme: result.rme || 0, // Relative margin of error
  };
}

/**
 * Runs a function multiple times using tinybench and collects statistics
 * @param {Function} fn - Function to benchmark
 * @param {number} iterations - Number of iterations (tinybench uses this as time budget)
 * @returns {Promise<Object>} Statistics object
 */
export async function runBenchmark(fn, iterations = 100) {
  const bench = new Bench({
    time: 200, // Time budget in ms (tinybench will run as many iterations as possible)
    iterations: Math.min(iterations, 50), // Limit iterations to avoid timeouts
    warmupTime: 50, // Warmup time in ms
    warmupIterations: 5, // Warmup iterations
  });

  bench.add("benchmark", fn);

  await bench.run();

  const result = bench.results[0];
  if (!result) {
    throw new Error("Benchmark failed to produce results");
  }

  return convertTinybenchResult(result);
}
