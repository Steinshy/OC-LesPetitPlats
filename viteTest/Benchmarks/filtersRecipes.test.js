/**
 * Benchmark tests for combined recipe filtering functionality.
 * Tests the performance of filtering recipes using multiple filter types simultaneously
 * (ingredients, appliances, and ustensils).
 */

import { bench, describe } from "vitest";

import { recipes } from "../../api/recipes.js";

// Helper function to filter recipes by multiple criteria
function filterRecipes(recipesData, filters) {
  const { ingredients = [], appliances = [], ustensils = [] } = filters;

  return recipesData.filter((recipe) => {
    // Filter by ingredients (AND logic - all must be present)
    if (ingredients.length > 0) {
      const recipeIngredients = recipe.ingredients.map((ing) =>
        ing.ingredient.toLowerCase(),
      );
      const hasAllIngredients = ingredients.every((filterIng) =>
        recipeIngredients.some((recipeIng) =>
          recipeIng.includes(filterIng.toLowerCase()),
        ),
      );
      if (!hasAllIngredients) return false;
    }

    // Filter by appliances (OR logic - any must match)
    if (appliances.length > 0) {
      const recipeAppliance = recipe.appliance?.toLowerCase() || "";
      const matchesAppliance = appliances.some((filterApp) =>
        recipeAppliance.includes(filterApp.toLowerCase()),
      );
      if (!matchesAppliance) return false;
    }

    // Filter by ustensils (AND logic - all must be present)
    if (ustensils.length > 0) {
      const recipeUstensils = recipe.ustensils.map((ust) => ust.toLowerCase());
      const hasAllUstensils = ustensils.every((filterUst) =>
        recipeUstensils.some((recipeUst) =>
          recipeUst.includes(filterUst.toLowerCase()),
        ),
      );
      if (!hasAllUstensils) return false;
    }

    return true;
  });
}

describe("Combined Recipe Filtering Benchmarks", () => {
  bench("filter with all filter types", () => {
    const filters = {
      ingredients: ["citron", "coco"],
      appliances: ["Blender", "Saladier"],
      ustensils: ["presse citron"],
    };
    filterRecipes(recipes, filters);
  });

  bench("filter with ingredients and appliances", () => {
    const filters = {
      ingredients: ["poulet", "tomate"],
      appliances: ["Casserole"],
    };
    filterRecipes(recipes, filters);
  });

  bench("filter with ingredients and ustensils", () => {
    const filters = {
      ingredients: ["citron"],
      ustensils: ["presse citron", "cuillère"],
    };
    filterRecipes(recipes, filters);
  });

  bench("filter with appliances and ustensils", () => {
    const filters = {
      appliances: ["Four"],
      ustensils: ["couteau"],
    };
    filterRecipes(recipes, filters);
  });

  bench("filter with no filters (returns all)", () => {
    const filters = {};
    filterRecipes(recipes, filters);
  });
});
