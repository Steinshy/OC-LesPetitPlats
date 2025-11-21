import { afterAll, describe, expect, it } from "vitest";
import { filterBySearchTerm as filterBySearchTermMaps } from "./utils/filters/filtersMap.js";
import { filterBySearchTerm as filterBySearchTermProduction } from "./utils/filters/production.js";
import { runSearchBenchmark, runMemoryBenchmark } from "./utils/helper/testHelpers.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("Search Benchmark Tests", () => {
  // Benchmark iterations count - increased for big data scenarios
  const iterations = 50;
  const bigDataIterations = 100;

  it("should benchmark search with empty query", async () => {
    await runSearchBenchmark({
      testCase: "Empty",
      searchTerm: "",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with short query", async () => {
    await runSearchBenchmark({
      testCase: "Short",
      searchTerm: "tomate",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with medium query", async () => {
    await runSearchBenchmark({
      testCase: "Medium",
      searchTerm: "chocolat noir",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with long query", async () => {
    await runSearchBenchmark({
      testCase: "Long",
      searchTerm: "recette de poulet avec légumes",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with non-matching query", async () => {
    await runSearchBenchmark({
      testCase: "Non-matching",
      searchTerm: "xyzabc123nonexistent",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with single word query (poulet)", async () => {
    await runSearchBenchmark({
      testCase: "Single word",
      searchTerm: "poulet",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with very long query", async () => {
    await runSearchBenchmark({
      testCase: "Very Long",
      searchTerm: "recette de cuisine française traditionnelle avec ingrédients locaux",
      iterations: bigDataIterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with special characters query", async () => {
    await runSearchBenchmark({
      testCase: "Special Characters",
      searchTerm: "café & thé",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with numeric query", async () => {
    await runSearchBenchmark({
      testCase: "Numeric",
      searchTerm: "30 minutes",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with partial match query", async () => {
    await runSearchBenchmark({
      testCase: "Partial Match",
      searchTerm: "choco",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
  });

  it("should benchmark search with case variation query", async () => {
    await runSearchBenchmark({
      testCase: "Case Variation",
      searchTerm: "POULET",
      iterations,
      productionFn: filterBySearchTermProduction,
      mapsFn: filterBySearchTermMaps,
      expectInstance: expect,
    });
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
