// Benchmark results collection and persistence
import { writeFileSync, readFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PRODUCTION_LABEL, MAPS_LABEL } from "@benchmarks-config/constants.js";

// Configuration
// Benchmark output directory (Benchmark folder at project root)
const benchmarkDir = join(process.cwd(), "Benchmark");
const tempDir = join(tmpdir(), "lespetitplats-benchmark");
const resultsFilePath = join(tempDir, "benchmark-results.json");

const defaultResults = {
  search: [],
  ingredients: [],
  appliances: [],
  ustensils: [],
  combined: [],
  timestamp: null,
};

const categories = [
  { key: "search", name: "Search" },
  { key: "ingredients", name: "Ingredients" },
  { key: "appliances", name: "Appliances" },
  { key: "ustensils", name: "Ustensils" },
  { key: "combined", name: "Combined" },
];

const statsMapping = [
  { key: "functionalStats", label: PRODUCTION_LABEL },
  { key: "loopStats", label: MAPS_LABEL },
];

// File Operations
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
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(resultsFilePath, JSON.stringify(results, null, 2), "utf-8");
  } catch (error) {
    console.warn("Failed to save benchmark results:", error.message);
  }
}

// Utilities
function getSafeNumber(value) {
  if (typeof value === "number" && !isNaN(value) && isFinite(value)) {
    return value;
  }
  return 0;
}

function getMeanValue(stats) {
  return (
    getSafeNumber(stats.avg) ||
    getSafeNumber(stats.mean) ||
    getSafeNumber(stats.executionTime) ||
    0
  );
}

function getExecutionTime(stats) {
  return (
    getSafeNumber(stats.executionTime) ||
    getSafeNumber(stats.avg) ||
    getSafeNumber(stats.mean) ||
    0
  );
}

function getTestName(result, categoryName, index) {
  return result.testCase || result.testName || `${categoryName} Test ${index + 1}`;
}

// Result Processing
function flattenNewFormat(result, categoryName, index) {
  const flattened = [];
  Object.entries(result.implementations).forEach(([implName, stats]) => {
    flattened.push({
      category: categoryName,
      testName: getTestName(result, categoryName, index),
      implementation: implName,
      mean: getMeanValue(stats),
      executionTime: getExecutionTime(stats),
      rme: getSafeNumber(stats.rme) || 0,
      queryCount: result.queryCount,
      filterCount: result.filterCount,
      ...stats,
    });
  });
  return flattened;
}

function flattenCurrentFormat(result, categoryName, index) {
  const flattened = [];
  statsMapping.forEach(({ key, label }) => {
    const stats = result[key];
    if (stats) {
      flattened.push({
        category: categoryName,
        testName: getTestName(result, categoryName, index),
        implementation: label,
        mean: getMeanValue(stats),
        executionTime: getExecutionTime(stats),
        rme: getSafeNumber(stats.rme) || 0,
        queryCount: result.queryCount,
        filterCount: result.filterCount,
        ...stats,
      });
    }
  });
  return flattened;
}

function flattenCategoryResults(benchmarkResults, category) {
  const flattened = [];
  const { key, name } = category;

  if (!benchmarkResults[key]) {
    return flattened;
  }

  benchmarkResults[key].forEach((result, index) => {
    if (result.implementations) {
      flattened.push(...flattenNewFormat(result, name, index));
    } else {
      flattened.push(...flattenCurrentFormat(result, name, index));
    }
  });

  return flattened;
}

// Public API
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

  categories.forEach(category => {
    flattened.push(...flattenCategoryResults(benchmarkResults, category));
  });

  return flattened;
}

export function clearResults() {
  try {
    if (existsSync(resultsFilePath)) {
      unlinkSync(resultsFilePath);
    }

    const clearFlagPath = join(benchmarkDir, ".benchmark-cleared");
    if (existsSync(clearFlagPath)) {
      unlinkSync(clearFlagPath);
    }
  } catch (_error) {
    // Ignore errors if file doesn't exist or can't be deleted
  }

  saveResults({ ...defaultResults });
}

export function getSummary() {
  const flattened = getFlattenedResults();

  const testCases = {};
  flattened.forEach(result => {
    const key = `${result.category} - ${result.testName}`;
    if (!testCases[key]) {
      testCases[key] = [];
    }
    const timeValue = getMeanValue(result) || getExecutionTime(result) || 0;
    testCases[key].push({
      implementation: result.implementation,
      time: timeValue,
    });
  });

  const winCounts = {};
  Object.values(testCases).forEach(testResults => {
    if (testResults.length > 0) {
      const fastest = testResults.reduce((prev, current) =>
        prev.time < current.time ? prev : current,
      );
      winCounts[fastest.implementation] = (winCounts[fastest.implementation] || 0) + 1;
    }
  });

  const implementations = Object.keys(winCounts);
  const overallWinner = implementations.reduce(
    (prev, current) => (winCounts[current] > (winCounts[prev] || 0) ? current : prev),
    implementations[0] || "Unknown",
  );

  const improvements = [];
  Object.values(testCases).forEach(testResults => {
    if (testResults.length > 1) {
      const times = testResults
        .map(r => r.time)
        .filter(t => typeof t === "number" && !isNaN(t) && isFinite(t) && t > 0);
      if (times.length > 1) {
        const fastest = Math.min(...times);
        const slowest = Math.max(...times);
        if (slowest > 0) {
          improvements.push(((slowest - fastest) / slowest) * 100);
        }
      }
    }
  });

  const averageImprovement =
    improvements.length > 0
      ? improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length
      : 0;

  return {
    totalTests: Object.keys(testCases).length,
    winCounts,
    overallWinner,
    averageImprovement,
  };
}

export function saveResultsData(results) {
  saveResults(results);
}
