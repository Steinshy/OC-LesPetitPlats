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

  // Process each category
  const categories = [
    { key: "search", name: "Search" },
    { key: "ingredients", name: "Ingredients" },
    { key: "appliances", name: "Appliances" },
    { key: "ustensils", name: "Ustensils" },
    { key: "combined", name: "Combined" },
  ];

  categories.forEach(({ key, name }) => {
    if (benchmarkResults[key]) {
      benchmarkResults[key].forEach((result, index) => {
        // Support both old format (functional/native) and new format (implementations object)
        if (result.implementations) {
          // New format: result.implementations is an object with implementation names as keys
          Object.entries(result.implementations).forEach(([implName, stats]) => {
            flattened.push({
              category: name,
              testName: result.testCase || result.testName || `${name} Test ${index + 1}`,
              implementation: implName,
              mean: stats.avg || stats.mean || stats.executionTime || 0,
              executionTime: stats.executionTime || stats.avg || stats.mean || 0,
              rme: stats.rme || 0,
              ...stats, // Include all other stats
            });
          });
        } else {
          // Legacy format: functional and native
          if (result.functionalStats) {
            flattened.push({
              category: name,
              testName: result.testCase || `${name} Test ${index + 1}`,
              implementation: "Functional Programming",
              mean: result.functionalStats.avg || result.functionalStats.mean || 0,
              executionTime: result.functionalStats.executionTime || result.functionalStats.avg || 0,
              rme: result.functionalStats.rme || 0,
              ...result.functionalStats,
            });
          }
          if (result.nativeStats) {
            flattened.push({
              category: name,
              testName: result.testCase || `${name} Test ${index + 1}`,
              implementation: "Native Loops",
              mean: result.nativeStats.avg || result.nativeStats.mean || 0,
              executionTime: result.nativeStats.executionTime || result.nativeStats.avg || 0,
              rme: result.nativeStats.rme || 0,
              ...result.nativeStats,
            });
          }
        }
      });
    }
  });

  return flattened;
}

export function clearResults() {
  saveResults({ ...defaultResults });
}

export function getSummary() {
  const flattened = getFlattenedResults();
  
  // Group by test case to count wins per implementation
  const testCases = {};
  flattened.forEach(result => {
    const key = `${result.category} - ${result.testName}`;
    if (!testCases[key]) {
      testCases[key] = [];
    }
    testCases[key].push({
      implementation: result.implementation,
      time: result.mean || result.executionTime || 0,
    });
  });

  // Count wins per implementation
  const winCounts = {};
  Object.values(testCases).forEach(testResults => {
    if (testResults.length > 0) {
      const fastest = testResults.reduce((prev, current) =>
        prev.time < current.time ? prev : current
      );
      winCounts[fastest.implementation] = (winCounts[fastest.implementation] || 0) + 1;
    }
  });

  // Find overall winner
  const implementations = Object.keys(winCounts);
  const overallWinner = implementations.reduce((prev, current) =>
    winCounts[current] > (winCounts[prev] || 0) ? current : prev,
    implementations[0] || "Unknown"
  );

  // Calculate average improvement (fastest vs slowest per test)
  const improvements = [];
  Object.values(testCases).forEach(testResults => {
    if (testResults.length > 1) {
      const times = testResults.map(r => r.time).filter(t => t > 0);
      if (times.length > 1) {
        const fastest = Math.min(...times);
        const slowest = Math.max(...times);
        if (slowest > 0) {
          improvements.push(((slowest - fastest) / slowest) * 100);
        }
      }
    }
  });

  const averageImprovement = improvements.length > 0
    ? improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length
    : 0;

  return {
    totalTests: Object.keys(testCases).length,
    winCounts,
    overallWinner,
    averageImprovement,
  };
}
