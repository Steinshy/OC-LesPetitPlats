// Production filter functions from src/components/filters/filtersEngine.js
import { normalizeString } from "@/utils/normalize.js";
import { filtersEngine } from "~/src/components/filters/engine.js";

// Wrapper functions for benchmark compatibility
export const filterBySearchTerm = (recipes, searchTerm) => {
  if (!Array.isArray(recipes)) return [];
  return filtersEngine.onSearch(recipes, searchTerm);
};

export const filterByIngredients = (recipes, ingredients) => {
  if (!Array.isArray(recipes)) return [];
  const selectedValues = ingredients instanceof Set ? ingredients : new Set(ingredients || []);
  return filtersEngine.onFilter(recipes, selectedValues, "ingredients");
};

export const filterByAppliances = (recipes, appliances) => {
  if (!Array.isArray(recipes)) return [];
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }

  // For appliances, use OR logic (recipe has one appliance, match if it's in selected)
  // This matches the forEach implementation behavior
  const selectedValues = appliances instanceof Set ? appliances : new Set(appliances || []);
  const selected = [...selectedValues];

  return recipes.filter(recipe => {
    const values = filtersEngine.extract.appliances(recipe);
    return selected.some(v => values.includes(normalizeString(v)));
  });
};

export const filterByutensils = (recipes, utensils) => {
  if (!Array.isArray(recipes)) return [];
  const selectedValues = utensils instanceof Set ? utensils : new Set(utensils || []);
  return filtersEngine.onFilter(recipes, selectedValues, "utensils");
};
