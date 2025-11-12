// Core measurement functions for benchmarking using tinybench
import { Bench } from "tinybench";

export function calculateOpsPerSecond(timeMs) {
  if (timeMs === 0) {
    return Infinity;
  }
  return 1000 / timeMs;
}

export function measureMemoryDelta(fn) {
  if (typeof performance.memory === "undefined") {
    return 0;
  }

  // Memory before execution
  const before = performance.memory.usedJSHeapSize;
  fn();
  // Memory after execution
  const after = performance.memory.usedJSHeapSize;
  return (after - before) / 1024 / 1024;
}

export function measureMemoryUsage(fn, iterations = 10) {
  if (typeof performance.memory === "undefined") {
    return 0;
  }

  // Total memory delta across iterations
  let totalDelta = 0;
  // Iteration counter
  let i = 0;
  while (i < iterations) {
    totalDelta += measureMemoryDelta(fn);
    i++;
  }

  return totalDelta / iterations;
}

function convertTinybenchResult(result) {
  // Average time in ms
  const avg = result.mean / 1_000_000;
  // Min time in ms
  const min = result.min / 1_000_000;
  // Max time in ms
  const max = result.max / 1_000_000;
  // Std dev in ms
  const stdDev = Number.isNaN(result.stdDev) ? 0 : result.stdDev / 1_000_000;

  // Sample array
  const sampleArray = result.samples || [];
  // Total sample count
  const totalSamples = sampleArray.reduce(sum => sum + 1, 0) || result.samples?.length || 0;

  return {
    avg,
    min,
    max,
    stdDev,
    opsPerSecond: calculateOpsPerSecond(avg),
    samples: totalSamples,
    rme: result.rme || 0,
  };
}

export async function runBenchmark(fn, iterations = 100) {
  // Benchmark instance
  const bench = new Bench({
    time: 75,
    iterations: Math.min(iterations, 25),
    warmupTime: 15,
    warmupIterations: 2,
  });

  bench.add("benchmark", fn);

  await bench.run();

  // First benchmark result
  const result = bench.results[0];
  if (!result) {
    throw new Error("Benchmark failed to produce results");
  }

  return convertTinybenchResult(result);
}
