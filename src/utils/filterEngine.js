// src/utils/filterEngine.js

// Unified, config-driven filter engine for recipes

import { normalizeString } from "@utils/normalize.js";

const FIELD_CONFIG = {
  ingredients: {
    extract: recipe => (recipe.ingredients || []).map(ingredient => ingredient?.ingredient),
    isArray: true,
  },
  appliances: {
    extract: recipe => recipe.appliance,
    isArray: false,
  },
  utensils: {
    extract: recipe => recipe.utensils || [],
    isArray: true,
  },
};

const SEARCHABLE_FIELDS = ["name", "description", "appliance"];

// Normalize and flatten recipe values for a given field
const getRecipeFieldValues = (recipe, fieldType) => {
  const config = FIELD_CONFIG[fieldType];
  if (!config) return [];

  const rawValue = config.extract(recipe);
  if (!rawValue) return [];

  const values = config.isArray ? rawValue : [rawValue];
  return values.filter(Boolean).map(normalizeString);
};

// Build searchable text from a recipe
const buildSearchableText = recipe => {
  const parts = [];

  // Add direct fields
  for (const field of SEARCHABLE_FIELDS) {
    if (recipe[field]) parts.push(recipe[field]);
  }

  // Add array fields from config
  for (const config of Object.values(FIELD_CONFIG)) {
    if (config.isArray) {
      const values = config.extract(recipe);
      if (Array.isArray(values)) {
        parts.push(...values.filter(Boolean));
      }
    }
  }

  return parts.join(" ");
};
// Filter recipes by search term
export const filterBySearch = (recipes, searchTerm) => {
  if (!Array.isArray(recipes)) return [];

  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  return recipes.filter(recipe => {
    if (!recipe) return false;
    const text = normalizeString(buildSearchableText(recipe));
    return text.includes(query);
  });
};
// Filter recipes by a specific field
export const filterByField = (recipes, selectedValues, fieldType) => {
  if (!Array.isArray(recipes)) return [];
  if (!FIELD_CONFIG[fieldType]) return recipes;

  // Handle both Set and Array
  const selected = selectedValues instanceof Set ? [...selectedValues] : selectedValues;
  if (!selected || selected.length === 0) return recipes;

  return recipes.filter(recipe => {
    if (!recipe) return false;
    const recipeValues = getRecipeFieldValues(recipe, fieldType);
    return selected.every(value => recipeValues.includes(value));
  });
};

// Apply all filters at once
export const applyAllFilters = (recipes, filters) => {
  if (!Array.isArray(recipes)) return [];

  let result = recipes;

  // Apply search filter
  if (filters.search) {
    result = filterBySearch(result, filters.search);
  }

  // Apply each field filter
  for (const fieldType of Object.keys(FIELD_CONFIG)) {
    const selectedValues = filters[fieldType];
    if (selectedValues && (selectedValues.size > 0 || selectedValues.length > 0)) {
      result = filterByField(result, selectedValues, fieldType);
    }
  }

  return result;
};
// Filter dropdown items by search term
export const filterDropdownItems = (items, searchTerm) => {
  if (!Array.isArray(items)) return [];

  const query = normalizeString(searchTerm);
  if (!query) return items;

  return items.filter(item => {
    if (!item) return false;
    const text = normalizeString(item?.label ?? item?.value ?? "");
    return text.includes(query);
  });
};
