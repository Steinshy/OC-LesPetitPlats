export { addBenchmarkResult } from "./dataCollector.js";

// Flattens category results into a single array
export function flattenCategoryResults(categoryResults) {
  return Object.entries(categoryResults).flatMap(([category, tests]) =>
    Object.entries(tests).flatMap(([testName, implementations]) =>
      Object.entries(implementations).map(([implName, stats]) => ({
        category,
        testName,
        implementation: implName,
        ...stats,
      })),
    ),
  );
}

// Calculate average execution time for an implementation
export function getAverageExecutionTime(flattenedResults, implementation) {
  const implResults = flattenedResults.filter(result => result.implementation === implementation);
  if (implResults.length === 0) return 0;
  const sum = implResults.reduce(
    (acc, result) => acc + (result.mean || result.executionTime || 0),
    0,
  );
  return sum / implResults.length;
}

// Calculate average RME for an implementation
export function getAverageRME(flattenedResults, implementation) {
  const implResults = flattenedResults.filter(result => result.implementation === implementation);
  if (implResults.length === 0) return 0;
  const sum = implResults.reduce((acc, result) => acc + (result.rme || 0), 0);
  return sum / implResults.length;
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
      ...result,
    };
  });

  return categoryResults;
}
