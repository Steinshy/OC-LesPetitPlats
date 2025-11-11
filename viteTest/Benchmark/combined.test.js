import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { filterRecipesNative } from "./utils/filter-native.js";
import { filterRecipes } from "../../src/components/search/filter.js";
import { compareResults, formatTime } from "./utils/formatting.js";
import {
  logBenchmarkSection,
  logMemoryComparison,
  logRecommendations,
  logReportHeader,
  logSuccess,
} from "./utils/logger.js";
import { measureMemoryUsage, runBenchmark } from "./utils/measurement.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load benchmark data
const benchmarkDataPath = join(__dirname, "../../public/api/data-benchmark.json");
const fullBenchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

// Create subsets for different data sizes
const getDataSubset = (data, size) => {
  return data.slice(0, Math.min(size, data.length));
};

describe("Combined Filters Benchmark Tests", () => {
  const iterations = 100;

  describe("Different Data Sizes", () => {
    const dataSizes = [50, 200, 500, 750];

    dataSizes.forEach(size => {
      it(`should benchmark with ${size} recipes`, async () => {
        const testData = getDataSubset(fullBenchmarkData, size);
        const filters = {
          searchTerm: "tomate",
          ingredients: ["Oignon"],
          appliances: ["Four"],
          ustensils: ["couteau"],
        };

        const functionalStats = await runBenchmark(() => {
          filterRecipes(testData, filters);
        }, iterations);

        const nativeStats = await runBenchmark(() => {
          filterRecipesNative(testData, filters);
        }, iterations);

        const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

        logBenchmarkSection(`${size} Recipes Benchmark`, functionalStats, nativeStats, comparison);

        // Verify both produce same results
        const functionalResult = filterRecipes(testData, filters);
        const nativeResult = filterRecipesNative(testData, filters);
        expect(functionalResult.length).toBe(nativeResult.length);
      });
    });
  });

  describe("Different Filter Combinations", () => {
    it("should benchmark with search term only", async () => {
      const filters = {
        searchTerm: "chocolat",
      };

      const functionalStats = await runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Search Term Only", functionalStats, nativeStats, comparison);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with all filters", async () => {
      const filters = {
        searchTerm: "poulet",
        ingredients: ["Tomate", "Oignon", "Ail"],
        appliances: ["Four", "Casserole"],
        ustensils: ["couteau", "saladier"],
      };

      const functionalStats = await runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("All Filters Combined", functionalStats, nativeStats, comparison);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with ingredients and appliances", async () => {
      const filters = {
        ingredients: ["Tomate", "Oignon"],
        appliances: ["Four"],
      };

      const functionalStats = await runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Ingredients + Appliances", functionalStats, nativeStats, comparison);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with no filters (empty)", async () => {
      const filters = {};

      const functionalStats = await runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("No Filters (Empty)", functionalStats, nativeStats, comparison);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  describe("Edge Cases", () => {
    it("should benchmark with no matches", async () => {
      const filters = {
        searchTerm: "nonexistentxyz123",
        ingredients: ["NonexistentIngredient"],
        appliances: ["NonexistentAppliance"],
        ustensils: ["nonexistentustensil"],
      };

      const functionalStats = await runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("No Matches (Edge Case)", functionalStats, nativeStats, comparison);

      const functionalResult = filterRecipes(fullBenchmarkData, filters);
      const nativeResult = filterRecipesNative(fullBenchmarkData, filters);
      expect(functionalResult.length).toBe(nativeResult.length);
      expect(functionalResult.length).toBe(0);
    });

    it("should benchmark with all matches", async () => {
      const filters = {
        searchTerm: "",
        ingredients: [],
        appliances: [],
        ustensils: [],
      };

      const functionalStats = await runBenchmark(() => {
        filterRecipes(fullBenchmarkData, filters);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterRecipesNative(fullBenchmarkData, filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("All Matches (Edge Case)", functionalStats, nativeStats, comparison);

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

    logMemoryComparison("Combined Filters Memory Usage", functionalMemory, nativeMemory);

    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });

  it("should generate comprehensive summary report", async () => {
    logReportHeader("COMPREHENSIVE BENCHMARK SUMMARY REPORT");

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
    let reportContent = "";

    reportContent += `${"=".repeat(60)}\n`;
    reportContent += "COMPREHENSIVE BENCHMARK SUMMARY REPORT\n";
    reportContent += `${"=".repeat(60)}\n\n`;
    reportContent += `Generated: ${new Date().toISOString()}\n\n`;

    // Use forEach to iterate through test cases
    for (const testCase of testCases) {
      const functionalStats = await runBenchmark(() => {
        filterRecipes(testCase.data, testCase.filters);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterRecipesNative(testCase.data, testCase.filters);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      results.push({
        testCase: testCase.name,
        functional: functionalStats.avg,
        native: nativeStats.avg,
        winner: comparison.faster,
        improvement: comparison.improvement,
        functionalStats,
        nativeStats,
      });

      const testResult = `\n${testCase.name}:\n`;
      const functionalLine = `  Functional: ${formatTime(functionalStats.avg)}\n`;
      const nativeLine = `  Native: ${formatTime(nativeStats.avg)}\n`;
      const winnerLine = `  Winner: ${comparison.faster} (${comparison.improvement.toFixed(2)}% faster)\n`;
      const details = `  Functional Details:\n    Average: ${formatTime(functionalStats.avg)}\n    Min: ${formatTime(functionalStats.min)}\n    Max: ${formatTime(functionalStats.max)}\n    Std Dev: ${formatTime(functionalStats.stdDev)}\n    Ops/sec: ${functionalStats.opsPerSecond.toFixed(2)}\n`;
      const nativeDetails = `  Native Details:\n    Average: ${formatTime(nativeStats.avg)}\n    Min: ${formatTime(nativeStats.min)}\n    Max: ${formatTime(nativeStats.max)}\n    Std Dev: ${formatTime(nativeStats.stdDev)}\n    Ops/sec: ${nativeStats.opsPerSecond.toFixed(2)}\n`;

      console.log(testResult + functionalLine + nativeLine + winnerLine);
      reportContent +=
        testResult + functionalLine + nativeLine + winnerLine + details + nativeDetails;
    }

    // Overall winner
    // Use map to extract winner names, then filter
    const winnerNames = results.map(r => r.winner);
    const functionalWins = winnerNames.filter(winner => winner === "Functional").length;
    const nativeWins = winnerNames.filter(winner => winner === "Native").length;
    const overallWinner = functionalWins > nativeWins ? "Functional" : "Native";

    const summarySection = `\n${"=".repeat(60)}\n`;
    const overallWinnerLine = `OVERALL WINNER: ${overallWinner}\n`;
    const functionalWinsLine = `Functional wins: ${functionalWins}/${results.length}\n`;
    const nativeWinsLine = `Native wins: ${nativeWins}/${results.length}\n`;
    const separator = `${"=".repeat(60)}\n`;

    console.log(
      `${summarySection}${overallWinnerLine}${functionalWinsLine}${nativeWinsLine}${separator}`,
    );
    reportContent += `${summarySection}${overallWinnerLine}${functionalWinsLine}${nativeWinsLine}${separator}`;

    // Recommendations
    let recommendations = "\nRECOMMENDATIONS:\n";
    if (overallWinner === "Native") {
      recommendations += "✓ Native loop implementation is faster overall\n";
      recommendations += "  Consider using native loops for better performance\n";
      logRecommendations(
        "Native loop implementation is faster overall",
        "Consider using native loops for better performance",
      );
    } else {
      recommendations += "✓ Functional programming implementation is faster overall\n";
      recommendations += "  Consider using functional methods for better readability\n";
      logRecommendations(
        "Functional programming implementation is faster overall",
        "Consider using functional methods for better readability",
      );
    }
    reportContent += recommendations;

    // Write report to file
    const benchmarkDir = join(__dirname, "../../Benchmark");
    mkdirSync(benchmarkDir, { recursive: true });
    const reportPath = join(benchmarkDir, "benchmark-report.txt");
    writeFileSync(reportPath, reportContent, "utf-8");

    logSuccess(`Report saved to: ${reportPath}`);

    expect(results.length).toBeGreaterThan(0);
  });
});
