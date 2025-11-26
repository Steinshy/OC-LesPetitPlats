import { afterAll, describe, expect, it } from "vitest";
import { uniqueValues } from "./utils/data/paths.js";
import { filterByIngredients as filterByIngredientsMaps } from "./utils/filters/filtersMap.js";
import { filterByIngredients as filterByIngredientsProduction } from "./utils/filters/production.js";
import {
  runMemoryBenchmark,
  createAllItemsTest,
  createFilterTestCases,
  TEST_CONFIG,
} from "./utils/helper/testHelpers.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("Filter Recipes by Ingredients Benchmarks", () => {
  const { iterations, bigDataIterations } = TEST_CONFIG;
  const availableIngredients = uniqueValues.ingredients;
  const category = "Ingredients";
  const categoryKey = "ingredients";
  const itemName = "ingredients";

  const testCases = createFilterTestCases({
    it,
    productionFn: filterByIngredientsProduction,
    mapsFn: filterByIngredientsMaps,
    availableItems: availableIngredients,
    itemName,
    category,
    categoryKey,
    iterations,
    bigDataIterations,
    expectInstance: expect,
  });

  testCases.forEach(({ test }) => test());

  it("should measure memory usage for ingredients filter", () => {
    runMemoryBenchmark({
      productionFn: filterByIngredientsProduction,
      mapsFn: filterByIngredientsMaps,
      filterValue: availableIngredients.slice(0, 1),
      iterations: 50,
      expectInstance: expect,
    });
  });

  const allIngredientsTest = createAllItemsTest({
    productionFn: filterByIngredientsProduction,
    mapsFn: filterByIngredientsMaps,
    allItems: availableIngredients,
    category,
    categoryKey,
    allTestIterations: 30,
    expectInstance: expect,
  });

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all ingredients",
    allIngredientsTest,
    TEST_CONFIG.timeouts.all,
  );

  afterAll(() => {
    logCategorySummary(categoryKey, category, "All ingredient");
  });
});
