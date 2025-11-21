import { afterAll, describe, expect, it } from "vitest";
import { uniqueValues } from "./utils/data/paths.js";
import { filterByUstensils as filterByUstensilsMaps } from "./utils/filters/filtersMap.js";
import { filterByUstensils as filterByUstensilsProduction } from "./utils/filters/production.js";
import {
  runFilterBenchmark,
  runMemoryBenchmark,
  createAllItemsTest,
} from "./utils/helper/testHelpers.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("Filter Recipes by Ustensils Benchmarks", () => {
  // Benchmark iterations count - increased for big data scenarios
  const iterations = 50;
  const bigDataIterations = 150; // Heavier iterations for multiple filter tests

  // Extract available ustensils from benchmark data
  const availableUstensils = uniqueValues.ustensils;

  it("should benchmark filter by empty ustensils array", async () => {
    await runFilterBenchmark({
      productionFn: filterByUstensilsProduction,
      mapsFn: filterByUstensilsMaps,
      filterValue: [],
      testCase: "0 ustensils",
      category: "Ustensils",
      categoryKey: "ustensils",
      iterations,
      expectInstance: expect,
    });
  });

  it("should benchmark filter by multiple ustensils (10)", async () => {
    await runFilterBenchmark({
      productionFn: filterByUstensilsProduction,
      mapsFn: filterByUstensilsMaps,
      filterValue: availableUstensils.slice(0, 10),
      testCase: "10 ustensils",
      category: "Ustensils",
      categoryKey: "ustensils",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  });

  it("should benchmark filter by multiple ustensils (20)", async () => {
    await runFilterBenchmark({
      productionFn: filterByUstensilsProduction,
      mapsFn: filterByUstensilsMaps,
      filterValue: availableUstensils.slice(0, 20),
      testCase: "20 ustensils",
      category: "Ustensils",
      categoryKey: "ustensils",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  });

  it("should benchmark filter by multiple ustensils (30)", async () => {
    await runFilterBenchmark({
      productionFn: filterByUstensilsProduction,
      mapsFn: filterByUstensilsMaps,
      filterValue: availableUstensils.slice(0, 30),
      testCase: "30 ustensils",
      category: "Ustensils",
      categoryKey: "ustensils",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 120000); // 2 minutes timeout for 30 ustensils test

  it("should benchmark filter by multiple ustensils (40)", async () => {
    await runFilterBenchmark({
      productionFn: filterByUstensilsProduction,
      mapsFn: filterByUstensilsMaps,
      filterValue: availableUstensils.slice(0, 40),
      testCase: "40 ustensils",
      category: "Ustensils",
      categoryKey: "ustensils",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 150000); // 2.5 minutes timeout for 40 ustensils test

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
    category: "Ustensils",
    categoryKey: "ustensils",
    allTestIterations: 30,
    expectInstance: expect,
  });

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all ustensils",
    allUstensilsTest,
    600000,
  ); // 10 minutes timeout for all ustensils test

  afterAll(() => {
    logCategorySummary("ustensils", "Ustensils", "All ustensil");
  });
});
