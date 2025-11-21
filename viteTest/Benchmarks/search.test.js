import { afterAll, describe, expect, it } from "vitest";
import { filterBySearchTerm as filterBySearchTermMaps } from "./utils/filters/filtersMap.js";
import { filterBySearchTerm as filterBySearchTermProduction } from "./utils/filters/production.js";
import { runSearchBenchmark, runMemoryBenchmark, TEST_CONFIG } from "./utils/helper/testHelpers.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("Search Benchmark Tests", () => {
  const { iterations, searchBigDataIterations, timeouts } = TEST_CONFIG;

  const searchTests = [
    { testCase: "Empty", searchTerm: "", timeout: null },
    { testCase: "Short", searchTerm: "tomate", timeout: null },
    { testCase: "Medium", searchTerm: "chocolat noir", timeout: null },
    { testCase: "Long", searchTerm: "recette de poulet avec légumes", timeout: null },
    {
      testCase: "Non-matching",
      searchTerm: "xyzabc123nonexistent",
      timeout: null,
    },
    { testCase: "Single word", searchTerm: "poulet", timeout: null },
    {
      testCase: "Very Long",
      searchTerm: "recette de cuisine française traditionnelle avec ingrédients locaux",
      iterations: searchBigDataIterations,
      timeout: timeouts.small,
    },
    { testCase: "Special Characters", searchTerm: "café & thé", timeout: null },
    { testCase: "Numeric", searchTerm: "30 minutes", timeout: null },
    { testCase: "Partial Match", searchTerm: "choco", timeout: null },
    { testCase: "Case Variation", searchTerm: "POULET", timeout: null },
  ];

  searchTests.forEach(({ testCase, searchTerm, iterations: testIterations, timeout }) => {
    it(
      `should benchmark search with ${testCase.toLowerCase()} query`,
      async () => {
        await runSearchBenchmark({
          testCase,
          searchTerm,
          iterations: testIterations || iterations,
          productionFn: filterBySearchTermProduction,
          mapsFn: filterBySearchTermMaps,
          expectInstance: expect,
        });
      },
      timeout || undefined,
    );
  });

  it("should measure memory usage for search", () => {
    runMemoryBenchmark({
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      filterValue: "tomate",
      iterations: 50,
      expectInstance: expect,
    });
  });

  afterAll(() => {
    logCategorySummary("search", "Search", "All query");
  });
});
