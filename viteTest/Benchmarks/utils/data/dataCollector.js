import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const benchmarkDir = join(__dirname, "../../../../Benchmark");
const resultsFilePath = join(benchmarkDir, "benchmark-results.json");

const defaultResults = {
  search: [],
  ingredients: [],
  appliances: [],
  ustensils: [],
  combined: [],
  timestamp: null,
};

function loadResults() {
  if (existsSync(resultsFilePath)) {
    try {
      const data = readFileSync(resultsFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.warn("Failed to load benchmark results:", error.message);
      return { ...defaultResults };
    }
  }
  return { ...defaultResults };
}

function saveResults(results) {
  try {
    // Ensure Benchmark directory exists
    mkdirSync(benchmarkDir, { recursive: true });
    writeFileSync(resultsFilePath, JSON.stringify(results, null, 2), "utf-8");
  } catch (error) {
    console.warn("Failed to save benchmark results:", error.message);
  }
}

export function addBenchmarkResult(category, result) {
  const benchmarkResults = loadResults();
  if (!benchmarkResults[category]) {
    benchmarkResults[category] = [];
  }
  benchmarkResults[category].push(result);
  saveResults(benchmarkResults);
}

export function setTimestamp(timestamp) {
  const benchmarkResults = loadResults();
  benchmarkResults.timestamp = timestamp;
  saveResults(benchmarkResults);
}

export function getAllResults() {
  return loadResults();
}

export function getFlattenedResults() {
  const benchmarkResults = loadResults();
  const flattened = [];

  benchmarkResults.search.forEach((result, index) => {
    flattened.push({
      category: "Search",
      testCase: result.testCase || `Search Test ${index + 1}`,
      functional: result.functionalStats,
      native: result.nativeStats,
      winner: result.comparison?.faster || "Unknown",
      improvement: result.comparison?.improvement || 0,
    });
  });

  benchmarkResults.ingredients.forEach((result, index) => {
    flattened.push({
      category: "Ingredients",
      testCase: result.testCase || `Ingredients Test ${index + 1}`,
      functional: result.functionalStats,
      native: result.nativeStats,
      winner: result.comparison?.faster || "Unknown",
      improvement: result.comparison?.improvement || 0,
    });
  });

  benchmarkResults.appliances.forEach((result, index) => {
    flattened.push({
      category: "Appliances",
      testCase: result.testCase || `Appliances Test ${index + 1}`,
      functional: result.functionalStats,
      native: result.nativeStats,
      winner: result.comparison?.faster || "Unknown",
      improvement: result.comparison?.improvement || 0,
    });
  });

  benchmarkResults.ustensils.forEach((result, index) => {
    flattened.push({
      category: "Ustensils",
      testCase: result.testCase || `Ustensils Test ${index + 1}`,
      functional: result.functionalStats,
      native: result.nativeStats,
      winner: result.comparison?.faster || "Unknown",
      improvement: result.comparison?.improvement || 0,
    });
  });

  benchmarkResults.combined.forEach((result, index) => {
    flattened.push({
      category: "Combined",
      testCase: result.testCase || `Combined Test ${index + 1}`,
      functional: result.functionalStats,
      native: result.nativeStats,
      winner: result.comparison?.faster || "Unknown",
      improvement: result.comparison?.improvement || 0,
    });
  });

  return flattened;
}

export function clearResults() {
  saveResults({ ...defaultResults });
}

export function getSummary() {
  const flattened = getFlattenedResults();
  const functionalWins = flattened.filter(r => r.winner.includes("Functional Programming")).length;
  const nativeWins = flattened.filter(r => r.winner.includes("Native Loops")).length;

  return {
    totalTests: flattened.length,
    functionalWins,
    nativeWins,
    overallWinner: functionalWins > nativeWins ? "Functional Programming" : "Native Loops",
    averageImprovement: flattened.reduce((sum, r) => sum + r.improvement, 0) / flattened.length,
  };
}
