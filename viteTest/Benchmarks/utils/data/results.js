/**
 * Results data utilities for benchmark reporting
 * Handles flattening and processing of benchmark results
 */

/**
 * Flattens category results into a single array with all stats
 * @param {Object} categoryResults - Results organized by category
 * @returns {Array} Flattened array of test results with all stats
 */
export function flattenCategoryResults(categoryResults) {
  const flattened = [];

  for (const [category, tests] of Object.entries(categoryResults)) {
    for (const [testName, implementations] of Object.entries(tests)) {
      for (const [implName, stats] of Object.entries(implementations)) {
        flattened.push({
          category,
          testName,
          implementation: implName,
          ...stats,
        });
      }
    }
  }

  return flattened;
}

/**
 * Calculate average execution time for an implementation across all test cases
 * @param {Array} flattenedResults - Flattened results array
 * @param {string} implementation - Implementation name
 * @returns {number} Average execution time
 */
export function getAverageExecutionTime(flattenedResults, implementation) {
  const implResults = flattenedResults.filter(
    (result) => result.implementation === implementation
  );
  if (implResults.length === 0) return 0;

  const sum = implResults.reduce(
    (acc, result) => acc + (result.mean || result.executionTime || 0),
    0
  );
  return sum / implResults.length;
}

/**
 * Calculate average RME for an implementation across all test cases
 * @param {Array} flattenedResults - Flattened results array
 * @param {string} implementation - Implementation name
 * @returns {number} Average RME value
 */
export function getAverageRME(flattenedResults, implementation) {
  const implResults = flattenedResults.filter(
    (result) => result.implementation === implementation
  );
  if (implResults.length === 0) return 0;

  const sum = implResults.reduce(
    (acc, result) => acc + (result.rme || 0),
    0
  );
  return sum / implResults.length;
}

/**
 * Get all unique implementations from flattened results
 * @param {Array} flattenedResults - Flattened results array
 * @returns {Array} Array of unique implementation names
 */
export function getImplementations(flattenedResults) {
  return [...new Set(flattenedResults.map((result) => result.implementation))];
}

/**
 * Get test coverage statistics
 * @param {Object} categoryResults - Results organized by category
 * @returns {Object} Coverage statistics
 */
export function getTestCoverage(categoryResults) {
  let totalTests = 0;
  const categoryBreakdown = {};
  let totalScenarios = 0;

  for (const [category, tests] of Object.entries(categoryResults)) {
    const testCount = Object.keys(tests).length;
    categoryBreakdown[category] = testCount;
    totalTests += testCount;

    // Count scenarios (test cases × implementations)
    for (const implementations of Object.values(tests)) {
      totalScenarios += Object.keys(implementations).length;
    }
  }

  return {
    totalTests,
    categoryBreakdown,
    totalScenarios,
  };
}
