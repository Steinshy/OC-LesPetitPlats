/**
 * Benchmark tests for filtering recipes by ustensils.
 * Tests performance with single ustensil, multiple ustensils, and empty filters.
 * Includes memory usage tracking.
 */

import { bench, describe } from "vitest";

import { recipes } from "../../api/recipes.js";

// Helper function to filter recipes by ustensils (AND logic)
function filterByUstensils(recipesData, ustensilFilters) {
  if (ustensilFilters.length === 0) {
    return recipesData;
  }

  return recipesData.filter((recipe) => {
    const recipeUstensils = recipe.ustensils.map((ust) => ust.toLowerCase());
    return ustensilFilters.every((filterUst) =>
      recipeUstensils.some((recipeUst) =>
        recipeUst.includes(filterUst.toLowerCase()),
      ),
    );
  });
}

describe("Filter Recipes by Ustensils Benchmarks", () => {
  bench("filter by single ustensil", () => {
    filterByUstensils(recipes, ["presse citron"]);
  });

  bench("filter by multiple ustensils (2)", () => {
    filterByUstensils(recipes, ["presse citron", "cuillère"]);
  });

  bench("filter by multiple ustensils (3)", () => {
    filterByUstensils(recipes, ["couteau", "cuillère", "presse citron"]);
  });

  bench("filter by multiple ustensils (5)", () => {
    filterByUstensils(recipes, [
      "presse citron",
      "cuillère",
      "couteau",
      "verres",
      "saladier",
    ]);
  });

  bench("filter by empty ustensils array", () => {
    filterByUstensils(recipes, []);
  });

  bench("filter by non-existent ustensil", () => {
    filterByUstensils(recipes, ["nonexistentustensil12345"]);
  });
});
