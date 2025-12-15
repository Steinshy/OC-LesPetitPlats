// Measurement and calculation functions for benchmarking
import { Bench } from "tinybench";

// Configuration constants
export const BENCHMARK_TIME = 100;
export const MAX_ITERATIONS = 200;
export const WARMUP_TIME = 20;
export const WARMUP_ITERATIONS = 3;

// Calculation utilities
export function calculateOpsPerSecond(timeMs) {
  return timeMs === 0 ? Infinity : 1000 / timeMs;
}

export function calculateImprovement(baselineTime, comparisonTime) {
  if (baselineTime === 0) {
    return comparisonTime === 0 ? 0 : -Infinity;
  }
  return ((baselineTime - comparisonTime) / baselineTime) * 100;
}

// Memory measurement
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
  return (after - before) / (1024 * 1024);
}

export function measureMemoryUsage(fn, iterations = 10) {
  if (!hasMemoryAPI()) {
    return 0;
  }
  let totalDelta = 0;
  for (let i = 0; i < iterations; i++) {
    totalDelta += measureMemoryDelta(fn);
  }
  return totalDelta / iterations;
}

// Benchmark execution
function convertTinybenchResult(result) {
  const latency = result.latency || result;
  const isV6 = !!result.latency;

  const convertToMs = isV6
    ? (value) => value * 1000
    : (value) => value / 1_000_000;

  const mean = latency.mean ?? result.mean;
  const min = latency.min ?? result.min;
  const max = latency.max ?? result.max;
  const stdDev = latency.sd ?? latency.stdDev ?? result.stdDev;
  const rme = latency.rme ?? result.rme ?? 0;
  const samples = latency.samplesCount ?? latency.samples?.length ?? result.samples?.length ?? 0;

  const meanMs = convertToMs(mean);
  const stdDevMs = Number.isNaN(stdDev) ? 0 : convertToMs(stdDev);

  return {
    avg: meanMs,
    min: convertToMs(min),
    max: convertToMs(max),
    stdDev: stdDevMs,
    opsPerSecond: calculateOpsPerSecond(meanMs),
    samples,
    rme: rme || 0,
  };
}

export async function runBenchmark(fn, iterations = 100) {
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

// Comparison utilities for benchmark results

export function compareBenchmarkResults(
  baselineResult,
  comparisonResult,
  baselineName = "Baseline",
  comparisonName = "Comparison",
) {
  const improvementPercentage = calculateImprovement(baselineResult.avg, comparisonResult.avg);
  const fasterImplementation = baselineResult.avg < comparisonResult.avg ? baselineName : comparisonName;
  const slowerImplementation = baselineResult.avg < comparisonResult.avg ? comparisonName : baselineName;

  return {
    faster: fasterImplementation,
    slower: slowerImplementation,
    improvement: Math.abs(improvementPercentage),
    isBaselineFaster: baselineResult.avg < comparisonResult.avg,
    baselineResult: {
      name: baselineName,
      ...baselineResult,
    },
    comparisonResult: {
      name: comparisonName,
      ...comparisonResult,
    },
  };
}
