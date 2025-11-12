import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/benchmark-data.js";
import { addBenchmarkResult } from "./utils/data/dataCollector.js";
import { filterByUstensils } from "./utils/filters/filter-adaptator.js";
import { filterByUstensilsNative } from "./utils/filters/filter-native.js";
import { logBenchmarkSection, logMemoryComparison } from "./utils/logging/console.js";
import { compareResults } from "./utils/measurement/compare.js";
import { measureMemoryUsage, runBenchmark } from "./utils/measurement/measurement.js";

// Functional implementation label
const FUNCTIONAL_LABEL =
  "Functional Programming (filterByUstensils using filter/every/some from filter.js)";
// Native implementation label
const NATIVE_LABEL = "Native Loops (filterByUstensilsNative using for loops from filter-native.js)";

describe("Filter Recipes by Ustensils Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;
  // Test ustensil constant
  const PRESSE_CITRON = "presse citron";

  it("should benchmark filter by single ustensil", async () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByUstensils(benchmarkData, selectedUstensils);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByUstensilsNative(benchmarkData, selectedUstensils);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Single Ustensil Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Single Ustensil Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
    // Native filter result
    const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple ustensils (2)", async () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON, "cuillère"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByUstensils(benchmarkData, selectedUstensils);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByUstensilsNative(benchmarkData, selectedUstensils);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Multiple Ustensils Filter (2)", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Multiple Ustensils Filter (2)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
    // Native filter result
    const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple ustensils (3)", async () => {
    // Selected ustensils array
    const selectedUstensils = ["couteau", "cuillère", PRESSE_CITRON];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByUstensils(benchmarkData, selectedUstensils);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByUstensilsNative(benchmarkData, selectedUstensils);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Multiple Ustensils Filter (3)", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Multiple Ustensils Filter (3)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
    // Native filter result
    const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple ustensils (5)", async () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON, "cuillère", "couteau", "verres", "saladier"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByUstensils(benchmarkData, selectedUstensils);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByUstensilsNative(benchmarkData, selectedUstensils);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Multiple Ustensils Filter (5)", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Multiple Ustensils Filter (5)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
    // Native filter result
    const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by empty ustensils array", async () => {
    // Empty ustensils array
    const selectedUstensils = [];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByUstensils(benchmarkData, selectedUstensils);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByUstensilsNative(benchmarkData, selectedUstensils);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Empty Ustensils Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Empty Ustensils Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
    // Native filter result
    const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by non-existent ustensil", async () => {
    // Non-existent ustensil
    const selectedUstensils = ["nonexistentustensil12345"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByUstensils(benchmarkData, selectedUstensils);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByUstensilsNative(benchmarkData, selectedUstensils);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Non-existent Ustensil Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ustensils", {
      testCase: "Non-existent Ustensil Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
    // Native filter result
    const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should measure memory usage for ustensils filter", () => {
    // Selected ustensils array
    const selectedUstensils = [PRESSE_CITRON];
    // Memory test iterations
    const memoryIterations = 50;

    // Functional memory usage
    const functionalMemory = measureMemoryUsage(() => {
      filterByUstensils(benchmarkData, selectedUstensils);
    }, memoryIterations);

    // Native memory usage
    const nativeMemory = measureMemoryUsage(() => {
      filterByUstensilsNative(benchmarkData, selectedUstensils);
    }, memoryIterations);

    logMemoryComparison("Memory Usage Comparison", functionalMemory, nativeMemory);

    // Memory comparison is informational only
    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });
});
