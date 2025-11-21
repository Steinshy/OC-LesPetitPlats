// Shared test helper functions for benchmark tests
import { PRODUCTION_LABEL, MAPS_LABEL } from "../constants.js";
import { benchmarkData } from "../data/paths.js";
import { addBenchmarkResult } from "../data/results.js";
import { logBenchmarkSection, logMemoryComparison } from "../logging/console.js";
import { compareResults } from "../measurement/compare.js";
import { measureMemoryUsage, runBenchmark } from "../measurement/measurement.js";

/**
 * Run benchmarks for both implementations
 * @param {Object} implementations - Object with production and maps functions
 * @param {number} iterations - Number of iterations to run
 * @returns {Promise<Object>} Object with productionStats and mapsStats
 */
export async function runAllBenchmarks(implementations, iterations) {
  const productionStats = await runBenchmark(implementations.production, iterations);
  const mapsStats = await runBenchmark(implementations.maps, iterations);

  return { productionStats, mapsStats };
}

/**
 * Verify that both implementations return the same result length
 * @param {Object} implementations - Object with production and maps functions
 * @param {Function} expectInstance - Vitest expect function
 */
export function verifyResults(implementations, expectInstance) {
  const productionResult = implementations.production();
  const mapsResult = implementations.maps();

  const baseLength = productionResult.length;
  expectInstance(baseLength).toBe(mapsResult.length);
}

/**
 * Create implementation functions object for a filter function
 * @param {Function} productionFn - Production filter function
 * @param {Function} mapsFn - Maps filter function
 * @param {...any} args - Arguments to pass to the filter functions
 * @returns {Object} Object with production and maps functions
 */
export function createImplementationFunctions(productionFn, mapsFn, ...args) {
  return {
    production: () => productionFn(...args),
    maps: () => mapsFn(...args),
  };
}

/**
 * Run a filter benchmark test
 * @param {Object} config - Configuration object
 * @param {Function} config.productionFn - Production filter function
 * @param {Function} config.mapsFn - Maps filter function
 * @param {string|Array} config.filterValue - Filter value (array for filters, string for search)
 * @param {string} config.testCase - Test case name
 * @param {string} config.category - Category name (e.g., "Ingredients", "Appliances")
 * @param {string} config.categoryKey - Category key for results (e.g., "ingredients", "appliances")
 * @param {number} config.iterations - Number of iterations
 * @param {Function} config.expectInstance - Vitest expect function
 * @returns {Promise<void>}
 */
export async function runFilterBenchmark({
  productionFn,
  mapsFn,
  filterValue,
  testCase,
  category,
  categoryKey,
  iterations,
  expectInstance,
}) {
  const implementations = createImplementationFunctions(
    productionFn,
    mapsFn,
    benchmarkData,
    filterValue,
  );

  const allStats = await runAllBenchmarks(implementations, iterations);
  const comparison = compareResults(
    allStats.productionStats,
    allStats.mapsStats,
    PRODUCTION_LABEL,
    MAPS_LABEL,
  );

  logBenchmarkSection(testCase, allStats.productionStats, allStats.mapsStats, comparison, category);

  const isArray = Array.isArray(filterValue);
  addBenchmarkResult(categoryKey, {
    testCase,
    filterCount: isArray ? filterValue.length : undefined,
    queryCount: !isArray ? filterValue.length : undefined,
    functionalStats: allStats.productionStats,
    loopStats: allStats.mapsStats,
    comparison,
  });

  verifyResults(implementations, expectInstance);
}

/**
 * Run a search benchmark test
 * @param {Object} config - Configuration object
 * @param {Function} config.productionFn - Production search function
 * @param {Function} config.mapsFn - Maps search function
 * @param {string} config.searchTerm - Search term
 * @param {string} config.testCase - Test case name
 * @param {number} config.iterations - Number of iterations
 * @param {Function} config.expectInstance - Vitest expect function
 * @returns {Promise<void>}
 */
export async function runSearchBenchmark({
  productionFn,
  mapsFn,
  searchTerm,
  testCase,
  iterations,
  expectInstance,
}) {
  await runFilterBenchmark({
    productionFn,
    mapsFn,
    filterValue: searchTerm,
    testCase,
    category: "Search",
    categoryKey: "search",
    iterations,
    expectInstance,
  });
}

/**
 * Run a memory usage benchmark test
 * @param {Object} config - Configuration object
 * @param {Function} config.productionFn - Production filter function
 * @param {Function} config.mapsFn - Maps filter function
 * @param {string|Array} config.filterValue - Filter value
 * @param {number} config.iterations - Number of iterations (default: 50)
 * @param {Function} config.expectInstance - Vitest expect function
 */
export function runMemoryBenchmark({
  productionFn,
  mapsFn,
  filterValue,
  iterations = 50,
  expectInstance,
}) {
  const productionMemory = measureMemoryUsage(() => {
    productionFn(benchmarkData, filterValue);
  }, iterations);

  const mapsMemory = measureMemoryUsage(() => {
    mapsFn(benchmarkData, filterValue);
  }, iterations);

  logMemoryComparison("Memory Usage Comparison", productionMemory, mapsMemory);

  expectInstance(typeof productionMemory).toBe("number");
  expectInstance(typeof mapsMemory).toBe("number");
}

/**
 * Run a filter benchmark test with "All" items (conditionally)
 * @param {Object} config - Configuration object
 * @param {Function} config.productionFn - Production filter function
 * @param {Function} config.mapsFn - Maps filter function
 * @param {Array} config.allItems - All available items
 * @param {string} config.category - Category name
 * @param {string} config.categoryKey - Category key for results
 * @param {number} config.allTestIterations - Number of iterations for "all" test (default: 30)
 * @param {Function} config.expectInstance - Vitest expect function
 * @returns {Function} - Test function to be called with it() or it.skip()
 */
export function createAllItemsTest({
  productionFn,
  mapsFn,
  allItems,
  category,
  categoryKey,
  allTestIterations = 30,
  expectInstance,
}) {
  return async () => {
    const testCase = `All ${category.toLowerCase()} (${allItems.length})`;

    await runFilterBenchmark({
      productionFn,
      mapsFn,
      filterValue: allItems,
      testCase,
      category,
      categoryKey,
      iterations: allTestIterations,
      expectInstance,
    });
  };
}
