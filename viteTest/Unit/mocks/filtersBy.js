// Test wrapper for filtersBy - uses new filterEngine
import { filterBySearch as filterBySearchEngine } from "@/utils/filterEngine.js";
import { normalizeString } from "~/src/utils/normalize.js";

// Re-implement searchInput to avoid mocking issues
const searchInputHelper = (recipes, searchTerm) => {
  const query = normalizeString(searchTerm);
  if (!query) return recipes;
  return recipes.filter(recipe => {
    if (!recipe) return false;
    const ingredientNames = (recipe.ingredients || [])
      .map(ing => ing?.ingredient ?? ing?.name ?? "")
      .filter(Boolean);
    const searchableFields = [
      recipe.name,
      recipe.description,
      ...ingredientNames,
      recipe.appliance,
      ...(recipe.utensils || []),
    ].filter(Boolean);
    const searchableText = searchableFields.join(" ");
    return normalizeString(searchableText).includes(query);
  });
};

// Helper function to match filterByField behavior
const filterByFieldHelper = (recipes, filter, fieldType) => {
  if (!recipes) return [];
  const filterSize = Array.isArray(filter) ? filter.length : (filter?.size ?? 0);
  if (!filter || filterSize === 0) return recipes;
  const selected = Array.isArray(filter) ? filter : [...filter];
  return recipes.filter(recipe => {
    if (!recipe) return false;
    let normalizedRecipeValues = [];
    if (fieldType === "ingredients") {
      normalizedRecipeValues = (recipe.ingredients || []).map(ingredient =>
        normalizeString(ingredient?.ingredient ?? ingredient?.name ?? ""),
      );
    }
    if (fieldType === "appliances") {
      normalizedRecipeValues = [normalizeString(recipe.appliance || "")];
    }
    if (fieldType === "utensils") {
      normalizedRecipeValues = (recipe.utensils || []).map(ustensil => normalizeString(ustensil));
    }
    return selected.every(selectedValue => normalizedRecipeValues.includes(selectedValue));
  });
};

// Export aliases for test compatibility
// Map to new filterEngine API
export const filterBySearchTerm = (recipes, searchTerm) => {
  return filterBySearchEngine(recipes, searchTerm);
};

// Legacy alias for searchInput
export const searchInput = filterBySearchEngine;

// Legacy filterByField function - use helper for backward compatibility with test expectations
export const filterByField = filterByFieldHelper;

// Legacy filterBySearchTerm implementation (kept for backward compatibility)
const _filterBySearchTermLegacy = (recipes, searchTerm) => {
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
      ...(recipe.utensils || []),
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

export const filterByIngredients = (recipes, ingredients) => {
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return filterByFieldHelper(recipes, ingredients, "ingredients");
  }
  // Normalize ingredient filter values for comparison
  const normalizedIngredients = ingredients.map(ing => normalizeString(ing));
  return filterByFieldHelper(recipes, normalizedIngredients, "ingredients");
};
export const filterByAppliances = (recipes, appliances) => {
  if (!appliances || !Array.isArray(appliances) || appliances.length === 0) {
    return filterByFieldHelper(recipes, appliances, "appliances");
  }
  // Normalize appliance filter values for comparison - use OR logic (any match)
  const normalizedAppliances = appliances.map(app => normalizeString(app));
  return recipes.filter(recipe => {
    if (!recipe) return false;
    // Handle null/undefined/empty appliance - recipe should not match if it has no appliance
    const recipeAppliance = recipe.appliance;
    if (!recipeAppliance) {
      return false;
    }
    const normalizedRecipeAppliance = normalizeString(recipeAppliance);
    // Any filter value can match (OR logic)
    return normalizedAppliances.some(
      selectedAppliance => normalizedRecipeAppliance === selectedAppliance,
    );
  });
};
export const filterByutensils = (recipes, utensils) => {
  if (!utensils || !Array.isArray(utensils) || utensils.length === 0) {
    return filterByFieldHelper(recipes, utensils, "utensils");
  }
  // Normalize ustensil filter values for comparison - use AND logic (all must match)
  const normalizedutensils = utensils.map(ust => normalizeString(ust));
  return recipes.filter(recipe => {
    if (!recipe) return false;
    // Handle null/undefined/empty utensils - recipe should not match if it has no utensils
    const recipeutensils = recipe.utensils || [];
    if (!Array.isArray(recipeutensils) || recipeutensils.length === 0) {
      return false;
    }
    const normalizedRecipeutensils = recipeutensils.map(ustensil => normalizeString(ustensil));
    // All filter values must be present in recipe (AND logic)
    return normalizedutensils.every(selectedValue =>
      normalizedRecipeutensils.includes(selectedValue),
    );
  });
};

// Combined filter function
export const filterRecipes = (recipes, searchTermOrFilters, activeFilters) => {
  let filteredRecipes = recipes;
  let searchTerm = "";
  let ingredients = new Set();
  let appliances = new Set();
  let utensils = new Set();

  // Handle object signature: filterRecipes(recipes, { searchTerm, ingredients, appliances, utensils })
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
    utensils = filters.utensils || new Set();
  } else {
    // Handle separate parameters: filterRecipes(recipes, searchTerm, activeFilters)
    searchTerm = searchTermOrFilters || "";
    if (activeFilters) {
      ingredients = activeFilters.ingredients || new Set();
      appliances = activeFilters.appliances || new Set();
      utensils = activeFilters.utensils || new Set();
    }
  }

  filteredRecipes = searchInputHelper(filteredRecipes, searchTerm);
  filteredRecipes = filterByIngredients(
    filteredRecipes,
    Array.isArray(ingredients) ? ingredients : [...ingredients],
  );
  filteredRecipes = filterByAppliances(
    filteredRecipes,
    Array.isArray(appliances) ? appliances : [...appliances],
  );
  filteredRecipes = filterByutensils(
    filteredRecipes,
    Array.isArray(utensils) ? utensils : [...utensils],
  );

  return filteredRecipes;
};
