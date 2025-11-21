// Benchmark data statistics section generator
import { benchmarkData } from "../../data/paths.js";

export function generateBenchmarkDataStats() {
  const data = benchmarkData;
  const totalRecipes = data.length;

  // Collect unique values
  const ingredients = new Set();
  const appliances = new Set();
  const ustensils = new Set();
  let totalIngredients = 0;

  data.forEach(recipe => {
    if (recipe.appliance) {
      appliances.add(recipe.appliance);
    }
    if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
      recipe.ustensils.forEach(ustensil => ustensils.add(ustensil));
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
          <h4>Unique Ustensils</h4>
          <p class="coverage-value">${ustensils.size}</p>
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

