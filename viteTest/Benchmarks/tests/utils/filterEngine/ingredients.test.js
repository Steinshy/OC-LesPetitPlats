import { afterAll, describe, expect, it } from "vitest";
import {
  runMemoryBenchmark,
  createAllItemsTest,
  createFilterTestCases,
  TEST_CONFIG,
} from "@benchmarks-config/testHelpers.js";
import { uniqueValues } from "@benchmarks-data/loader.js";
import { filterByIngredients as filterByIngredientsMaps } from "@benchmarks-implementations/forEach.js";
import { filterByIngredients as filterByIngredientsProduction } from "@benchmarks-implementations/production.js";
import { logCategorySummary } from "@viteTest-helper/benchmark.js";
import { logWarning } from "@viteTest-helper/message.js";

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
      iterations, // Use config value instead of hardcoded 50
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

  if (process.env.RUN_ALL_TESTS !== "true") {
    logWarning("'All ingredients' test skipped (set RUN_ALL_TESTS=true to run)", "⊘");
  }

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all ingredients",
    allIngredientsTest,
    TEST_CONFIG.timeouts.all,
  );

  afterAll(() => {
    logCategorySummary(categoryKey, category, "All ingredient");
  });
});
