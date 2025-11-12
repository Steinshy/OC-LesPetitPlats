// Formatting and comparison utilities for benchmark results

export function formatTime(timeMs) {
  if (timeMs < 0.001) {
    // Convert to nanoseconds
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

export function formatMemory(memoryMB) {
  if (Math.abs(memoryMB) < 0.001) {
    return "~0 MB";
  }
  return `${memoryMB >= 0 ? "+" : ""}${memoryMB.toFixed(3)} MB`;
}

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

export function calculateImprovement(baselineTime, comparisonTime) {
  if (baselineTime === 0) {
    return comparisonTime === 0 ? 0 : -Infinity;
  }
  return ((baselineTime - comparisonTime) / baselineTime) * 100;
}

export function compareResults(
  result1,
  result2,
  name1 = "Implementation 1",
  name2 = "Implementation 2",
) {
  // Speed improvement %
  const improvement = calculateImprovement(result1.avg, result2.avg);
  // Faster implementation name
  const faster = result1.avg < result2.avg ? name1 : name2;
  // Slower implementation name
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

export function createComparisonRow(comparison) {
  return [
    comparison.result1.name,
    formatTime(comparison.result1.avg),
    formatTime(comparison.result1.min),
    formatTime(comparison.result1.max),
    comparison.result1.opsPerSecond.toFixed(2),
  ];
}
