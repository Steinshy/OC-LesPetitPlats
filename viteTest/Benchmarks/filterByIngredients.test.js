import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/paths.js";
import { addBenchmarkResult } from "./utils/data/results.js";
import { filterByIngredients as filterByIngredientsFor } from "./utils/filters/filter-for.js";
import { filterByIngredients as filterByIngredientsForEach } from "./utils/filters/filter-forEach.js";
import { filterByIngredientsLoops } from "./utils/filters/filter-loops.js";
import { filterByIngredients as filterByIngredientsMaps } from "./utils/filters/filter-production.js";
import { filterByIngredients as filterByIngredientsReduce } from "./utils/filters/filter-reduce.js";
import { filterByIngredients as filterByIngredientsWhile } from "./utils/filters/filter-while.js";
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

describe("Filter Recipes by Ingredients Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;

  it("should benchmark filter by single ingredient", async () => {
    // Selected ingredients array
    const selectedIngredients = ["citron"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByIngredientsMaps,
      filterByIngredientsLoops,
      filterByIngredientsForEach,
      filterByIngredientsReduce,
      filterByIngredientsFor,
      filterByIngredientsWhile,
      benchmarkData,
      selectedIngredients,
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
      "Single Ingredient Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Single Ingredient Filter",
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

  it("should benchmark filter by multiple ingredients (2)", async () => {
    // Selected ingredients array
    const selectedIngredients = ["citron", "coco"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByIngredientsMaps,
      filterByIngredientsLoops,
      filterByIngredientsForEach,
      filterByIngredientsReduce,
      filterByIngredientsFor,
      filterByIngredientsWhile,
      benchmarkData,
      selectedIngredients,
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
      "Multiple Ingredients Filter (2)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Multiple Ingredients Filter (2)",
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

  it("should benchmark filter by multiple ingredients (3)", async () => {
    // Selected ingredients array
    const selectedIngredients = ["poulet", "tomate", "oignon"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByIngredientsMaps,
      filterByIngredientsLoops,
      filterByIngredientsForEach,
      filterByIngredientsReduce,
      filterByIngredientsFor,
      filterByIngredientsWhile,
      benchmarkData,
      selectedIngredients,
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
      "Multiple Ingredients Filter (3)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Multiple Ingredients Filter (3)",
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

  it("should benchmark filter by multiple ingredients (5)", async () => {
    // Selected ingredients array
    const selectedIngredients = ["citron", "coco", "poulet", "tomate", "oignon"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByIngredientsMaps,
      filterByIngredientsLoops,
      filterByIngredientsForEach,
      filterByIngredientsReduce,
      filterByIngredientsFor,
      filterByIngredientsWhile,
      benchmarkData,
      selectedIngredients,
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
      "Multiple Ingredients Filter (5)",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Multiple Ingredients Filter (5)",
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

  it("should benchmark filter by empty ingredients array", async () => {
    // Empty ingredients array
    const selectedIngredients = [];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByIngredientsMaps,
      filterByIngredientsLoops,
      filterByIngredientsForEach,
      filterByIngredientsReduce,
      filterByIngredientsFor,
      filterByIngredientsWhile,
      benchmarkData,
      selectedIngredients,
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
      "Empty Ingredients Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Empty Ingredients Filter",
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

  it("should benchmark filter by non-existent ingredient", async () => {
    // Non-existent ingredient
    const selectedIngredients = ["nonexistentingredient12345"];

    // Create implementation functions
    const implementations = createImplementationFunctions(
      filterByIngredientsMaps,
      filterByIngredientsLoops,
      filterByIngredientsForEach,
      filterByIngredientsReduce,
      filterByIngredientsFor,
      filterByIngredientsWhile,
      benchmarkData,
      selectedIngredients,
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
      "Non-existent Ingredient Filter",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("ingredients", {
      testCase: "Non-existent Ingredient Filter",
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

  it("should measure memory usage for ingredients filter", () => {
    // Selected ingredients array
    const selectedIngredients = ["citron"];
    // Memory test iterations
    const memoryIterations = 50;

    // Memory usage for all implementations
    const mapsMemory = measureMemoryUsage(() => {
      filterByIngredientsMaps(benchmarkData, selectedIngredients);
    }, memoryIterations);

    const loopsMemory = measureMemoryUsage(() => {
      filterByIngredientsLoops(benchmarkData, selectedIngredients);
    }, memoryIterations);

    const forEachMemory = measureMemoryUsage(() => {
      filterByIngredientsForEach(benchmarkData, selectedIngredients);
    }, memoryIterations);

    const reduceMemory = measureMemoryUsage(() => {
      filterByIngredientsReduce(benchmarkData, selectedIngredients);
    }, memoryIterations);

    const forMemory = measureMemoryUsage(() => {
      filterByIngredientsFor(benchmarkData, selectedIngredients);
    }, memoryIterations);

    const whileMemory = measureMemoryUsage(() => {
      filterByIngredientsWhile(benchmarkData, selectedIngredients);
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
