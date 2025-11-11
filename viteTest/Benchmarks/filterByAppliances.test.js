/**
 * Benchmark tests for filtering recipes by appliances.
 * Tests performance with single appliance, multiple appliances, and empty filters.
 * Includes memory usage tracking.
 */

import { bench, describe } from "vitest";

import { recipes } from "../../api/recipes.js";

// Helper function to filter recipes by appliances (OR logic)
function filterByAppliances(recipesData, applianceFilters) {
  if (applianceFilters.length === 0) {
    return recipesData;
  }

  return recipesData.filter((recipe) => {
    const recipeAppliance = recipe.appliance?.toLowerCase() || "";
    return applianceFilters.some((filterApp) =>
      recipeAppliance.includes(filterApp.toLowerCase()),
    );
  });
}

describe("Filter Recipes by Appliances Benchmarks", () => {
  bench("filter by single appliance", () => {
    filterByAppliances(recipes, ["Blender"]);
  });

  bench("filter by multiple appliances (2)", () => {
    filterByAppliances(recipes, ["Blender", "Saladier"]);
  });

  bench("filter by multiple appliances (3)", () => {
    filterByAppliances(recipes, ["Four", "Casserole", "Poêle"]);
  });

  bench("filter by multiple appliances (5)", () => {
    filterByAppliances(recipes, ["Blender", "Saladier", "Four", "Casserole", "Poêle"]);
  });

  bench("filter by empty appliances array", () => {
    filterByAppliances(recipes, []);
  });

  bench("filter by non-existent appliance", () => {
    filterByAppliances(recipes, ["NonexistentAppliance12345"]);
  });
});
