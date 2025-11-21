import { afterAll, describe, expect, it } from "vitest";
import { uniqueValues } from "./utils/data/paths.js";
import { filterByIngredients as filterByIngredientsMaps } from "./utils/filters/filtersMap.js";
import { filterByIngredients as filterByIngredientsProduction } from "./utils/filters/production.js";
import {
  runFilterBenchmark,
  runMemoryBenchmark,
  createAllItemsTest,
} from "./utils/helper/testHelpers.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("Filter Recipes by Ingredients Benchmarks", () => {
  // Benchmark iterations count - increased for big data scenarios
  const iterations = 50;
  const bigDataIterations = 150; // Heavier iterations for multiple filter tests

  // Extract available ingredients from benchmark data
  const availableIngredients = uniqueValues.ingredients;

  it("should benchmark filter by empty ingredients array", async () => {
    await runFilterBenchmark({
      productionFn: filterByIngredientsProduction,
      mapsFn: filterByIngredientsMaps,
      filterValue: [],
      testCase: "0 ingredients",
      category: "Ingredients",
      categoryKey: "ingredients",
      iterations,
      expectInstance: expect,
    });
  });

  it("should benchmark filter by multiple ingredients (10)", async () => {
    await runFilterBenchmark({
      productionFn: filterByIngredientsProduction,
      mapsFn: filterByIngredientsMaps,
      filterValue: availableIngredients.slice(0, 10),
      testCase: "10 ingredients",
      category: "Ingredients",
      categoryKey: "ingredients",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 60000); // 1 minute timeout for 10 ingredients test

  it("should benchmark filter by multiple ingredients (20)", async () => {
    await runFilterBenchmark({
      productionFn: filterByIngredientsProduction,
      mapsFn: filterByIngredientsMaps,
      filterValue: availableIngredients.slice(0, 20),
      testCase: "20 ingredients",
      category: "Ingredients",
      categoryKey: "ingredients",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 90000); // 1.5 minutes timeout for 20 ingredients test

  it("should benchmark filter by multiple ingredients (30)", async () => {
    await runFilterBenchmark({
      productionFn: filterByIngredientsProduction,
      mapsFn: filterByIngredientsMaps,
      filterValue: availableIngredients.slice(0, 30),
      testCase: "30 ingredients",
      category: "Ingredients",
      categoryKey: "ingredients",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 120000); // 2 minutes timeout for 30 ingredients test

  it("should benchmark filter by multiple ingredients (40)", async () => {
    await runFilterBenchmark({
      productionFn: filterByIngredientsProduction,
      mapsFn: filterByIngredientsMaps,
      filterValue: availableIngredients.slice(0, 40),
      testCase: "40 ingredients",
      category: "Ingredients",
      categoryKey: "ingredients",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 150000); // 2.5 minutes timeout for 40 ingredients test

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
    category: "Ingredients",
    categoryKey: "ingredients",
    allTestIterations: 30,
    expectInstance: expect,
  });

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all ingredients",
    allIngredientsTest,
    600000,
  ); // 10 minutes timeout for all ingredients test

  afterAll(() => {
    logCategorySummary("ingredients", "Ingredients", "All ingredient");
  });
});
