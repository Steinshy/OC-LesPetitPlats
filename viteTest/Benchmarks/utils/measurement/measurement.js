// Core measurement and calculation functions for benchmarking using tinybench
import { Bench } from "tinybench";

// Constants
const NS_TO_MS_DIVISOR = 1_000_000;
const MS_TO_SECONDS_DIVISOR = 1000;
const BYTES_TO_MB_DIVISOR = 1024 * 1024;
const DEFAULT_ITERATIONS = 100;
const DEFAULT_MEMORY_ITERATIONS = 10;
const BENCHMARK_TIME = 75;
const MAX_ITERATIONS = 25;
const WARMUP_TIME = 15;
const WARMUP_ITERATIONS = 2;

// Calculation functions
export function calculateOpsPerSecond(timeMs) {
  return timeMs === 0 ? Infinity : MS_TO_SECONDS_DIVISOR / timeMs;
}

export function calculateImprovement(baselineTime, comparisonTime) {
  if (baselineTime === 0) {
    return comparisonTime === 0 ? 0 : -Infinity;
  }
  return ((baselineTime - comparisonTime) / baselineTime) * 100;
}

// Memory measurement functions
function hasMemoryAPI() {
  return typeof performance.memory !== "undefined";
}

export function measureMemoryDelta(fn) {
  if (!hasMemoryAPI()) {
    return 0;
  }
  const before = performance.memory.usedJSHeapSize;
  fn();
  const after = performance.memory.usedJSHeapSize;
  return (after - before) / BYTES_TO_MB_DIVISOR;
}

export function measureMemoryUsage(fn, iterations = DEFAULT_MEMORY_ITERATIONS) {
  if (!hasMemoryAPI()) {
    return 0;
  }
  let totalDelta = 0;
  for (let i = 0; i < iterations; i++) {
    totalDelta += measureMemoryDelta(fn);
  }
  return totalDelta / iterations;
}

// Benchmark execution functions
function convertTinybenchResult(result) {
  const convertToMs = value => value / NS_TO_MS_DIVISOR;
  const stdDev = Number.isNaN(result.stdDev) ? 0 : convertToMs(result.stdDev);
  const samples = result.samples?.length || 0;

  return {
    avg: convertToMs(result.mean),
    min: convertToMs(result.min),
    max: convertToMs(result.max),
    stdDev,
    opsPerSecond: calculateOpsPerSecond(convertToMs(result.mean)),
    samples,
    rme: result.rme || 0,
  };
}

export async function runBenchmark(fn, iterations = DEFAULT_ITERATIONS) {
  const bench = new Bench({
    time: BENCHMARK_TIME,
    iterations: Math.min(iterations, MAX_ITERATIONS),
    warmupTime: WARMUP_TIME,
    warmupIterations: WARMUP_ITERATIONS,
  });

  bench.add("benchmark", fn);
  await bench.run();

  const result = bench.results[0];
  if (!result) {
    throw new Error("Benchmark failed to produce results");
  }

  return convertTinybenchResult(result);
}
