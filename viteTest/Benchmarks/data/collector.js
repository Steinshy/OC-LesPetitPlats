// Benchmark results collection and persistence
import { PRODUCTION_LABEL, MAPS_LABEL } from "@benchmarks-config/constants.js";
import { readFile, writeFile, pathExists, deleteFile, ensureDirectory } from "@viteTest-helper/fileSystem.js";
import { logWarning } from "@viteTest-helper/message.js";
import { getBenchmarkResultsFilePath, getTempDir } from "@viteTest-helper/paths.js";

// Configuration
const resultsFilePath = getBenchmarkResultsFilePath();

const defaultResults = {
  search: [],
  ingredients: [],
  appliances: [],
  utensils: [],
  combined: [],
  timestamp: null,
};

const categories = [
  { key: "search", name: "Search" },
  { key: "ingredients", name: "Ingredients" },
  { key: "appliances", name: "Appliances" },
  { key: "utensils", name: "Utensils" },
  { key: "combined", name: "Combined" },
];

const statsMapping = [
  { key: "functionalStats", label: PRODUCTION_LABEL },
  { key: "loopStats", label: MAPS_LABEL },
];

// File Operations
function loadResults() {
  if (pathExists(resultsFilePath)) {
    try {
      const data = readFile(resultsFilePath);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      logWarning(`Failed to load benchmark results: ${error.message}`);
      return { ...defaultResults };
    }
  }
  return { ...defaultResults };
}

function saveResults(results) {
  try {
    const tempDir = getTempDir();
    ensureDirectory(tempDir);
    writeFile(resultsFilePath, JSON.stringify(results, null, 2));
  } catch (error) {
    logWarning(`Failed to save benchmark results: ${error.message}`);
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
      const meanValue = getMeanValue(stats);
      flattened.push({
        category: categoryName,
        testName: getTestName(result, categoryName, index),
        implementation: label,
        mean: meanValue,
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
  deleteFile(resultsFilePath);
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
    const rmeValue = getSafeNumber(result.rme) || 0;
    const minValue = getSafeNumber(result.min) || 0;
    const maxValue = getSafeNumber(result.max) || 0;
    const stdDevValue = getSafeNumber(result.stdDev) || 0;
    const rangeValue = maxValue > minValue ? maxValue - minValue : 0;

    testCases[key].push({
      implementation: result.implementation,
      time: timeValue,
      rme: rmeValue,
      min: minValue,
      max: maxValue,
      stdDev: stdDevValue,
      range: rangeValue,
    });
  });

  const winCounts = {};
  Object.values(testCases).forEach(testResults => {
    if (testResults.length > 0) {
      // Calculate composite score considering multiple factors:
      // 1. Time (mean) - primary factor
      // 2. RME (Relative Measurement Error) - consistency measure
      // 3. Standard Deviation - variance measure
      // 4. Max time - worst case performance (stability)
      // 5. Range (max - min) - performance spread (stability)
      // Lower score is better
      const getScore = result => {
        const time = result.time || 0;
        const rme = result.rme || 0;
        const stdDev = result.stdDev || 0;
        const maxTime = result.max || 0;
        const range = result.range || 0;

        // Normalize factors relative to time to avoid over-weighting
        // Weight: time (100%), RME (10%), stdDev (5%), maxTime (5%), range (2%)
        const rmeWeight = time > 0 ? (rme / 100) * time * 0.1 : 0;
        const stdDevWeight = stdDev * 0.05;
        const maxTimeWeight = maxTime > time ? (maxTime - time) * 0.05 : 0;
        const rangeWeight = range * 0.02;

        return time + rmeWeight + stdDevWeight + maxTimeWeight + rangeWeight;
      };

      const winner = testResults.reduce((prev, current) => {
        const prevScore = getScore(prev);
        const currentScore = getScore(current);

        // If scores are very close (within 1%), use tiebreakers:
        // 1. Lower RME (more consistent)
        // 2. Lower stdDev (less variance)
        // 3. Lower max time (better worst case)
        // 4. Lower range (more stable)
        if (Math.abs(prevScore - currentScore) / Math.max(prevScore, currentScore, 0.0001) < 0.01) {
          if (Math.abs(prev.rme - current.rme) > 0.01) {
            return prev.rme < current.rme ? prev : current;
          }
          if (Math.abs(prev.stdDev - current.stdDev) > 0.0001) {
            return prev.stdDev < current.stdDev ? prev : current;
          }
          if (Math.abs(prev.max - current.max) > 0.0001) {
            return prev.max < current.max ? prev : current;
          }
          if (Math.abs(prev.range - current.range) > 0.0001) {
            return prev.range < current.range ? prev : current;
          }
        }

        return currentScore < prevScore ? current : prev;
      });

      winCounts[winner.implementation] = (winCounts[winner.implementation] || 0) + 1;
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
