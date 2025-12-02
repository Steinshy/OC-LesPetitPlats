import { benchmarkData } from "@benchmarks-data/loader.js";

export function generateBenchmarkDataStats(flattened = []) {
  // Determine which categories were actually tested
  const testedCategories = new Set();
  flattened.forEach(result => {
    if (result.category) {
      testedCategories.add(result.category.toLowerCase());
    }
  });

  const ingredients = new Set();
  const appliances = new Set();
  const utensils = new Set();
  let totalIngredients = 0;

  // Only collect stats for categories that were actually tested
  const shouldCollectIngredients = testedCategories.size === 0 || testedCategories.has("ingredients") || testedCategories.has("search");
  const shouldCollectAppliances = testedCategories.size === 0 || testedCategories.has("appliances") || testedCategories.has("search");
  const shouldCollectUtensils = testedCategories.size === 0 || testedCategories.has("utensils") || testedCategories.has("search");

  benchmarkData.forEach(recipe => {
    if (shouldCollectAppliances && recipe.appliance) {
      appliances.add(recipe.appliance);
    }
    if (shouldCollectUtensils && Array.isArray(recipe.utensils)) {
      recipe.utensils.forEach(utensil => utensils.add(utensil));
    }
    if (shouldCollectIngredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach(ingredient => {
        const name = ingredient.ingredient || ingredient.name;
        if (name) {
          ingredients.add(name);
          totalIngredients++;
        }
      });
    }
  });

  // Build cards based on what was tested
  const cards = [];

  // Always show total recipes
  cards.push(`
    <div class="coverage-card">
      <h4>Total Recipes</h4>
      <p class="coverage-value">${benchmarkData.length}</p>
    </div>
  `);

  // Show ingredients only if tested
  if (shouldCollectIngredients) {
    cards.push(`
      <div class="coverage-card">
        <h4>Unique Ingredients</h4>
        <p class="coverage-value">${ingredients.size}</p>
      </div>
    `);
    cards.push(`
      <div class="coverage-card">
        <h4>Total Ingredients</h4>
        <p class="coverage-value">${totalIngredients}</p>
        <p class="coverage-detail">Across all recipes</p>
      </div>
    `);
  }

  // Show appliances only if tested
  if (shouldCollectAppliances) {
    cards.push(`
      <div class="coverage-card">
        <h4>Unique Appliances</h4>
        <p class="coverage-value">${appliances.size}</p>
      </div>
    `);
  }

  // Show utensils only if tested
  if (shouldCollectUtensils) {
    cards.push(`
      <div class="coverage-card">
        <h4>Unique utensils</h4>
        <p class="coverage-value">${utensils.size}</p>
      </div>
    `);
  }

  // If no categories were tested, show all (for backward compatibility)
  if (testedCategories.size === 0) {
    // Already added all cards above
  }

  return `
    <div class="benchmark-data-stats">
      <div class="coverage-grid">
        ${cards.join("")}
      </div>
    </div>
  `;
}

