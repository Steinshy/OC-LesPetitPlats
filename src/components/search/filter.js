const normalize = value => (typeof value === "string" ? value.trim().toLowerCase() : "");

export const filterBySearchTerm = (recipes, searchTerm) => {
  const query = normalize(searchTerm);
  if (!query) return recipes;
  return recipes.filter(recipe => recipe.search?.includes(query));
};

export const filterByIngredients = (recipes, ingredients) => {
  if (ingredients.size === 0) return recipes;
  return recipes.filter(recipe =>
    [...ingredients].every(selectedIngredient => {
      const normalizedSelected = normalize(selectedIngredient);
      return recipe.ingredients?.some(
        ingredient => normalize(ingredient.name) === normalizedSelected,
      );
    }),
  );
};

export const filterByAppliances = (recipes, appliances) => {
  if (appliances.size === 0) return recipes;
  return recipes.filter(recipe => {
    const normalizedAppliance = normalize(recipe.appliance);
    return [...appliances].some(
      selectedAppliance => normalize(selectedAppliance) === normalizedAppliance,
    );
  });
};

export const filterByUstensils = (recipes, ustensils) => {
  if (ustensils.size === 0) return recipes;
  return recipes.filter(recipe =>
    [...ustensils].every(selectedUstensil => {
      const normalizedSelected = normalize(selectedUstensil);
      return recipe.ustensils?.some(ustensil => normalize(ustensil) === normalizedSelected);
    }),
  );
};

export const filterRecipes = (recipes, searchTerm, activeFilters) => {
  let filtered = [...recipes];
  filtered = filterBySearchTerm(filtered, searchTerm);
  filtered = filterByIngredients(filtered, activeFilters.ingredients);
  filtered = filterByAppliances(filtered, activeFilters.appliances);
  filtered = filterByUstensils(filtered, activeFilters.ustensils);
  return filtered;
};

