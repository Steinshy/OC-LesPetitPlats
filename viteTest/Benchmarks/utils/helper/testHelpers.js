// Shared test helper functions for benchmark tests
import { PRODUCTION_LABEL, MAPS_LABEL } from "../constants.js";
import { benchmarkData } from "../data/paths.js";
import { addBenchmarkResult } from "../data/results.js";
import { logBenchmarkSection, logMemoryComparison } from "../logging/console.js";
import { compareResults } from "../measurement/compare.js";
import { measureMemoryUsage, runBenchmark } from "../measurement/measurement.js";

export async function runAllBenchmarks(implementations, iterations) {
  const productionStats = await runBenchmark(implementations.production, iterations);
  const mapsStats = await runBenchmark(implementations.maps, iterations);

  return { productionStats, mapsStats };
}

export function verifyResults(implementations, expectInstance) {
  const productionResult = implementations.production();
  const mapsResult = implementations.maps();

  const baseLength = productionResult.length;
  expectInstance(baseLength).toBe(mapsResult.length);
}

export function createImplementationFunctions(productionFn, mapsFn, ...args) {
  return {
    production: () => productionFn(...args),
    maps: () => mapsFn(...args),
  };
}

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

// Test configuration constants
export const TEST_CONFIG = {
  iterations: 50,
  bigDataIterations: 150,
  searchBigDataIterations: 100,
  timeouts: {
    small: 60000,
    medium: 90000,
    large: 120000,
    xlarge: 150000,
    all: 600000,
  },
};

// Helper to create filter test cases
export function createFilterTestCases({
  it,
  productionFn,
  mapsFn,
  availableItems,
  itemName,
  category,
  categoryKey,
  iterations,
  bigDataIterations,
  expectInstance,
}) {
  const testCases = [];

  // Empty array test
  testCases.push({
    test: () =>
      it(`should benchmark filter by empty ${itemName} array`, async () => {
        await runFilterBenchmark({
          productionFn,
          mapsFn,
          filterValue: [],
          testCase: `0 ${itemName}`,
          category,
          categoryKey,
          iterations,
          expectInstance,
        });
      }),
  });

  // Multiple items tests (10, 20, 30, 40)
  const counts = [10, 20, 30, 40];
  const timeouts = [
    TEST_CONFIG.timeouts.small,
    TEST_CONFIG.timeouts.medium,
    TEST_CONFIG.timeouts.large,
    TEST_CONFIG.timeouts.xlarge,
  ];

  counts.forEach((count, index) => {
    testCases.push({
      test: () =>
        it(
          `should benchmark filter by multiple ${itemName} (${count})`,
          async () => {
            await runFilterBenchmark({
              productionFn,
              mapsFn,
              filterValue: availableItems.slice(0, count),
              testCase: `${count} ${itemName}`,
              category,
              categoryKey,
              iterations: bigDataIterations,
              expectInstance,
            });
          },
          timeouts[index],
        ),
    });
  });

  return testCases;
}
