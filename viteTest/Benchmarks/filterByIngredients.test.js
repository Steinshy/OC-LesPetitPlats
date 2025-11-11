/**
 * Benchmark tests for filtering recipes by ingredients.
 * Tests performance with single ingredient, multiple ingredients, and empty filters.
 * Includes memory usage tracking.
 */

import { bench, describe } from "vitest";

import { recipes } from "../../api/recipes.js";

// Helper function to filter recipes by ingredients (AND logic)
function filterByIngredients(recipesData, ingredientFilters) {
  if (ingredientFilters.length === 0) {
    return recipesData;
  }

  return recipesData.filter((recipe) => {
    const recipeIngredients = recipe.ingredients.map((ing) =>
      ing.ingredient.toLowerCase(),
    );
    return ingredientFilters.every((filterIng) =>
      recipeIngredients.some((recipeIng) =>
        recipeIng.includes(filterIng.toLowerCase()),
      ),
    );
  });
}

describe("Filter Recipes by Ingredients Benchmarks", () => {
  bench("filter by single ingredient", () => {
    filterByIngredients(recipes, ["citron"]);
  });

  bench("filter by multiple ingredients (2)", () => {
    filterByIngredients(recipes, ["citron", "coco"]);
  });

  bench("filter by multiple ingredients (3)", () => {
    filterByIngredients(recipes, ["poulet", "tomate", "oignon"]);
  });

  bench("filter by multiple ingredients (5)", () => {
    filterByIngredients(recipes, ["citron", "coco", "poulet", "tomate", "oignon"]);
  });

  bench("filter by empty ingredients array", () => {
    filterByIngredients(recipes, []);
  });

  bench("filter by non-existent ingredient", () => {
    filterByIngredients(recipes, ["nonexistentingredient12345"]);
  });
});
