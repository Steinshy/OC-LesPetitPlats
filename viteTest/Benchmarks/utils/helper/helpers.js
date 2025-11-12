// Benchmark helper utilities for running and comparing multiple implementations
import { runBenchmark } from "../measurement/measurement.js";

// Implementation labels
export const MAPS_LABEL = "Production (using production filter functions with mapping)";
export const LOOPS_LABEL = "Loops (using for loops from filter-loops.js)";
export const FOREACH_LABEL = "forEach (using forEach iteration)";
export const REDUCE_LABEL = "reduce (using reduce iteration)";
export const FOR_LABEL = "for (using for loops)";
export const WHILE_LABEL = "while (using while loops)";

// All implementation labels array
export const ALL_LABELS = [
  MAPS_LABEL,
  LOOPS_LABEL,
  FOREACH_LABEL,
  REDUCE_LABEL,
  FOR_LABEL,
  WHILE_LABEL,
];

// Run benchmarks for all implementations
export async function runAllBenchmarks(implementations, iterations) {
  const mapsStats = await runBenchmark(implementations.maps, iterations);
  const loopsStats = await runBenchmark(implementations.loops, iterations);
  const forEachStats = await runBenchmark(implementations.forEach, iterations);
  const reduceStats = await runBenchmark(implementations.reduce, iterations);
  const forStats = await runBenchmark(implementations.for, iterations);
  const whileStats = await runBenchmark(implementations.while, iterations);

  return { mapsStats, loopsStats, forEachStats, reduceStats, forStats, whileStats };
}

// Find the fastest implementation from benchmark stats
export function findFastest(allStats) {
  const statsArray = [
    { name: MAPS_LABEL, stats: allStats.mapsStats },
    { name: LOOPS_LABEL, stats: allStats.loopsStats },
    { name: FOREACH_LABEL, stats: allStats.forEachStats },
    { name: REDUCE_LABEL, stats: allStats.reduceStats },
    { name: FOR_LABEL, stats: allStats.forStats },
    { name: WHILE_LABEL, stats: allStats.whileStats },
  ];
  statsArray.sort((a, b) => a.stats.avg - b.stats.avg);
  return statsArray[0].name;
}

// Verify that all implementations return the same result length
export function verifyResults(implementations, expect) {
  const mapsResult = implementations.maps();
  const loopsResult = implementations.loops();
  const forEachResult = implementations.forEach();
  const reduceResult = implementations.reduce();
  const forResult = implementations.for();
  const whileResult = implementations.while();

  const baseLength = mapsResult.length;
  expect(baseLength).toBe(loopsResult.length);
  expect(baseLength).toBe(forEachResult.length);
  expect(baseLength).toBe(reduceResult.length);
  expect(baseLength).toBe(forResult.length);
  expect(baseLength).toBe(whileResult.length);
}

// Create implementation functions object for a filter function
export function createImplementationFunctions(
  mapsFn,
  loopsFn,
  forEachFn,
  reduceFn,
  forFn,
  whileFn,
  ...args
) {
  return {
    maps: () => mapsFn(...args),
    loops: () => loopsFn(...args),
    forEach: () => forEachFn(...args),
    reduce: () => reduceFn(...args),
    for: () => forFn(...args),
    while: () => whileFn(...args),
  };
}
