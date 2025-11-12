import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/paths.js";
import { addBenchmarkResult } from "./utils/data/results.js";
import { filterByAppliances as filterByAppliancesFor } from "./utils/filters/filter-for.js";
import { filterByAppliances as filterByAppliancesForEach } from "./utils/filters/filter-forEach.js";
import { filterByAppliancesLoops } from "./utils/filters/filter-loops.js";
import { filterByAppliances as filterByAppliancesMaps } from "./utils/filters/filter-production.js";
import { filterByAppliances as filterByAppliancesReduce } from "./utils/filters/filter-reduce.js";
import { filterByAppliances as filterByAppliancesWhile } from "./utils/filters/filter-while.js";
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

describe("Filter Recipes by Appliances Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;

  it("should benchmark filter by single appliance", async () => {
    // Selected appliances array
    const selectedAppliances = ["Blender"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByAppliancesMaps,
      filterByAppliancesLoops,
      filterByAppliancesForEach,
      filterByAppliancesReduce,
      filterByAppliancesFor,
      filterByAppliancesWhile,
      benchmarkData,
      selectedAppliances,
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
      "Single Appliance Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Single Appliance Filter",
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

  it("should benchmark filter by multiple appliances (2)", async () => {
    // Selected appliances array
    const selectedAppliances = ["Blender", "Saladier"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByAppliancesMaps,
      filterByAppliancesLoops,
      filterByAppliancesForEach,
      filterByAppliancesReduce,
      filterByAppliancesFor,
      filterByAppliancesWhile,
      benchmarkData,
      selectedAppliances,
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
      "Multiple Appliances Filter (2)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Multiple Appliances Filter (2)",
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

  it("should benchmark filter by multiple appliances (3)", async () => {
    // Selected appliances array
    const selectedAppliances = ["Four", "Casserole", "Poêle"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByAppliancesMaps,
      filterByAppliancesLoops,
      filterByAppliancesForEach,
      filterByAppliancesReduce,
      filterByAppliancesFor,
      filterByAppliancesWhile,
      benchmarkData,
      selectedAppliances,
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
      "Multiple Appliances Filter (3)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Multiple Appliances Filter (3)",
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

  it("should benchmark filter by multiple appliances (5)", async () => {
    // Selected appliances array
    const selectedAppliances = ["Blender", "Saladier", "Four", "Casserole", "Poêle"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByAppliancesMaps,
      filterByAppliancesLoops,
      filterByAppliancesForEach,
      filterByAppliancesReduce,
      filterByAppliancesFor,
      filterByAppliancesWhile,
      benchmarkData,
      selectedAppliances,
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
      "Multiple Appliances Filter (5)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Multiple Appliances Filter (5)",
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

  it("should benchmark filter by empty appliances array", async () => {
    // Empty appliances array
    const selectedAppliances = [];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByAppliancesMaps,
      filterByAppliancesLoops,
      filterByAppliancesForEach,
      filterByAppliancesReduce,
      filterByAppliancesFor,
      filterByAppliancesWhile,
      benchmarkData,
      selectedAppliances,
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
      "Empty Appliances Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Empty Appliances Filter",
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

  it("should benchmark filter by non-existent appliance", async () => {
    // Non-existent appliance
    const selectedAppliances = ["NonexistentAppliance12345"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByAppliancesMaps,
      filterByAppliancesLoops,
      filterByAppliancesForEach,
      filterByAppliancesReduce,
      filterByAppliancesFor,
      filterByAppliancesWhile,
      benchmarkData,
      selectedAppliances,
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
      "Non-existent Appliance Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Non-existent Appliance Filter",
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

  it("should measure memory usage for appliances filter", () => {
    // Selected appliances array
    const selectedAppliances = ["Blender"];
    // Memory test iterations
    const memoryIterations = 50;

    // Memory usage for all implementations
    const mapsMemory = measureMemoryUsage(() => {
      filterByAppliancesMaps(benchmarkData, selectedAppliances);
    }, memoryIterations);

    const loopsMemory = measureMemoryUsage(() => {
      filterByAppliancesLoops(benchmarkData, selectedAppliances);
    }, memoryIterations);

    const forEachMemory = measureMemoryUsage(() => {
      filterByAppliancesForEach(benchmarkData, selectedAppliances);
    }, memoryIterations);

    const reduceMemory = measureMemoryUsage(() => {
      filterByAppliancesReduce(benchmarkData, selectedAppliances);
    }, memoryIterations);

    const forMemory = measureMemoryUsage(() => {
      filterByAppliancesFor(benchmarkData, selectedAppliances);
    }, memoryIterations);

    const whileMemory = measureMemoryUsage(() => {
      filterByAppliancesWhile(benchmarkData, selectedAppliances);
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
