import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { filterBySearchTerm } from "../src/components/search/filter.js";
import { filterBySearchTermNative } from "../src/components/search/filter-native.js";
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

describe("Search Benchmark Tests", () => {
  const iterations = 100;

  it("should benchmark search with empty query", () => {
    const searchTerm = "";

    const functionalStats = runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    console.log("\n=== Empty Query Benchmark ===");
    console.log(formatBenchmarkResults(functionalStats, "Functional"));
    console.log(formatBenchmarkResults(nativeStats, "Native"));
    console.log(`\nWinner: ${comparison.faster}`);
    console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with short query", () => {
    const searchTerm = "tomate";

    const functionalStats = runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    console.log("\n=== Short Query Benchmark (tomate) ===");
    console.log(formatBenchmarkResults(functionalStats, "Functional"));
    console.log(formatBenchmarkResults(nativeStats, "Native"));
    console.log(`\nWinner: ${comparison.faster}`);
    console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with medium query", () => {
    const searchTerm = "chocolat noir";

    const functionalStats = runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    console.log("\n=== Medium Query Benchmark (chocolat noir) ===");
    console.log(formatBenchmarkResults(functionalStats, "Functional"));
    console.log(formatBenchmarkResults(nativeStats, "Native"));
    console.log(`\nWinner: ${comparison.faster}`);
    console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with long query", () => {
    const searchTerm = "recette de poulet avec légumes";

    const functionalStats = runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    console.log("\n=== Long Query Benchmark ===");
    console.log(formatBenchmarkResults(functionalStats, "Functional"));
    console.log(formatBenchmarkResults(nativeStats, "Native"));
    console.log(`\nWinner: ${comparison.faster}`);
    console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

    // Verify both produce same results
    const functionalResult = filterBySearchTerm(benchmarkData, searchTerm);
    const nativeResult = filterBySearchTermNative(benchmarkData, searchTerm);
    expect(functionalResult.length).toBe(nativeResult.length);
  });

  it("should benchmark search with non-matching query", () => {
    const searchTerm = "xyzabc123nonexistent";

    const functionalStats = runBenchmark(() => {
      filterBySearchTerm(benchmarkData, searchTerm);
    }, iterations);

    const nativeStats = runBenchmark(() => {
      filterBySearchTermNative(benchmarkData, searchTerm);
    }, iterations);

    const comparison = compareResults(functionalStats, nativeStats, "Functional", "Native");

    console.log("\n=== Non-matching Query Benchmark ===");
    console.log(formatBenchmarkResults(functionalStats, "Functional"));
    console.log(formatBenchmarkResults(nativeStats, "Native"));
    console.log(`\nWinner: ${comparison.faster}`);
    console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);

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

    console.log("\n=== Memory Usage Comparison ===");
    console.log(`Functional: ${formatMemory(functionalMemory)}`);
    console.log(`Native: ${formatMemory(nativeMemory)}`);

    // Memory comparison is informational only
    expect(typeof functionalMemory).toBe("number");
    expect(typeof nativeMemory).toBe("number");
  });
});
