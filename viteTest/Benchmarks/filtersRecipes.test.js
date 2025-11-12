import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/benchmark-data.js";
import { addBenchmarkResult } from "./utils/data/dataCollector.js";
import { filterRecipes } from "./utils/filters/filter-adaptator.js";
import { filterRecipesNative } from "./utils/filters/filter-native.js";
import { logBenchmarkSection } from "./utils/logging/console.js";
import { compareResults } from "./utils/measurement/compare.js";
import { runBenchmark } from "./utils/measurement/measurement.js";

// Functional implementation label
const FUNCTIONAL_LABEL =
  "Functional Programming (filterRecipes using filter/every/some from filter.js)";
// Native implementation label
const NATIVE_LABEL = "Native Loops (filterRecipesNative using for loops from filter-native.js)";

describe("Combined Recipe Filtering Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;

  it("should benchmark filter with all filter types", async () => {
    // Filter configuration
    const filters = {
      ingredients: ["citron", "coco"],
      appliances: ["Blender", "Saladier"],
      ustensils: ["presse citron"],
    };

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterRecipes(benchmarkData, "", filters);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterRecipesNative(benchmarkData, filters);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Filter with All Filter Types", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with All Filter Types",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterRecipes(benchmarkData, "", filters);
    // Native filter result
    const nativeResult = filterRecipesNative(benchmarkData, filters);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter with ingredients and appliances", async () => {
    // Filter configuration
    const filters = {
      ingredients: ["poulet", "tomate"],
      appliances: ["Casserole"],
    };

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterRecipes(benchmarkData, "", filters);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterRecipesNative(benchmarkData, filters);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection(
      "Filter with Ingredients and Appliances",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with Ingredients and Appliances",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterRecipes(benchmarkData, "", filters);
    // Native filter result
    const nativeResult = filterRecipesNative(benchmarkData, filters);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter with ingredients and ustensils", async () => {
    // Filter configuration
    const filters = {
      ingredients: ["citron"],
      ustensils: ["presse citron", "cuillère"],
    };

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterRecipes(benchmarkData, "", filters);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterRecipesNative(benchmarkData, filters);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection(
      "Filter with Ingredients and Ustensils",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with Ingredients and Ustensils",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterRecipes(benchmarkData, "", filters);
    // Native filter result
    const nativeResult = filterRecipesNative(benchmarkData, filters);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter with appliances and ustensils", async () => {
    // Filter configuration
    const filters = {
      appliances: ["Four"],
      ustensils: ["couteau"],
    };

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterRecipes(benchmarkData, "", filters);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterRecipesNative(benchmarkData, filters);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection(
      "Filter with Appliances and Ustensils",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with Appliances and Ustensils",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterRecipes(benchmarkData, "", filters);
    // Native filter result
    const nativeResult = filterRecipesNative(benchmarkData, filters);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter with no filters (returns all)", async () => {
    // Empty filter configuration
    const filters = {};

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterRecipes(benchmarkData, "", filters);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterRecipesNative(benchmarkData, filters);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Filter with No Filters", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with No Filters",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterRecipes(benchmarkData, "", filters);
    // Native filter result
    const nativeResult = filterRecipesNative(benchmarkData, filters);
    expect(functionalResult.length).toBe(nativeResult.length);
  });
});
