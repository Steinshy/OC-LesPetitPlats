// src/components/dropdown/data.js

import { cleanupDuplicatedItems } from "@utils/string.js";

// Extract unique filter values from recipes
export const buildDropdownsData = recipesData => {
  if (!recipesData) return {};
  const allIngredients = recipesData
    .flatMap(recipe => recipe?.ingredients?.map(ingredient => ingredient?.ingredient) || [])
    .filter(Boolean);

  const allutensils = recipesData.flatMap(recipe => recipe?.utensils || []).filter(Boolean);
  const allAppliances = recipesData.map(recipe => recipe?.appliance).filter(Boolean);

  return {
    dropdowns: {
      ingredients: cleanupDuplicatedItems(allIngredients),
      utensils: cleanupDuplicatedItems(allutensils),
      appliances: cleanupDuplicatedItems(allAppliances),
    },
  };
};
