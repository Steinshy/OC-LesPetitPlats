import { afterAll, describe, expect, it } from "vitest";
import {
  runMemoryBenchmark,
  createAllItemsTest,
  createFilterTestCases,
  TEST_CONFIG,
} from "@benchmarks-config/testHelpers.js";
import { uniqueValues } from "@benchmarks-data/loader.js";
import { filterByutensils as filterByutensilsMaps } from "@benchmarks-implementations/filtersMap.js";
import { filterByutensils as filterByutensilsProduction } from "@benchmarks-implementations/production.js";
import { logCategorySummary } from "@benchmarks-utils/logging.js";

describe("Filter Recipes by utensils Benchmarks", () => {
  const { iterations, bigDataIterations } = TEST_CONFIG;
  const availableutensils = uniqueValues.utensils;
  const category = "utensils";
  const categoryKey = "utensils";
  const itemName = "utensils";

  const testCases = createFilterTestCases({
    it,
    productionFn: filterByutensilsProduction,
    mapsFn: filterByutensilsMaps,
    availableItems: availableutensils,
    itemName,
    category,
    categoryKey,
    iterations,
    bigDataIterations,
    expectInstance: expect,
  });

  testCases.forEach(({ test }) => test());

  it("should measure memory usage for utensils filter", () => {
    runMemoryBenchmark({
      productionFn: filterByutensilsProduction,
      mapsFn: filterByutensilsMaps,
      filterValue: availableutensils.slice(0, 1),
      iterations: 50,
      expectInstance: expect,
    });
  });

  const allutensilsTest = createAllItemsTest({
    productionFn: filterByutensilsProduction,
    mapsFn: filterByutensilsMaps,
    allItems: availableutensils,
    category,
    categoryKey,
    allTestIterations: 30,
    expectInstance: expect,
  });

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all utensils",
    allutensilsTest,
    TEST_CONFIG.timeouts.all,
  );

  afterAll(() => {
    logCategorySummary(categoryKey, category, "All ustensil");
  });
});
