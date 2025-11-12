import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/benchmark-data.js";
import { addBenchmarkResult } from "./utils/data/dataCollector.js";
import { filterBySearchTerm } from "./utils/filters/filter-adaptator.js";
import { filterBySearchTermNative } from "./utils/filters/filter-native.js";
import { logBenchmarkSection, logMemoryComparison } from "./utils/logging/console.js";
import { compareResults } from "./utils/measurement/compare.js";
import { measureMemoryUsage, runBenchmark } from "./utils/measurement/measurement.js";

// Functional implementation label
const FUNCTIONAL_LABEL =
  "Functional Programming (filterBySearchTerm using filter/includes from filter.js)";
// Native implementation label
const NATIVE_LABEL =
  "Native Loops (filterBySearchTermNative using for loops from filter-native.js)";

describe("Search Benchmark Tests", () => {
  // Benchmark iterations count
  const iterations = 50;

  it("should benchmark search with empty query", async () => {
    // Empty search term
    const searchTerm = "";

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Empty Query Benchmark", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Empty Query Benchmark",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    // Native filter result
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with short query", async () => {
    // Short search term
    const searchTerm = "tomate";

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Short Query Benchmark (tomate)", functionalStats, nativeStats, comparison);

    // Functional filter result
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    // Native filter result
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with medium query", async () => {
    // Medium search term
    const searchTerm = "chocolat noir";

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection(
      "Medium Query Benchmark (chocolat noir)",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Medium Query Benchmark (chocolat noir)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    // Native filter result
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with long query", async () => {
    // Long search term
    const searchTerm = "recette de poulet avec légumes";

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Long Query Benchmark", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Long Query Benchmark",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    // Native filter result
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with non-matching query", async () => {
    // Non-matching search term
    const searchTerm = "xyzabc123nonexistent";

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Non-matching Query Benchmark", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("search", {
      testCase: "Non-matching Query Benchmark",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    // Native filter result
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should measure memory usage for search", () => {
    // Search term
    const searchTerm = "tomate";
    // Memory test iterations
    const memoryIterations = 50;

    // Functional memory usage
    const functionalMemory = measureMemoryUsage(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, memoryIterations);

    // Native memory usage
    const nativeMemory = measureMemoryUsage(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, memoryIterations);

    logMemoryComparison("Memory Usage Comparison", functionalMemory, nativeMemory);

    // Memory comparison is informational only
    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });
});
