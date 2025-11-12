import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/paths.js";
import { addBenchmarkResult } from "./utils/data/results.js";
import { filterBySearchTerm as filterBySearchTermFor } from "./utils/filters/filter-for.js";
import { filterBySearchTerm as filterBySearchTermForEach } from "./utils/filters/filter-forEach.js";
import { filterBySearchTermLoops } from "./utils/filters/filter-loops.js";
import { filterBySearchTerm as filterBySearchTermMaps } from "./utils/filters/filter-production.js";
import { filterBySearchTerm as filterBySearchTermReduce } from "./utils/filters/filter-reduce.js";
import { filterBySearchTerm as filterBySearchTermWhile } from "./utils/filters/filter-while.js";
import {
  MAPS_LABEL,
  LOOPS_LABEL,
  FOREACH_LABEL,
  REDUCE_LABEL,
  FOR_LABEL,
  WHILE_LABEL,
  runAllBenchmarks,
  findFastest,
  verifyResults,
  createImplementationFunctions,
} from "./utils/helper/helpers.js";
import {
  logBenchmarkSection,
  logMemoryComparison,
  logAllImplementations,
  logAllMemoryUsages,
} from "./utils/logging/console.js";
import { compareResults } from "./utils/measurement/compare.js";
import { measureMemoryUsage } from "./utils/measurement/measurement.js";

// Labels object for logging
const LABELS = {
  MAPS: MAPS_LABEL,
  LOOPS: LOOPS_LABEL,
  FOREACH: FOREACH_LABEL,
  REDUCE: REDUCE_LABEL,
  FOR: FOR_LABEL,
  WHILE: WHILE_LABEL,
};

describe("Search Benchmark Tests", () => {
  // Benchmark iterations count
  const iterations = 50;

  it("should benchmark search with empty query", async () => {
    // Empty search term
    const searchTerm = "";

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterBySearchTermMaps,
      filterBySearchTermLoops,
      filterBySearchTermForEach,
      filterBySearchTermReduce,
      filterBySearchTermFor,
      filterBySearchTermWhile,
      benchmarkData,
      searchTerm,
    );

    // Run all benchmarks
    const allStats = await runAllBenchmarks(implementations, iterations);

    // Primary comparison (maps vs loops for backward compatibility)
    const comparison = compareResults(
      allStats.mapsStats,
      allStats.loopsStats,
      MAPS_LABEL,
      LOOPS_LABEL,
    );

    logBenchmarkSection(
      "Empty Query Benchmark",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Empty Query Benchmark",
      functionalStats: allStats.mapsStats,
      loopStats: allStats.loopsStats,
      forEachStats: allStats.forEachStats,
      reduceStats: allStats.reduceStats,
      forStats: allStats.forStats,
      whileStats: allStats.whileStats,
      comparison,
    });

    verifyResults(implementations, expect);
  });

  it("should benchmark search with short query", async () => {
    // Short search term
    const searchTerm = "tomate";

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterBySearchTermMaps,
      filterBySearchTermLoops,
      filterBySearchTermForEach,
      filterBySearchTermReduce,
      filterBySearchTermFor,
      filterBySearchTermWhile,
      benchmarkData,
      searchTerm,
    );

    // Run all benchmarks
    const allStats = await runAllBenchmarks(implementations, iterations);

    // Primary comparison (maps vs loops for backward compatibility)
    const comparison = compareResults(
      allStats.mapsStats,
      allStats.loopsStats,
      MAPS_LABEL,
      LOOPS_LABEL,
    );

    logBenchmarkSection(
      "Short Query Benchmark (tomate)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Short Query Benchmark (tomate)",
      functionalStats: allStats.mapsStats,
      loopStats: allStats.loopsStats,
      forEachStats: allStats.forEachStats,
      reduceStats: allStats.reduceStats,
      forStats: allStats.forStats,
      whileStats: allStats.whileStats,
      comparison,
    });

    verifyResults(implementations, expect);
  });

  it("should benchmark search with medium query", async () => {
    // Medium search term
    const searchTerm = "chocolat noir";

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterBySearchTermMaps,
      filterBySearchTermLoops,
      filterBySearchTermForEach,
      filterBySearchTermReduce,
      filterBySearchTermFor,
      filterBySearchTermWhile,
      benchmarkData,
      searchTerm,
    );

    // Run all benchmarks
    const allStats = await runAllBenchmarks(implementations, iterations);

    // Primary comparison (maps vs loops for backward compatibility)
    const comparison = compareResults(
      allStats.mapsStats,
      allStats.loopsStats,
      MAPS_LABEL,
      LOOPS_LABEL,
    );

    logBenchmarkSection(
      "Medium Query Benchmark (chocolat noir)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Medium Query Benchmark (chocolat noir)",
      functionalStats: allStats.mapsStats,
      loopStats: allStats.loopsStats,
      forEachStats: allStats.forEachStats,
      reduceStats: allStats.reduceStats,
      forStats: allStats.forStats,
      whileStats: allStats.whileStats,
      comparison,
    });

    verifyResults(implementations, expect);
  });

  it("should benchmark search with long query", async () => {
    // Long search term
    const searchTerm = "recette de poulet avec légumes";

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterBySearchTermMaps,
      filterBySearchTermLoops,
      filterBySearchTermForEach,
      filterBySearchTermReduce,
      filterBySearchTermFor,
      filterBySearchTermWhile,
      benchmarkData,
      searchTerm,
    );

    // Run all benchmarks
    const allStats = await runAllBenchmarks(implementations, iterations);

    // Primary comparison (maps vs loops for backward compatibility)
    const comparison = compareResults(
      allStats.mapsStats,
      allStats.loopsStats,
      MAPS_LABEL,
      LOOPS_LABEL,
    );

    logBenchmarkSection(
      "Long Query Benchmark",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Long Query Benchmark",
      functionalStats: allStats.mapsStats,
      loopStats: allStats.loopsStats,
      forEachStats: allStats.forEachStats,
      reduceStats: allStats.reduceStats,
      forStats: allStats.forStats,
      whileStats: allStats.whileStats,
      comparison,
    });

    verifyResults(implementations, expect);
  });

  it("should benchmark search with non-matching query", async () => {
    // Non-matching search term
    const searchTerm = "xyzabc123nonexistent";

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterBySearchTermMaps,
      filterBySearchTermLoops,
      filterBySearchTermForEach,
      filterBySearchTermReduce,
      filterBySearchTermFor,
      filterBySearchTermWhile,
      benchmarkData,
      searchTerm,
    );

    // Run all benchmarks
    const allStats = await runAllBenchmarks(implementations, iterations);

    // Primary comparison (maps vs loops for backward compatibility)
    const comparison = compareResults(
      allStats.mapsStats,
      allStats.loopsStats,
      MAPS_LABEL,
      LOOPS_LABEL,
    );

    logBenchmarkSection(
      "Non-matching Query Benchmark",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Non-matching Query Benchmark",
      functionalStats: allStats.mapsStats,
      loopStats: allStats.loopsStats,
      forEachStats: allStats.forEachStats,
      reduceStats: allStats.reduceStats,
      forStats: allStats.forStats,
      whileStats: allStats.whileStats,
      comparison,
    });

    verifyResults(implementations, expect);
  });

  it("should measure memory usage for search", () => {
    // Search term
    const searchTerm = "tomate";
    // Memory test iterations
    const memoryIterations = 50;

    // Memory usage for all implementations
    const mapsMemory = measureMemoryUsage(() => {
      filterBySearchTermMaps(benchmarkData, searchTerm);
    }, memoryIterations);

    const loopsMemory = measureMemoryUsage(() => {
      filterBySearchTermLoops(benchmarkData, searchTerm);
    }, memoryIterations);

    const forEachMemory = measureMemoryUsage(() => {
      filterBySearchTermForEach(benchmarkData, searchTerm);
    }, memoryIterations);

    const reduceMemory = measureMemoryUsage(() => {
      filterBySearchTermReduce(benchmarkData, searchTerm);
    }, memoryIterations);

    const forMemory = measureMemoryUsage(() => {
      filterBySearchTermFor(benchmarkData, searchTerm);
    }, memoryIterations);

    const whileMemory = measureMemoryUsage(() => {
      filterBySearchTermWhile(benchmarkData, searchTerm);
    }, memoryIterations);

    logMemoryComparison("Memory Usage Comparison", mapsMemory, loopsMemory);

    // Log all memory usages
    logAllMemoryUsages(
      {
        maps: mapsMemory,
        loops: loopsMemory,
        forEach: forEachMemory,
        reduce: reduceMemory,
        for: forMemory,
        while: whileMemory,
      },
      LABELS,
    );

    // Memory comparison is informational only
    expect(typeof mapsMemory).toBe("number");
    expect(typeof loopsMemory).toBe("number");
    expect(typeof forEachMemory).toBe("number");
    expect(typeof reduceMemory).toBe("number");
    expect(typeof forMemory).toBe("number");
    expect(typeof whileMemory).toBe("number");
  });
});
