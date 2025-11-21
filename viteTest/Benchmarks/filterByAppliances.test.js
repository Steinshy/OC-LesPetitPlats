import { afterAll, describe, expect, it } from "vitest";
import { uniqueValues } from "./utils/data/paths.js";
import { filterByAppliances as filterByAppliancesMaps } from "./utils/filters/filtersMap.js";
import { filterByAppliances as filterByAppliancesProduction } from "./utils/filters/production.js";
import {
  runFilterBenchmark,
  runMemoryBenchmark,
  createAllItemsTest,
  createFilterTestCases,
  TEST_CONFIG,
} from "./utils/helper/testHelpers.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("Filter Recipes by Appliances Benchmarks", () => {
  const { iterations, bigDataIterations } = TEST_CONFIG;
  const availableAppliances = uniqueValues.appliances;
  const category = "Appliances";
  const categoryKey = "appliances";
  const itemName = "appliances";

  const testCases = createFilterTestCases({
    it,
    productionFn: filterByAppliancesProduction,
    mapsFn: filterByAppliancesMaps,
    availableItems: availableAppliances,
    itemName,
    category,
    categoryKey,
    iterations,
    bigDataIterations,
    expectInstance: expect,
  });

  testCases.forEach(({ test }) => test());

  it("should measure memory usage for appliances filter", () => {
    runMemoryBenchmark({
      productionFn: filterByAppliancesProduction,
      mapsFn: filterByAppliancesMaps,
      filterValue: availableAppliances.slice(0, 1),
      iterations: 50,
      expectInstance: expect,
    });
  });

  const allAppliancesTest = createAllItemsTest({
    productionFn: filterByAppliancesProduction,
    mapsFn: filterByAppliancesMaps,
    allItems: availableAppliances,
    category,
    categoryKey,
    allTestIterations: 30,
    expectInstance: expect,
  });

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all appliances",
    allAppliancesTest,
    TEST_CONFIG.timeouts.all,
  );

  afterAll(() => {
    logCategorySummary(categoryKey, category, "All appliance");
  });
});
