// src/components/dropdowns/data.js

import { cleanupDuplicatedItems } from "@utils/normalize.js";

// Extract unique filter values from recipes
export const buildDropdownsData = recipes => {
  if (!recipes) return {};
  const ingredients = recipes
    .flatMap(recipe => recipe?.ingredients?.map(ingredient => ingredient?.ingredient) || [])
    .filter(Boolean);

  const utensils = recipes.flatMap(recipe => recipe?.utensils || []).filter(Boolean);
  const appliances = recipes.map(recipe => recipe?.appliance).filter(Boolean);

  return {
    dropdowns: {
      ingredients: cleanupDuplicatedItems(ingredients),
      utensils: cleanupDuplicatedItems(utensils),
      appliances: cleanupDuplicatedItems(appliances),
    },
  };
};
