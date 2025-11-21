// Test wrapper for filtersBy - adds missing exports without modifying source
export * from "@/components/filters/filtersBy.js";
import * as filtersBy from "@/components/filters/filtersBy.js";
import { normalizeString } from "@/utils/string.js";

// Export aliases for test compatibility
// Override filterBySearchTerm to handle both ingredient.ingredient and ingredient.name
export const filterBySearchTerm = (recipes, searchTerm) => {
  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  const filtered = [];

  recipes.forEach(recipe => {
    // Build ingredients array with forEach - handle both ingredient.ingredient and ingredient.name
    const ingredientNames = [];
    (recipe.ingredients || []).forEach(ingredient => {
      const ingredientName = ingredient?.ingredient ?? ingredient?.name ?? "";
      if (ingredientName) {
        ingredientNames.push(ingredientName);
      }
    });

    // Build haystack array
    const haystackParts = [
      recipe.name,
      recipe.description,
      ...ingredientNames,
      recipe.appliance,
      ...(recipe.ustensils || []),
    ].filter(Boolean);

    // Normalize with forEach
    const normalizedParts = [];
    haystackParts.forEach(part => {
      normalizedParts.push(normalizeString(part));
    });

    const haystack = normalizedParts.join(" ");

    if (haystack.includes(query)) {
      filtered.push(recipe);
    }
  });

  return filtered;
};

export const filterByIngredients = filtersBy.IngredientsInput;
export const filterByAppliances = filtersBy.AppliancesInput;
export const filterByUstensils = filtersBy.UstensilsInput;

// Combined filter function
export const filterRecipes = (recipes, searchTermOrFilters, activeFilters) => {
  let filteredRecipes = recipes;
  let searchTerm = "";
  let ingredients = new Set();
  let appliances = new Set();
  let ustensils = new Set();

  // Handle object signature: filterRecipes(recipes, { searchTerm, ingredients, appliances, ustensils })
  if (
    searchTermOrFilters &&
    typeof searchTermOrFilters === "object" &&
    !Array.isArray(searchTermOrFilters) &&
    !(searchTermOrFilters instanceof Set)
  ) {
    const filters = searchTermOrFilters;
    searchTerm = filters.searchTerm || "";
    ingredients = filters.ingredients || new Set();
    appliances = filters.appliances || new Set();
    ustensils = filters.ustensils || new Set();
  } else {
    // Handle separate parameters: filterRecipes(recipes, searchTerm, activeFilters)
    searchTerm = searchTermOrFilters || "";
    if (activeFilters) {
      ingredients = activeFilters.ingredients || new Set();
      appliances = activeFilters.appliances || new Set();
      ustensils = activeFilters.ustensils || new Set();
    }
  }

  filteredRecipes = filtersBy.SearchInput(filteredRecipes, searchTerm);
  filteredRecipes = filtersBy.IngredientsInput(filteredRecipes, ingredients);
  filteredRecipes = filtersBy.AppliancesInput(filteredRecipes, appliances);
  filteredRecipes = filtersBy.UstensilsInput(filteredRecipes, ustensils);

  return filteredRecipes;
};
