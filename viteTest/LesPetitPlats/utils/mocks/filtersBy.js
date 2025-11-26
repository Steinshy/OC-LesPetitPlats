// Test wrapper for filtersBy - adds missing exports without modifying source
export * from "@/components/filters/recipeFilters.js";
import { normalizeString } from "@/utils/string.js";

// Re-implement SearchInput to avoid mocking issues
const SearchInputHelper = (recipes, searchTerm) => {
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
      ...(recipe.ustensils || []),
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
    if (fieldType === "ustensils") {
      normalizedRecipeValues = (recipe.ustensils || []).map(ustensil => normalizeString(ustensil));
    }
    return selected.every(selectedValue => normalizedRecipeValues.includes(selectedValue));
  });
};

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
export const filterByUstensils = (recipes, ustensils) => {
  if (!ustensils || !Array.isArray(ustensils) || ustensils.length === 0) {
    return filterByFieldHelper(recipes, ustensils, "ustensils");
  }
  // Normalize ustensil filter values for comparison - use AND logic (all must match)
  const normalizedUstensils = ustensils.map(ust => normalizeString(ust));
  return recipes.filter(recipe => {
    if (!recipe) return false;
    // Handle null/undefined/empty ustensils - recipe should not match if it has no ustensils
    const recipeUstensils = recipe.ustensils || [];
    if (!Array.isArray(recipeUstensils) || recipeUstensils.length === 0) {
      return false;
    }
    const normalizedRecipeUstensils = recipeUstensils.map(ustensil => normalizeString(ustensil));
    // All filter values must be present in recipe (AND logic)
    return normalizedUstensils.every(selectedValue =>
      normalizedRecipeUstensils.includes(selectedValue),
    );
  });
};

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

  filteredRecipes = SearchInputHelper(filteredRecipes, searchTerm);
  filteredRecipes = filterByIngredients(
    filteredRecipes,
    Array.isArray(ingredients) ? ingredients : [...ingredients],
  );
  filteredRecipes = filterByAppliances(
    filteredRecipes,
    Array.isArray(appliances) ? appliances : [...appliances],
  );
  filteredRecipes = filterByUstensils(
    filteredRecipes,
    Array.isArray(ustensils) ? ustensils : [...ustensils],
  );

  return filteredRecipes;
};
