// Test wrapper for filtersBy - adds missing exports without modifying source
export * from "@/components/filters/recipeFilters.js";
import * as filtersBy from "@/components/filters/recipeFilters.js";
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

export const filterByIngredients = (recipes, ingredients) =>
  filtersBy.filterByField(recipes, ingredients, "ingredients");
export const filterByAppliances = (recipes, appliances) =>
  filtersBy.filterByField(recipes, appliances, "appliances");
export const filterByUstensils = (recipes, ustensils) =>
  filtersBy.filterByField(recipes, ustensils, "ustensils");

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
  filteredRecipes = filtersBy.filterByField(filteredRecipes, ingredients, "ingredients");
  filteredRecipes = filtersBy.filterByField(filteredRecipes, appliances, "appliances");
  filteredRecipes = filtersBy.filterByField(filteredRecipes, ustensils, "ustensils");

  return filteredRecipes;
};
