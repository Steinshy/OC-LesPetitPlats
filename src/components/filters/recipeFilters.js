// src/components/filters/recipeFilters.js

import { normalizeString } from "@utils/string.js";

// ---------------
// search helpers
// ---------------

const applySearch = (items, searchTerm, getText) => {
  if (!Array.isArray(items)) return [];

  const query = normalizeString(searchTerm);
  if (!query) return items;

  return items.filter(item => {
    if (!item) return false;
    const rawText = getText(item);
    if (!rawText) return false;

    const text = normalizeString(rawText);
    return text.includes(query);
  });
};

// Filter dropdown items by label/value
export const filterDropdownItems = (items, searchTerm) => {
  return applySearch(items, searchTerm, item => {
    return item?.label ?? item?.value ?? "";
  });
};

// Search across name, description, ingredients
export const filterBysearchInput = (recipes, searchTerm) => {
  return applySearch(recipes, searchTerm, recipe => {
    const ingredientNames = (recipe.ingredients || []).map(ing => ing?.ingredient).filter(Boolean);

    const searchableFields = [
      recipe.name,
      recipe.description,
      ...ingredientNames,
      recipe.appliance,
      ...(recipe.utensils || []),
    ].filter(Boolean);

    return searchableFields.join(" ");
  });
};

// ---------------
// field filter
// ---------------

// Filter by ingredients, appliances, or utensils
export const filterByField = (recipes, filter, fieldType) => {
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
      normalizedRecipeValues = [normalizeString(recipe.appliance)];
    }

    if (fieldType === "utensils") {
      normalizedRecipeValues = (recipe.utensils || []).map(ustensil => normalizeString(ustensil));
    }

    return selected.every(selectedValue => normalizedRecipeValues.includes(selectedValue));
  });
};
