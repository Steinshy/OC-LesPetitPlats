const normalize = value => (typeof value === "string" ? value.trim().toLowerCase() : "");

export const filterBySearchTerm = (recipes, searchTerm) => {
  const query = normalize(searchTerm);
  if (!query) return recipes;
  return recipes.filter(recipe => {
    // Production: recipes always have search property
    return recipe.search?.includes(query);
  });
};

export const filterByIngredients = (recipes, ingredients) => {
  if (
    !ingredients ||
    (Array.isArray(ingredients) && ingredients.length === 0) ||
    (ingredients instanceof Set && ingredients.size === 0)
  ) {
    return recipes;
  }
  const ingredientsArray = Array.isArray(ingredients) ? ingredients : [...ingredients];
  return recipes.filter(recipe =>
    ingredientsArray.every(selectedIngredient => {
      const normalizedSelected = normalize(selectedIngredient);
      // Production: ingredients always have name property
      return recipe.ingredients?.some(ingredient => {
        const ingredientName = ingredient.name ?? "";
        return normalize(ingredientName) === normalizedSelected;
      });
    }),
  );
};

export const filterByAppliances = (recipes, appliances) => {
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }
  const appliancesArray = Array.isArray(appliances) ? appliances : [...appliances];
  return recipes.filter(recipe => {
    const normalizedAppliance = normalize(recipe.appliance);
    return appliancesArray.some(
      selectedAppliance => normalize(selectedAppliance) === normalizedAppliance,
    );
  });
};

export const filterByUstensils = (recipes, ustensils) => {
  if (
    !ustensils ||
    (Array.isArray(ustensils) && ustensils.length === 0) ||
    (ustensils instanceof Set && ustensils.size === 0)
  ) {
    return recipes;
  }
  const ustensilsArray = Array.isArray(ustensils) ? ustensils : [...ustensils];
  return recipes.filter(recipe =>
    ustensilsArray.every(selectedUstensil => {
      const normalizedSelected = normalize(selectedUstensil);
      return recipe.ustensils?.some(ustensil => normalize(ustensil) === normalizedSelected);
    }),
  );
};

// 1. filterRecipes(recipes, searchTerm, activeFilters) - used by search.js
export const filterRecipes = (recipes, searchTermOrFilters, activeFilters) => {
  let filtered = [...recipes];
  let searchTerm = null;
  let filters = null;

  if (
    typeof searchTermOrFilters === "string" ||
    searchTermOrFilters === null ||
    searchTermOrFilters === undefined
  ) {
    // Signature 1: (recipes, searchTerm, activeFilters)
    searchTerm = searchTermOrFilters;
    filters = activeFilters;
  } else if (typeof searchTermOrFilters === "object" && searchTermOrFilters !== null) {
    // Signature 2: (recipes, filters)
    filters = searchTermOrFilters;
    searchTerm = filters.searchTerm;
  }

  // Apply filters
  filtered = filterBySearchTerm(filtered, searchTerm);
  if (filters?.ingredients) {
    filtered = filterByIngredients(filtered, filters.ingredients);
  }
  if (filters?.appliances) {
    filtered = filterByAppliances(filtered, filters.appliances);
  }
  if (filters?.ustensils) {
    filtered = filterByUstensils(filtered, filters.ustensils);
  }

  return filtered;
};
