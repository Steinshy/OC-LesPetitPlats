// src/components/dropdowns/data.js

import { cleanupDuplicatedItems } from "@utils/normalize.js";

// Extract unique filter values from recipes
export const buildDropdownsData = recipesData => {
  if (!recipesData) return {};
  const ingredients = recipesData
    .flatMap(recipe => recipe?.ingredients?.map(ingredient => ingredient?.ingredient) || [])
    .filter(Boolean);

  const utensils = recipesData.flatMap(recipe => recipe?.utensils || []).filter(Boolean);
  const appliances = recipesData.map(recipe => recipe?.appliance).filter(Boolean);

  return {
    dropdowns: {
      ingredients: cleanupDuplicatedItems(ingredients),
      utensils: cleanupDuplicatedItems(utensils),
      appliances: cleanupDuplicatedItems(appliances),
    },
  };
};
