import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import {
  filterByAppliances,
  filterByIngredients,
  filterByUstensils,
} from "../../src/components/search/filter.js";
import {
  filterByAppliancesNative,
  filterByIngredientsNative,
  filterByUstensilsNative,
} from "./utils/filter-native.js";
import { compareResults } from "./utils/formatting.js";
import { logBenchmarkSection, logMemoryUsage, logSection } from "./utils/logger.js";
import { measureMemoryUsage, runBenchmark } from "./utils/measurement.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load benchmark data
const benchmarkDataPath = join(__dirname, "../../public/api/data-benchmark.json");
const benchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

describe("Filter Benchmark Tests", () => {
  const iterations = 100;

  describe("Ingredients Filter", () => {
    it("should benchmark with single ingredient", async () => {
      const selectedIngredients = ["Tomate"];

      const functionalStats = await runBenchmark(() => {
        filterByIngredients(benchmarkData, selectedIngredients);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByIngredientsNative(benchmarkData, selectedIngredients);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Single Ingredient Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
      const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with multiple ingredients", async () => {
      const selectedIngredients = ["Tomate", "Oignon", "Ail"];

      const functionalStats = await runBenchmark(() => {
        filterByIngredients(benchmarkData, selectedIngredients);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByIngredientsNative(benchmarkData, selectedIngredients);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Multiple Ingredients Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
      const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with empty ingredients", async () => {
      const selectedIngredients = [];

      const functionalStats = await runBenchmark(() => {
        filterByIngredients(benchmarkData, selectedIngredients);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByIngredientsNative(benchmarkData, selectedIngredients);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Empty Ingredients Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByIngredients(benchmarkData, selectedIngredients);
      const nativeResult = filterByIngredientsNative(benchmarkData, selectedIngredients);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  describe("Appliances Filter", () => {
    it("should benchmark with single appliance", async () => {
      const selectedAppliances = ["Four"];

      const functionalStats = await runBenchmark(() => {
        filterByAppliances(benchmarkData, selectedAppliances);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByAppliancesNative(benchmarkData, selectedAppliances);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Single Appliance Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
      const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with multiple appliances", async () => {
      const selectedAppliances = ["Four", "Blender", "Casserole"];

      const functionalStats = await runBenchmark(() => {
        filterByAppliances(benchmarkData, selectedAppliances);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByAppliancesNative(benchmarkData, selectedAppliances);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Multiple Appliances Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
      const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with empty appliances", async () => {
      const selectedAppliances = [];

      const functionalStats = await runBenchmark(() => {
        filterByAppliances(benchmarkData, selectedAppliances);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByAppliancesNative(benchmarkData, selectedAppliances);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Empty Appliances Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByAppliances(benchmarkData, selectedAppliances);
      const nativeResult = filterByAppliancesNative(benchmarkData, selectedAppliances);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  describe("Ustensils Filter", () => {
    it("should benchmark with single ustensil", async () => {
      const selectedUstensils = ["couteau"];

      const functionalStats = await runBenchmark(() => {
        filterByUstensils(benchmarkData, selectedUstensils);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByUstensilsNative(benchmarkData, selectedUstensils);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Single Ustensil Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
      const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with multiple ustensils", async () => {
      const selectedUstensils = ["couteau", "saladier", "fouet"];

      const functionalStats = await runBenchmark(() => {
        filterByUstensils(benchmarkData, selectedUstensils);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByUstensilsNative(benchmarkData, selectedUstensils);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Multiple Ustensils Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
      const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
      expect(functionalResult.length).toBe(nativeResult.length);
    });

    it("should benchmark with empty ustensils", async () => {
      const selectedUstensils = [];

      const functionalStats = await runBenchmark(() => {
        filterByUstensils(benchmarkData, selectedUstensils);
      }, iterations);

      const nativeStats = await runBenchmark(() => {
        filterByUstensilsNative(benchmarkData, selectedUstensils);
      }, iterations);

      const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

      logBenchmarkSection("Empty Ustensils Filter", functionalStats, nativeStats, comparison);

      // Verify both produce same results
      const functionalResult = filterByUstensils(benchmarkData, selectedUstensils);
      const nativeResult = filterByUstensilsNative(benchmarkData, selectedUstensils);
      expect(functionalResult.length).toBe(nativeResult.length);
    });
  });

  it("should measure memory usage for filters", () => {
    const memoryIterations = 50;

    logSection("Memory Usage Comparison");

    // Ingredients
    const ingredientsMemoryFunctional = measureMemoryUsage(() => {
      filterByIngredients(benchmarkData, ["Tomate", "Oignon"]);
    }, memoryIterations);

    const ingredientsMemoryNative = measureMemoryUsage(() => {
      filterByIngredientsNative(benchmarkData, ["Tomate", "Oignon"]);
    }, memoryIterations);

    logMemoryUsage("Ingredients Filter", ingredientsMemoryFunctional, ingredientsMemoryNative);

    // Appliances
    const appliancesMemoryFunctional = measureMemoryUsage(() => {
      filterByAppliances(benchmarkData, ["Four"]);
    }, memoryIterations);

    const appliancesMemoryNative = measureMemoryUsage(() => {
      filterByAppliancesNative(benchmarkData, ["Four"]);
    }, memoryIterations);

    logMemoryUsage("Appliances Filter", appliancesMemoryFunctional, appliancesMemoryNative);

    // Ustensils
    const ustensilsMemoryFunctional = measureMemoryUsage(() => {
      filterByUstensils(benchmarkData, ["couteau"]);
    }, memoryIterations);

    const ustensilsMemoryNative = measureMemoryUsage(() => {
      filterByUstensilsNative(benchmarkData, ["couteau"]);
    }, memoryIterations);

    logMemoryUsage("Ustensils Filter", ustensilsMemoryFunctional, ustensilsMemoryNative);

    // Memory comparison is informational only
    expect(typeof ingredientsMemoryFunctional).toBe("number");
    expect(typeof ingredientsMemoryNative).toBe("number");
  });
});
