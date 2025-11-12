import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/benchmark-data.js";
import { addBenchmarkResult } from "./utils/data/dataCollector.js";
import { filterByIngredients } from "./utils/filters/filter-adaptator.js";
import { filterByIngredientsNative } from "./utils/filters/filter-native.js";
import { logBenchmarkSection, logMemoryComparison } from "./utils/logging/logger.js";
import { compareResults } from "./utils/measurement/formatting.js";
import { measureMemoryUsage, runBenchmark } from "./utils/measurement/measurement.js";

// Functional implementation label
const FUNCTIONAL_LABEL =
  "Functional Programming (filterByIngredients using filter/every/some from filter.js)";
// Native implementation label
const NATIVE_LABEL =
  "Native Loops (filterByIngredientsNative using for loops from filter-native.js)";

describe("Filter Recipes by Ingredients Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;

  it("should benchmark filter by single ingredient", async () => {
    // Selected ingredients array
    const selectedIngredients = ["citron"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByIngredients(benchmarkData, selectedIngredients);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByIngredientsNative(benchmarkData, selectedIngredients);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Single Ingredient Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Single Ingredient Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
    // Native filter result
    const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple ingredients (2)", async () => {
    // Selected ingredients array
    const selectedIngredients = ["citron", "coco"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByIngredients(benchmarkData, selectedIngredients);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByIngredientsNative(benchmarkData, selectedIngredients);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection(
      "Multiple Ingredients Filter (2)",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Multiple Ingredients Filter (2)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
    // Native filter result
    const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple ingredients (3)", async () => {
    // Selected ingredients array
    const selectedIngredients = ["poulet", "tomate", "oignon"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByIngredients(benchmarkData, selectedIngredients);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByIngredientsNative(benchmarkData, selectedIngredients);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection(
      "Multiple Ingredients Filter (3)",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Multiple Ingredients Filter (3)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
    // Native filter result
    const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by multiple ingredients (5)", async () => {
    // Selected ingredients array
    const selectedIngredients = ["citron", "coco", "poulet", "tomate", "oignon"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByIngredients(benchmarkData, selectedIngredients);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByIngredientsNative(benchmarkData, selectedIngredients);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection(
      "Multiple Ingredients Filter (5)",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Multiple Ingredients Filter (5)",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
    // Native filter result
    const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by empty ingredients array", async () => {
    // Empty ingredients array
    const selectedIngredients = [];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByIngredients(benchmarkData, selectedIngredients);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByIngredientsNative(benchmarkData, selectedIngredients);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Empty Ingredients Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Empty Ingredients Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
    // Native filter result
    const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark filter by non-existent ingredient", async () => {
    // Non-existent ingredient
    const selectedIngredients = ["nonexistentingredient12345"];

    // Functional implementation stats
    const functionalStats = await runBenchmark(() => {
      filterByIngredients(benchmarkData, selectedIngredients);
    }, iterations);

    // Native implementation stats
    const nativeStats = await runBenchmark(() => {
      filterByIngredientsNative(benchmarkData, selectedIngredients);
    }, iterations);

    // Comparison results
    const comparison = compareResults(functionalStats, nativeStats, FUNCTIONAL_LABEL, NATIVE_LABEL);

    logBenchmarkSection("Non-existent Ingredient Filter", functionalStats, nativeStats, comparison);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Non-existent Ingredient Filter",
      functionalStats,
      nativeStats,
      comparison,
    });

    // Functional filter result
    const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
    // Native filter result
    const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should measure memory usage for ingredients filter", () => {
    // Selected ingredients array
    const selectedIngredients = ["citron"];
    // Memory test iterations
    const memoryIterations = 50;

    // Functional memory usage
    const functionalMemory = measureMemoryUsage(() => {
      filterByIngredients(benchmarkData, selectedIngredients);
    }, memoryIterations);

    // Native memory usage
    const nativeMemory = measureMemoryUsage(() => {
      filterByIngredientsNative(benchmarkData, selectedIngredients);
    }, memoryIterations);

    logMemoryComparison("Memory Usage Comparison", functionalMemory, nativeMemory);

    // Memory comparison is informational only
    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });
});
