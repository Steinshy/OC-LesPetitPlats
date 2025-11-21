import { afterAll, describe, expect, it } from "vitest";
import { uniqueValues } from "./utils/data/paths.js";
import { filterByAppliances as filterByAppliancesMaps } from "./utils/filters/filtersMap.js";
import { filterByAppliances as filterByAppliancesProduction } from "./utils/filters/production.js";
import {
  runFilterBenchmark,
  runMemoryBenchmark,
  createAllItemsTest,
} from "./utils/helper/testHelpers.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("Filter Recipes by Appliances Benchmarks", () => {
  // Benchmark iterations count - increased for big data scenarios
  const iterations = 50;
  const bigDataIterations = 150; // Heavier iterations for multiple filter tests

  // Extract available appliances from benchmark data
  const availableAppliances = uniqueValues.appliances;

  it("should benchmark filter by empty appliances array", async () => {
    await runFilterBenchmark({
      productionFn: filterByAppliancesProduction,
      mapsFn: filterByAppliancesMaps,
      filterValue: [],
      testCase: "0 appliances",
      category: "Appliances",
      categoryKey: "appliances",
      iterations,
      expectInstance: expect,
    });
  });

  it("should benchmark filter by multiple appliances (10)", async () => {
    await runFilterBenchmark({
      productionFn: filterByAppliancesProduction,
      mapsFn: filterByAppliancesMaps,
      filterValue: availableAppliances.slice(0, 10),
      testCase: "10 appliances",
      category: "Appliances",
      categoryKey: "appliances",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  });

  it("should benchmark filter by multiple appliances (20)", async () => {
    await runFilterBenchmark({
      productionFn: filterByAppliancesProduction,
      mapsFn: filterByAppliancesMaps,
      filterValue: availableAppliances.slice(0, 20),
      testCase: "20 appliances",
      category: "Appliances",
      categoryKey: "appliances",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  });

  it("should benchmark filter by multiple appliances (30)", async () => {
    await runFilterBenchmark({
      productionFn: filterByAppliancesProduction,
      mapsFn: filterByAppliancesMaps,
      filterValue: availableAppliances.slice(0, 30),
      testCase: "30 appliances",
      category: "Appliances",
      categoryKey: "appliances",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 120000); // 2 minutes timeout for 30 appliances test

  it("should benchmark filter by multiple appliances (40)", async () => {
    await runFilterBenchmark({
      productionFn: filterByAppliancesProduction,
      mapsFn: filterByAppliancesMaps,
      filterValue: availableAppliances.slice(0, 40),
      testCase: "40 appliances",
      category: "Appliances",
      categoryKey: "appliances",
      iterations: bigDataIterations,
      expectInstance: expect,
    });
  }, 150000); // 2.5 minutes timeout for 40 appliances test

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
    category: "Appliances",
    categoryKey: "appliances",
    allTestIterations: 30,
    expectInstance: expect,
  });

  (process.env.RUN_ALL_TESTS === "true" ? it : it.skip)(
    "should benchmark filter by all appliances",
    allAppliancesTest,
    600000,
  ); // 10 minutes timeout for all appliances test

  afterAll(() => {
    logCategorySummary("appliances", "Appliances", "All appliance");
  });
});
