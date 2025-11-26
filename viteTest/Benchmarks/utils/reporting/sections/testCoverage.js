// Test coverage section generator
import { getImplementations, organizeByCategory, getTestCoverage } from "../../data/results.js";

export function generateTestCoverage(flattened, _allResults) {
  const categoryResults = organizeByCategory(flattened);
  const coverage = getTestCoverage(categoryResults);
  const implementations = getImplementations(flattened);

  // Calculate additional metrics
  const iterationsPerTest = 50; // Standard iterations per test
  const totalBenchmarkRuns = coverage.totalTests * implementations.length * iterationsPerTest;
  const totalCategories = Object.keys(coverage.categoryBreakdown).length;

  // Count test types (performance vs memory tests)
  const performanceTests =
    coverage.totalTests -
    Object.values(categoryResults).reduce((sum, tests) => {
      return (
        sum +
        Object.keys(tests).filter(testName => testName.toLowerCase().includes("memory")).length
      );
    }, 0);
  const memoryTests = coverage.totalTests - performanceTests;

  return `
    <div class="test-coverage">
      <div class="coverage-grid">
        <div class="coverage-card">
          <h4>Test Cases</h4>
          <p class="coverage-value">${coverage.totalTests}</p>
          <p class="coverage-detail">${performanceTests} performance, ${memoryTests} memory</p>
        </div>
        <div class="coverage-card">
          <h4>Scenarios</h4>
          <p class="coverage-value">${coverage.totalScenarios}</p>
          <p class="coverage-detail">Tests × Implementations</p>
        </div>
        <div class="coverage-card">
          <h4>Implementations</h4>
          <p class="coverage-value">${implementations.length}</p>
          <p class="coverage-detail">Production & Maps</p>
        </div>
        <div class="coverage-card">
          <h4>Categories</h4>
          <p class="coverage-value">${totalCategories}</p>
          <p class="coverage-detail">Search, Ingredients, Appliances, Ustensils</p>
        </div>
        <div class="coverage-card">
          <h4>Iterations</h4>
          <p class="coverage-value">${iterationsPerTest}</p>
          <p class="coverage-detail">Per test case</p>
        </div>
        <div class="coverage-card">
          <h4>Total Runs</h4>
          <p class="coverage-value">${totalBenchmarkRuns.toLocaleString()}</p>
          <p class="coverage-detail">Approximate benchmark executions</p>
        </div>
        <div class="coverage-card coverage-card-wide">
          <h4>By Category</h4>
          <div class="category-list-row">
            ${Object.entries(coverage.categoryBreakdown)
              .map(
                ([category, count]) =>
                  `<span class="category-item"><strong>${category}:</strong> ${count} tests</span>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

