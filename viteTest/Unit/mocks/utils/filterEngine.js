// Test wrapper for filterEngine with backward-compatible implementation
import { normalizeString } from "@/utils/normalize.js";
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

// Helper to match filterByField behavior
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

// Export aliases for test compatibility (handles both { ingredient: "X" } and { name: "X" } formats)
export const filterBySearchTerm = (recipes, searchTerm) => {
  return searchInputHelper(recipes, searchTerm);
};

// Legacy aliases for backward compatibility
export const searchInput = searchInputHelper;
export const filterByField = filterByFieldHelper;

export const filterByIngredients = (recipes, ingredients) => {
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return filterByFieldHelper(recipes, ingredients, "ingredients");
  }
  const normalizedIngredients = ingredients.map(ing => normalizeString(ing));
  return filterByFieldHelper(recipes, normalizedIngredients, "ingredients");
};
export const filterByAppliances = (recipes, appliances) => {
  if (!appliances || !Array.isArray(appliances) || appliances.length === 0) {
    return filterByFieldHelper(recipes, appliances, "appliances");
  }
  // OR logic: any appliance can match
  const normalizedAppliances = appliances.map(app => normalizeString(app));
  return recipes.filter(recipe => {
    if (!recipe || !recipe.appliance) return false;
    const normalizedRecipeAppliance = normalizeString(recipe.appliance);
    return normalizedAppliances.some(
      selectedAppliance => normalizedRecipeAppliance === selectedAppliance,
    );
  });
};
export const filterByutensils = (recipes, utensils) => {
  if (!utensils || !Array.isArray(utensils) || utensils.length === 0) {
    return filterByFieldHelper(recipes, utensils, "utensils");
  }
  // AND logic: all utensils must match
  const normalizedutensils = utensils.map(ust => normalizeString(ust));
  return recipes.filter(recipe => {
    if (!recipe) return false;
    const recipeutensils = recipe.utensils || [];
    if (!Array.isArray(recipeutensils) || recipeutensils.length === 0) {
      return false;
    }
    const normalizedRecipeutensils = recipeutensils.map(ustensil => normalizeString(ustensil));
    return normalizedutensils.every(selectedValue =>
      normalizedRecipeutensils.includes(selectedValue),
    );
  });
};
export const filterRecipes = (recipes, searchTermOrFilters, activeFilters) => {
  let filteredRecipes = recipes;
  let searchTerm = "";
  let ingredients = new Set();
  let appliances = new Set();
  let utensils = new Set();

  // Handle object signature or separate parameters
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
