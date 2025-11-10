import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { filterRecipes } from "../src/components/search/filter.js";
import { filterRecipesNative } from "../src/components/search/filter-native.js";
import {
  runBenchmark,
  measureMemoryUsage,
  formatTime,
  formatMemory,
  compareResults,
  formatBenchmarkResults,
} from "./utils/benchmark.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load benchmark data
const benchmarkDataPath = join(__dirname, "../public/api/data-benchmark.json");
const fullBenchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

// Create subsets for different data sizes
const getDataSubset = (data, size) => {
  return data.slice(0, Math.min(size, data.length));
};

describe("Combined Filters Benchmark Tests", () => {
  const iterations = 100;

  describe("Different Data Sizes", () => {
    const dataSizes = [50, 200, 500, 750];

    dataSizes.forEach((size) => {
      it(`should benchmark with ${size} recipes`, () => {
        const testData = getDataSubset(fullBenchmarkData, size);
        const filters = {
          searchTerm: "tomate",
          ingredients: ["Oignon"],
          appliances: ["Four"],
          ustensils: ["couteau"],
        };

        const functionalStats = runBenchmark(() => {
          filterRecipes(testData, filters);
        }, iterations);

        const nativeStats = runBenchmark(() => {
          filterRecipesNative(testData, filters);
        }, iterations);

        const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

        console.log(`\n=== ${size} Recipes Benchmark ===`);
        console.log(formatBenchmarkResults(functionalStats, "Functional"));
        console.log(formatBenchmarkResults(nativeStats, "Native"));
        console.log(`\nWinner: ${comparison.faster}`);
        console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

        // Verify both produce same results
        const functionalResult = filterRecipes(testData, filters);
        const nativeResult = filterRecipesNative(testData, filters);
        expect(functionalResult.length).toBe(nativeResult.length);
      });
    });
  });

  describe("Different Filter Combinations", () => {
    it("should benchmark with search term only", () => {
      const filters = {
        searchTerm: "chocolat",
      };

      const functionalStats = runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Search Term Only ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with all filters", () => {
      const filters = {
        searchTerm: "poulet",
        ingredients: ["Tomate", "Oignon", "Ail"],
        appliances: ["Four", "Casserole"],
        ustensils: ["couteau", "saladier"],
      };

      const functionalStats = runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== All Filters Combined ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with ingredients and appliances", () => {
      const filters = {
        ingredients: ["Tomate", "Oignon"],
        appliances: ["Four"],
      };

      const functionalStats = runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Ingredients + Appliances ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with no filters (empty)", () => {
      const filters = {};

      const functionalStats = runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== No Filters (Empty) ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  describe("Edge Cases", () => {
    it("should benchmark with no matches", () => {
      const filters = {
        searchTerm: "nonexistentxyz123",
        ingredients: ["NonexistentIngredient"],
        appliances: ["NonexistentAppliance"],
        ustensils: ["nonexistentustensil"],
      };

      const functionalStats = runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== No Matches (Edge Case) ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
      expect(functionalResult.length).toBe(0);
    });

    it("should benchmark with all matches", () => {
      const filters = {
        searchTerm: "",
        ingredients: [],
        appliances: [],
        ustensils: [],
      };

      const functionalStats = runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== All Matches (Edge Case) ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
      expect(functionalResult.length).toBe(fullBenchmarkData.length);
    });
  });

  it("should measure memory usage for combined filters", () => {
    const memoryIterations = 50;
    const filters = {
      searchTerm: "tomate",
      ingredients: ["Oignon"],
      appliances: ["Four"],
      ustensils: ["couteau"],
    };

    const functionalMemory = measureMemoryUsage(() => {
      filterRecipes(fullBenchmarkData, filters);
    }, memoryIterations);

    const nativeMemory = measureMemoryUsage(() => {
      filterRecipesNative(fullBenchmarkData, filters);
    }, memoryIterations);

    console.log("\n=== Combined Filters Memory Usage ===");
    console.log(`Functional: ${formatMemory(functionalMemory)}`);
    console.log(`Native: ${formatMemory(nativeMemory)}`);

    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });

  it("should generate comprehensive summary report", () => {
    console.log("\n" + "=".repeat(60));
    console.log("COMPREHENSIVE BENCHMARK SUMMARY REPORT");
    console.log("=".repeat(60));

    const testCases = [
      {
        name: "Small dataset (50 recipes)",
        data: getDataSubset(fullBenchmarkData, 50),
        filters: { searchTerm: "tomate" },
      },
      {
        name: "Medium dataset (200 recipes)",
        data: getDataSubset(fullBenchmarkData, 200),
        filters: { searchTerm: "tomate", ingredients: ["Oignon"] },
      },
      {
        name: "Large dataset (500 recipes)",
        data: getDataSubset(fullBenchmarkData, 500),
        filters: {
          searchTerm: "poulet",
          ingredients: ["Tomate", "Oignon"],
          appliances: ["Four"],
        },
      },
      {
        name: "Full dataset (750 recipes)",
        data: fullBenchmarkData,
        filters: {
          searchTerm: "chocolat",
          ingredients: ["Tomate", "Oignon", "Ail"],
          appliances: ["Four", "Casserole"],
          ustensils: ["couteau"],
        },
      },
    ];

    const results = [];

    testCases.forEach((testCase) => {
      const functionalStats = runBenchmark(() => {
        filterRecipes(testCase.data, testCase.filters);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterRecipesNative(testCase.data, testCase.filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      results.push({
        testCase: testCase.name,
        functional: functionalStats.avg,
        native: nativeStats.avg,
        winner: comparison.faster,
        improvement: comparison.improvement,
      });

      console.log(`\n${testCase.name}:`);
      console.log(`  Functional: ${formatTime(functionalStats.avg)}`);
      console.log(`  Native: ${formatTime(nativeStats.avg)}`);
      console.log(`  Winner: ${comparison.faster} (${comparison.improvement.toFixed(2)}% faster)`);
    });

    // Overall winner
    const functionalWins = results.filter((r) => r.winner === "Functional").length;
    const nativeWins = results.filter((r) => r.winner === "Native").length;
    const overallWinner = functionalWins > nativeWins ? "Functional" : "Native";

    console.log("\n" + "=".repeat(60));
    console.log("OVERALL WINNER:", overallWinner);
    console.log(`Functional wins: ${functionalWins}/${results.length}`);
    console.log(`Native wins: ${nativeWins}/${results.length}`);
    console.log("=".repeat(60));

    // Recommendations
    console.log("\nRECOMMENDATIONS:");
    if (overallWinner === "Native") {
      console.log("✓ Native loop implementation is faster overall");
      console.log("  Consider using native loops for better performance");
    } else {
      console.log("✓ Functional programming implementation is faster overall");
      console.log("  Consider using functional methods for better readability");
    }

    expect(results.length).toBeGreaterThan(0);
  });
});
