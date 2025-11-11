import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { filterBySearchTerm } from "../../src/components/search/filter.js";
import { filterBySearchTermNative } from "./utils/filter-native.js";
import { compareResults } from "./utils/formatting.js";
import { logBenchmarkSection, logMemoryComparison } from "./utils/logger.js";
import { measureMemoryUsage, runBenchmark } from "./utils/measurement.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load benchmark data
const benchmarkDataPath = join(__dirname, "../../public/api/data-benchmark.json");
const benchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

describe("Search Benchmark Tests", () => {
  const iterations = 100;

  it("should benchmark search with empty query", async () => {
    const searchTerm = "";

    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    logBenchmarkSection("Empty Query Benchmark", functionalStats, nativeStats, comparison);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with short query", async () => {
    const searchTerm = "tomate";

    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    logBenchmarkSection("Short Query Benchmark (tomate)", functionalStats, nativeStats, comparison);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with medium query", async () => {
    const searchTerm = "chocolat noir";

    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    logBenchmarkSection(
      "Medium Query Benchmark (chocolat noir)",
      functionalStats,
      nativeStats,
      comparison,
    );

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with long query", async () => {
    const searchTerm = "recette de poulet avec légumes";

    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    logBenchmarkSection("Long Query Benchmark", functionalStats, nativeStats, comparison);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with non-matching query", async () => {
    const searchTerm = "xyzabc123nonexistent";

    const functionalStats = await runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = await runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    logBenchmarkSection("Non-matching Query Benchmark", functionalStats, nativeStats, comparison);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should measure memory usage for search", () => {
    const searchTerm = "tomate";
    const memoryIterations = 50;

    const functionalMemory = measureMemoryUsage(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, memoryIterations);

    const nativeMemory = measureMemoryUsage(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, memoryIterations);

    logMemoryComparison("Memory Usage Comparison", functionalMemory, nativeMemory);

    // Memory comparison is informational only
    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });
});
