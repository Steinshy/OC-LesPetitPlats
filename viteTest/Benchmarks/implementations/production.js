// Production filter functions from src/components/filters/engine.js
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
  const selectedValues = appliances instanceof Set ? appliances : new Set(appliances || []);
  return filtersEngine.onFilter(recipes, selectedValues, "appliances");
};

export const filterByutensils = (recipes, utensils) => {
  if (!Array.isArray(recipes)) return [];
  const selectedValues = utensils instanceof Set ? utensils : new Set(utensils || []);
  return filtersEngine.onFilter(recipes, selectedValues, "utensils");
};
