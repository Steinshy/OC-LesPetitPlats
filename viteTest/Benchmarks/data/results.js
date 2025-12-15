export { addBenchmarkResult } from "./collector.js";
import { mean } from "simple-statistics";

// Calculate average execution time for an implementation
export function getAverageExecutionTime(flattenedResults, implementation) {
  const implResults = flattenedResults.filter(result => result.implementation === implementation);
  if (implResults.length === 0) return 0;
  const values = implResults
    .map(result => result.mean || result.executionTime || 0)
    .filter(value => typeof value === "number" && !isNaN(value) && isFinite(value) && value >= 0);
  if (values.length === 0) return 0;
  const result = mean(values);
  return typeof result === "number" && !isNaN(result) && isFinite(result) ? result : 0;
}

// Calculate average RME for an implementation
export function getAverageRME(flattenedResults, implementation) {
  const implResults = flattenedResults.filter(result => result.implementation === implementation);
  if (implResults.length === 0) return 0;
  const values = implResults
    .map(result => result.rme || 0)
    .filter(value => typeof value === "number" && !isNaN(value) && isFinite(value) && value >= 0);
  if (values.length === 0) return 0;
  const result = mean(values);
  return typeof result === "number" && !isNaN(result) && isFinite(result) ? result : 0;
}

// Get unique implementations from flattened results
export function getImplementations(flattenedResults) {
  return [...new Set(flattenedResults.map(result => result.implementation))];
}

// Get test coverage statistics
export function getTestCoverage(categoryResults) {
  const categoryBreakdown = {};
  let totalTests = 0;
  let totalScenarios = 0;

  for (const [category, tests] of Object.entries(categoryResults)) {
    const testCount = Object.keys(tests).length;
    categoryBreakdown[category] = testCount;
    totalTests += testCount;
    totalScenarios += Object.values(tests).reduce(
      (sum, implementations) => sum + Object.keys(implementations).length,
      0,
    );
  }

  return { totalTests, categoryBreakdown, totalScenarios };
}

// Convert flattened results to category-organized format
export function organizeByCategory(flattened) {
  const categoryResults = {};

  flattened.forEach(result => {
    const { category, implementation } = result;
    const testName = result.testName || result.testCase || "Unknown";

    if (!categoryResults[category]) categoryResults[category] = {};
    if (!categoryResults[category][testName]) categoryResults[category][testName] = {};

    categoryResults[category][testName][implementation] = {
      mean: result.mean || result.executionTime || 0,
      executionTime: result.executionTime || result.mean || 0,
      rme: result.rme || 0,
      queryCount: result.queryCount,
      filterCount: result.filterCount,
      ...result,
    };
  });

  return categoryResults;
}
