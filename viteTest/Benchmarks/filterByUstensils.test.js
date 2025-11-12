import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/paths.js";
import { addBenchmarkResult } from "./utils/data/results.js";
import { filterByUstensils as filterByUstensilsFor } from "./utils/filters/filter-for.js";
import { filterByUstensils as filterByUstensilsForEach } from "./utils/filters/filter-forEach.js";
import { filterByUstensilsLoops } from "./utils/filters/filter-loops.js";
import { filterByUstensils as filterByUstensilsMaps } from "./utils/filters/filter-production.js";
import { filterByUstensils as filterByUstensilsReduce } from "./utils/filters/filter-reduce.js";
import { filterByUstensils as filterByUstensilsWhile } from "./utils/filters/filter-while.js";
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

describe("Filter Recipes by Ustensils Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;
  // Test ustensil constant
  const PRESSE_CITRON = "presse citron";

  it("should benchmark filter by single ustensil", async () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByUstensilsMaps,
      filterByUstensilsLoops,
      filterByUstensilsForEach,
      filterByUstensilsReduce,
      filterByUstensilsFor,
      filterByUstensilsWhile,
      benchmarkData,
      selectedUstensils,
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
      "Single Ustensil Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Single Ustensil Filter",
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

  it("should benchmark filter by multiple ustensils (2)", async () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON, "cuillère"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByUstensilsMaps,
      filterByUstensilsLoops,
      filterByUstensilsForEach,
      filterByUstensilsReduce,
      filterByUstensilsFor,
      filterByUstensilsWhile,
      benchmarkData,
      selectedUstensils,
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
      "Multiple Ustensils Filter (2)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Multiple Ustensils Filter (2)",
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

  it("should benchmark filter by multiple ustensils (3)", async () => {
    // Selected ustensils array
    const selectedUstensils = ["couteau", "cuillère", PRESSE_CITRON];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByUstensilsMaps,
      filterByUstensilsLoops,
      filterByUstensilsForEach,
      filterByUstensilsReduce,
      filterByUstensilsFor,
      filterByUstensilsWhile,
      benchmarkData,
      selectedUstensils,
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
      "Multiple Ustensils Filter (3)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Multiple Ustensils Filter (3)",
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

  it("should benchmark filter by multiple ustensils (5)", async () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON, "cuillère", "couteau", "verres", "saladier"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByUstensilsMaps,
      filterByUstensilsLoops,
      filterByUstensilsForEach,
      filterByUstensilsReduce,
      filterByUstensilsFor,
      filterByUstensilsWhile,
      benchmarkData,
      selectedUstensils,
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
      "Multiple Ustensils Filter (5)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Multiple Ustensils Filter (5)",
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

  it("should benchmark filter by empty ustensils array", async () => {
    // Empty ustensils array
    const selectedUstensils = [];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByUstensilsMaps,
      filterByUstensilsLoops,
      filterByUstensilsForEach,
      filterByUstensilsReduce,
      filterByUstensilsFor,
      filterByUstensilsWhile,
      benchmarkData,
      selectedUstensils,
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
      "Empty Ustensils Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Empty Ustensils Filter",
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

  it("should benchmark filter by non-existent ustensil", async () => {
    // Non-existent ustensil
    const selectedUstensils = ["nonexistentustensil12345"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByUstensilsMaps,
      filterByUstensilsLoops,
      filterByUstensilsForEach,
      filterByUstensilsReduce,
      filterByUstensilsFor,
      filterByUstensilsWhile,
      benchmarkData,
      selectedUstensils,
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
      "Non-existent Ustensil Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Non-existent Ustensil Filter",
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

  it("should measure memory usage for ustensils filter", () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON];
    // Memory test iterations
    const memoryIterations = 50;

    // Memory usage for all implementations
    const mapsMemory = measureMemoryUsage(() => {
      filterByUstensilsMaps(benchmarkData, selectedUstensils);
    }, memoryIterations);

    const loopsMemory = measureMemoryUsage(() => {
      filterByUstensilsLoops(benchmarkData, selectedUstensils);
    }, memoryIterations);

    const forEachMemory = measureMemoryUsage(() => {
      filterByUstensilsForEach(benchmarkData, selectedUstensils);
    }, memoryIterations);

    const reduceMemory = measureMemoryUsage(() => {
      filterByUstensilsReduce(benchmarkData, selectedUstensils);
    }, memoryIterations);

    const forMemory = measureMemoryUsage(() => {
      filterByUstensilsFor(benchmarkData, selectedUstensils);
    }, memoryIterations);

    const whileMemory = measureMemoryUsage(() => {
      filterByUstensilsWhile(benchmarkData, selectedUstensils);
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
