import { cleanupDuplicatedItems } from "@/utils/string.js";

export const buildDropdownsData = recipesData => {
  if (!recipesData) return {};
  const allIngredients = recipesData
    .flatMap(recipe => recipe?.ingredients?.map(ingredient => ingredient?.ingredient) || [])
    .filter(Boolean);

  const allUstensils = recipesData.flatMap(recipe => recipe?.ustensils || []).filter(Boolean);
  const allAppliances = recipesData.map(recipe => recipe?.appliance).filter(Boolean);

  return {
    dropdowns: {
      ingredients: cleanupDuplicatedItems(allIngredients),
      ustensils: cleanupDuplicatedItems(allUstensils),
      appliances: cleanupDuplicatedItems(allAppliances),
    },
  };
};
