import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  filterByIngredients,
  filterByAppliances,
  filterByUstensils,
} from "../src/components/search/filter.js";
import {
  filterByIngredientsNative,
  filterByAppliancesNative,
  filterByUstensilsNative,
} from "../src/components/search/filter-native.js";
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
const benchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

describe("Filter Benchmark Tests", () => {
  const iterations = 100;

  describe("Ingredients Filter", () => {
    it("should benchmark with single ingredient", () => {
      const selectedIngredients = ["Tomate"];

      const functionalStats = runBenchmark(() => {
        filterByIngredients(benchmarkData, selectedIngredients);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByIngredientsNative(benchmarkData, selectedIngredients);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Single Ingredient Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
      const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with multiple ingredients", () => {
      const selectedIngredients = ["Tomate", "Oignon", "Ail"];

      const functionalStats = runBenchmark(() => {
        filterByIngredients(benchmarkData, selectedIngredients);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByIngredientsNative(benchmarkData, selectedIngredients);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Multiple Ingredients Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
      const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with empty ingredients", () => {
      const selectedIngredients = [];

      const functionalStats = runBenchmark(() => {
        filterByIngredients(benchmarkData, selectedIngredients);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByIngredientsNative(benchmarkData, selectedIngredients);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Empty Ingredients Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
      const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  describe("Appliances Filter", () => {
    it("should benchmark with single appliance", () => {
      const selectedAppliances = ["Four"];

      const functionalStats = runBenchmark(() => {
        filterByAppliances(benchmarkData, selectedAppliances);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByAppliancesNative(benchmarkData, selectedAppliances);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Single Appliance Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
      const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with multiple appliances", () => {
      const selectedAppliances = ["Four", "Blender", "Casserole"];

      const functionalStats = runBenchmark(() => {
        filterByAppliances(benchmarkData, selectedAppliances);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByAppliancesNative(benchmarkData, selectedAppliances);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Multiple Appliances Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
      const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with empty appliances", () => {
      const selectedAppliances = [];

      const functionalStats = runBenchmark(() => {
        filterByAppliances(benchmarkData, selectedAppliances);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByAppliancesNative(benchmarkData, selectedAppliances);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Empty Appliances Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
      const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  describe("Ustensils Filter", () => {
    it("should benchmark with single ustensil", () => {
      const selectedUstensils = ["couteau"];

      const functionalStats = runBenchmark(() => {
        filterByUstensils(benchmarkData, selectedUstensils);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByUstensilsNative(benchmarkData, selectedUstensils);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Single Ustensil Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
      const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with multiple ustensils", () => {
      const selectedUstensils = ["couteau", "saladier", "fouet"];

      const functionalStats = runBenchmark(() => {
        filterByUstensils(benchmarkData, selectedUstensils);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByUstensilsNative(benchmarkData, selectedUstensils);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Multiple Ustensils Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
      const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with empty ustensils", () => {
      const selectedUstensils = [];

      const functionalStats = runBenchmark(() => {
        filterByUstensils(benchmarkData, selectedUstensils);
      }, iterations);

      const nativeStats = runBenchmark(() => {
        filterByUstensilsNative(benchmarkData, selectedUstensils);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      console.log("\n=== Empty Ustensils Filter ===");
      console.log(formatBenchmarkResults(functionalStats, "Functional"));
      console.log(formatBenchmarkResults(nativeStats, "Native"));
      console.log(`\nWinner: ${comparison.faster}`);
      console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

      // Verify both produce same results
      const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
      const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  it("should measure memory usage for filters", () => {
    const memoryIterations = 50;

    console.log("\n=== Memory Usage Comparison ===");

    // Ingredients
    const ingredientsMemoryFunctional = measureMemoryUsage(() => {
      filterByIngredients(benchmarkData, ["Tomate", "Oignon"]);
    }, memoryIterations);

    const ingredientsMemoryNative = measureMemoryUsage(() => {
      filterByIngredientsNative(benchmarkData, ["Tomate", "Oignon"]);
    }, memoryIterations);

    console.log(`Ingredients Filter - Functional: ${formatMemory(ingredientsMemoryFunctional)}`);
    console.log(`Ingredients Filter - Native: ${formatMemory(ingredientsMemoryNative)}`);

    // Appliances
    const appliancesMemoryFunctional = measureMemoryUsage(() => {
      filterByAppliances(benchmarkData, ["Four"]);
    }, memoryIterations);

    const appliancesMemoryNative = measureMemoryUsage(() => {
      filterByAppliancesNative(benchmarkData, ["Four"]);
    }, memoryIterations);

    console.log(`Appliances Filter - Functional: ${formatMemory(appliancesMemoryFunctional)}`);
    console.log(`Appliances Filter - Native: ${formatMemory(appliancesMemoryNative)}`);

    // Ustensils
    const ustensilsMemoryFunctional = measureMemoryUsage(() => {
      filterByUstensils(benchmarkData, ["couteau"]);
    }, memoryIterations);

    const ustensilsMemoryNative = measureMemoryUsage(() => {
      filterByUstensilsNative(benchmarkData, ["couteau"]);
    }, memoryIterations);

    console.log(`Ustensils Filter - Functional: ${formatMemory(ustensilsMemoryFunctional)}`);
    console.log(`Ustensils Filter - Native: ${formatMemory(ustensilsMemoryNative)}`);

    // Memory comparison is informational only
    expect(typeof ingredientsMemoryFunctional).toBe("number");
    expect(typeof ingredientsMemoryNative).toBe("number");
  });
});
