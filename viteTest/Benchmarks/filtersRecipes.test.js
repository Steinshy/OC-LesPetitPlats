import { describe, expect, it } from "vitest";
import { benchmarkData } from "./utils/data/paths.js";
import { addBenchmarkResult } from "./utils/data/results.js";
import { filterRecipes as filterRecipesFor } from "./utils/filters/filter-for.js";
import { filterRecipes as filterRecipesForEach } from "./utils/filters/filter-forEach.js";
import { filterRecipesLoops } from "./utils/filters/filter-loops.js";
import { filterRecipes as filterRecipesMaps } from "./utils/filters/filter-production.js";
import { filterRecipes as filterRecipesReduce } from "./utils/filters/filter-reduce.js";
import { filterRecipes as filterRecipesWhile } from "./utils/filters/filter-while.js";
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
} from "./utils/helper/helpers.js";
import { logBenchmarkSection, logAllImplementations } from "./utils/logging/console.js";
import { compareResults } from "./utils/measurement/compare.js";

// Labels object for logging
const LABELS = {
  MAPS: MAPS_LABEL,
  LOOPS: LOOPS_LABEL,
  FOREACH: FOREACH_LABEL,
  REDUCE: REDUCE_LABEL,
  FOR: FOR_LABEL,
  WHILE: WHILE_LABEL,
};

describe("Combined Recipe Filtering Benchmarks", () => {
  // Benchmark iterations count
  const iterations = 50;

  // Helper function to create implementations for filterRecipes (special case with searchTerm)
  function createFilterRecipesImplementations(filters) {
    return {
      maps: () => filterRecipesMaps(benchmarkData, "", filters),
      loops: () => filterRecipesLoops(benchmarkData, filters),
      forEach: () => filterRecipesForEach(benchmarkData, "", filters),
      reduce: () => filterRecipesReduce(benchmarkData, "", filters),
      for: () => filterRecipesFor(benchmarkData, "", filters),
      while: () => filterRecipesWhile(benchmarkData, "", filters),
    };
  }

  it("should benchmark filter with all filter types", async () => {
    // Filter configuration
    const filters = {
      ingredients: ["citron", "coco"],
      appliances: ["Blender", "Saladier"],
      ustensils: ["presse citron"],
    };

    // Create implementation functions
    const implementations = createFilterRecipesImplementations(filters);

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
      "Filter with All Filter Types",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with All Filter Types",
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

  it("should benchmark filter with ingredients and appliances", async () => {
    // Filter configuration
    const filters = {
      ingredients: ["poulet", "tomate"],
      appliances: ["Casserole"],
    };

    // Create implementation functions
    const implementations = createFilterRecipesImplementations(filters);

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
      "Filter with Ingredients and Appliances",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with Ingredients and Appliances",
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

  it("should benchmark filter with ingredients and ustensils", async () => {
    // Filter configuration
    const filters = {
      ingredients: ["citron"],
      ustensils: ["presse citron", "cuillère"],
    };

    // Create implementation functions
    const implementations = createFilterRecipesImplementations(filters);

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
      "Filter with Ingredients and Ustensils",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with Ingredients and Ustensils",
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

  it("should benchmark filter with appliances and ustensils", async () => {
    // Filter configuration
    const filters = {
      appliances: ["Four"],
      ustensils: ["couteau"],
    };

    // Create implementation functions
    const implementations = createFilterRecipesImplementations(filters);

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
      "Filter with Appliances and Ustensils",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with Appliances and Ustensils",
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

  it("should benchmark filter with no filters (returns all)", async () => {
    // Empty filter configuration
    const filters = {};

    // Create implementation functions
    const implementations = createFilterRecipesImplementations(filters);

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
      "Filter with No Filters",
      allStats.mapsStats,
      allStats.loopsStats,
      comparison,
    );
    logAllImplementations(allStats, LABELS);
    console.log(`  Fastest: ${findFastest(allStats)}`);

    // Collect benchmark result
    addBenchmarkResult("combined", {
      testCase: "Filter with No Filters",
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
});
