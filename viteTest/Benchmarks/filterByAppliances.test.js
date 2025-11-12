import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/benchmark-data.js";
import { addBenchmarkResult } from "./utils/data/dataCollector.js";
import { filterByAppliances } from "./utils/filters/filter-adaptator.js";
import { filterByAppliancesNative } from "./utils/filters/filter-native.js";
import { logBenchmarkSection, logMemoryComparison } from "./utils/logging/console.js";
import { compareResults } from "./utils/measurement/compare.js";
import { measureMemoryUsage, runBenchmark } from "./utils/measurement/measurement.js";

// Functional implementation label
const FUNCTIONAL_LABEL =
  "Functional Programming (filterByAppliances using filter/some from filter.js)";
// Native implementation label
const NATIVE_LABEL =
  "Native Loops (filterByAppliancesNative using for loops from filter-native.js)";

describe("Filter Recipes by Appliances Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;

  it("should benchmark filter by single appliance", async () => {
    // Selected appliances array
    const selectedAppliances = ["Blender"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByAppliances(benchmarkData, selectedAppliances);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByAppliancesNative(benchmarkData, selectedAppliances);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Single Appliance Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Single Appliance Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
    // Native filter result
    const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple appliances (2)", async () => {
    // Selected appliances array
    const selectedAppliances = ["Blender", "Saladier"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByAppliances(benchmarkData, selectedAppliances);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByAppliancesNative(benchmarkData, selectedAppliances);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Multiple Appliances Filter (2)", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Multiple Appliances Filter (2)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
    // Native filter result
    const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple appliances (3)", async () => {
    // Selected appliances array
    const selectedAppliances = ["Four", "Casserole", "Poêle"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByAppliances(benchmarkData, selectedAppliances);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByAppliancesNative(benchmarkData, selectedAppliances);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Multiple Appliances Filter (3)", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Multiple Appliances Filter (3)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
    // Native filter result
    const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple appliances (5)", async () => {
    // Selected appliances array
    const selectedAppliances = ["Blender", "Saladier", "Four", "Casserole", "Poêle"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByAppliances(benchmarkData, selectedAppliances);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByAppliancesNative(benchmarkData, selectedAppliances);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Multiple Appliances Filter (5)", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Multiple Appliances Filter (5)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
    // Native filter result
    const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by empty appliances array", async () => {
    // Empty appliances array
    const selectedAppliances = [];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByAppliances(benchmarkData, selectedAppliances);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByAppliancesNative(benchmarkData, selectedAppliances);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Empty Appliances Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Empty Appliances Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
    // Native filter result
    const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by non-existent appliance", async () => {
    // Non-existent appliance
    const selectedAppliances = ["NonexistentAppliance12345"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByAppliances(benchmarkData, selectedAppliances);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByAppliancesNative(benchmarkData, selectedAppliances);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Non-existent Appliance Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("appliances", {
      testCase: "Non-existent Appliance Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
    // Native filter result
    const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should measure memory usage for appliances filter", () => {
    // Selected appliances array
    const selectedAppliances = ["Blender"];
    // Memory test iterations
    const memoryIterations = 50;

    // Functional memory usage
    const functionalMemory = measureMemoryUsage(() => {
      filterByAppliances(benchmarkData, selectedAppliances);
    }, memoryIterations);

    // Native memory usage
    const nativeMemory = measureMemoryUsage(() => {
      filterByAppliancesNative(benchmarkData, selectedAppliances);
    }, memoryIterations);

    logMemoryComparison("Memory Usage Comparison", functionalMemory, nativeMemory);

    // Memory comparison is informational only
    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });
});
