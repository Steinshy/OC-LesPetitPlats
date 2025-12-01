// Statistics sections generator (merged from benchmarkDataStats.js and testCoverage.js)
import { benchmarkData } from "@benchmarks-data/loader.js";
import { getImplementations, organizeByCategory, getTestCoverage } from "@benchmarks-data/results.js";

// Benchmark data statistics section generator
export function generateBenchmarkDataStats() {
  const data = benchmarkData;
  const totalRecipes = data.length;

  // Collect unique values
  const ingredients = new Set();
  const appliances = new Set();
  const utensils = new Set();
  let totalIngredients = 0;

  data.forEach(recipe => {
    if (recipe.appliance) {
      appliances.add(recipe.appliance);
    }
    if (recipe.utensils && Array.isArray(recipe.utensils)) {
      recipe.utensils.forEach(ustensil => utensils.add(ustensil));
    }
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach(ingredient => {
        const ingredientName = ingredient.ingredient || ingredient.name;
        if (ingredientName) {
          ingredients.add(ingredientName);
          totalIngredients++;
        }
      });
    }
  });

  return `
    <div class="benchmark-data-stats">
      <div class="coverage-grid">
        <div class="coverage-card">
          <h4>Total Recipes</h4>
          <p class="coverage-value">${totalRecipes}</p>
        </div>
        <div class="coverage-card">
          <h4>Unique Ingredients</h4>
          <p class="coverage-value">${ingredients.size}</p>
        </div>
        <div class="coverage-card">
          <h4>Unique Appliances</h4>
          <p class="coverage-value">${appliances.size}</p>
        </div>
        <div class="coverage-card">
          <h4>Unique utensils</h4>
          <p class="coverage-value">${utensils.size}</p>
        </div>
        <div class="coverage-card">
          <h4>Total Ingredients</h4>
          <p class="coverage-value">${totalIngredients}</p>
          <p class="coverage-detail">Across all recipes</p>
        </div>
      </div>
    </div>
  `;
}

// Test coverage section generator
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
          <p class="coverage-detail">Search, Ingredients, Appliances, utensils</p>
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

