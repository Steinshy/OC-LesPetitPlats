import { afterAll, describe, expect, it } from "vitest";
import {
  runMemoryBenchmark,
  createAllItemsTest,
  createFilterTestCases,
  TEST_CONFIG,
} from "@benchmarks-config/testHelpers.js";
import { uniqueValues } from "@benchmarks-data/loader.js";
import { filterByUstensils as filterByUstensilsMaps } from "@benchmarks-implementations/filtersMap.js";
import { filterByUstensils as filterByUstensilsProduction } from "@benchmarks-implementations/production.js";
import { logCategorySummary } from "@benchmarks-utils/logging.js";

describe("Filter Recipes by Ustensils Benchmarks", () => {
  const { iterations, bigDataIterations } = TEST_CONFIG;
  const availableUstensils = uniqueValues.ustensils;
  const category = "Ustensils";
  const categoryKey = "ustensils";
  const itemName = "ustensils";

  const testCases = createFilterTestCases({
    it,
    productionFn: filterByUstensilsProduction,
    mapsFn: filterByUstensilsMaps,
    availableItems: availableUstensils,
    itemName,
    category,
    categoryKey,
    iterations,
    bigDataIterations,
    expectInstance: expect,
  });

  testCases.forEach(({ test }) => test());

  it("should measure memory usage for ustensils filter", () => {
    runMemoryBenchmark({
      productionFn: filterByUstensilsProduction,
      mapsFn: filterByUstensilsMaps,
      filterValue: availableUstensils.slice(0, 1),
      iterations: 50,
      expectInstance: expect,
    });
  });

  const allUstensilsTest = createAllItemsTest({
    productionFn: filterByUstensilsProduction,
    mapsFn: filterByUstensilsMaps,
    allItems: availableUstensils,
    category,
    categoryKey,
    allTestIterations: 30,
    expectInstance: expect,
  });

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all ustensils",
    allUstensilsTest,
    TEST_CONFIG.timeouts.all,
  );

  afterAll(() => {
    logCategorySummary(categoryKey, category, "All ustensil");
  });
});
