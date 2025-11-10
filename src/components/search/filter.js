/**
 * Functional programming implementations of filter functions.
 * These functions use array methods (filter, some, every) instead of native loops.
 */

/**
 * Filters recipes by search term using functional programming.
 * Searches in name, description, and ingredients.
 * @param {Array} recipes - Array of recipe objects
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered recipes
 */
export function filterBySearchTerm(recipes, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return recipes;
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return recipes.filter((recipe) => {
    // Check name
    if (recipe.name && recipe.name.toLowerCase().includes(normalizedSearchTerm)) {
      return true;
    }

    // Check description
    if (recipe.description && recipe.description.toLowerCase().includes(normalizedSearchTerm)) {
      return true;
    }

    // Check ingredients
    if (recipe.ingredients) {
      return recipe.ingredients.some(
        (ingredient) =>
          ingredient.ingredient && ingredient.ingredient.toLowerCase().includes(normalizedSearchTerm)
      );
    }

    return false;
  });
}

/**
 * Filters recipes by selected ingredients using functional programming.
 * Recipe must contain all selected ingredients.
 * @param {Array} recipes - Array of recipe objects
 * @param {Array} selectedIngredients - Array of ingredient names to filter by
 * @returns {Array} Filtered recipes
 */
export function filterByIngredients(recipes, selectedIngredients) {
  if (!selectedIngredients || selectedIngredients.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    if (!recipe.ingredients) {
      return false;
    }

    return selectedIngredients.every((selectedIngredient) => {
      const normalizedSelected = selectedIngredient.toLowerCase();
      return recipe.ingredients.some(
        (ingredient) =>
          ingredient.ingredient && ingredient.ingredient.toLowerCase() === normalizedSelected
      );
    });
  });
}

/**
 * Filters recipes by selected appliances using functional programming.
 * Recipe appliance must match one of the selected appliances.
 * @param {Array} recipes - Array of recipe objects
 * @param {Array} selectedAppliances - Array of appliance names to filter by
 * @returns {Array} Filtered recipes
 */
export function filterByAppliances(recipes, selectedAppliances) {
  if (!selectedAppliances || selectedAppliances.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    if (!recipe.appliance) {
      return false;
    }

    const recipeAppliance = recipe.appliance.toLowerCase();
    return selectedAppliances.some(
      (selectedAppliance) => selectedAppliance.toLowerCase() === recipeAppliance
    );
  });
}

/**
 * Filters recipes by selected ustensils using functional programming.
 * Recipe must contain all selected ustensils.
 * @param {Array} recipes - Array of recipe objects
 * @param {Array} selectedUstensils - Array of ustensil names to filter by
 * @returns {Array} Filtered recipes
 */
export function filterByUstensils(recipes, selectedUstensils) {
  if (!selectedUstensils || selectedUstensils.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    if (!recipe.ustensils) {
      return false;
    }

    return selectedUstensils.every((selectedUstensil) => {
      const normalizedSelected = selectedUstensil.toLowerCase();
      return recipe.ustensils.some(
        (ustensil) => ustensil && ustensil.toLowerCase() === normalizedSelected
      );
    });
  });
}

/**
 * Combines all filters using functional programming.
 * Applies search term, ingredients, appliances, and ustensils filters sequentially.
 * @param {Array} recipes - Array of recipe objects
 * @param {Object} filters - Filter object with searchTerm, ingredients, appliances, ustensils
 * @returns {Array} Filtered recipes
 */
export function filterRecipes(recipes, filters) {
  let filtered = recipes;

  // Apply search term filter
  if (filters.searchTerm) {
    filtered = filterBySearchTerm(filtered, filters.searchTerm);
  }

  // Apply ingredients filter
  if (filters.ingredients && filters.ingredients.length > 0) {
    filtered = filterByIngredients(filtered, filters.ingredients);
  }

  // Apply appliances filter
  if (filters.appliances && filters.appliances.length > 0) {
    filtered = filterByAppliances(filtered, filters.appliances);
  }

  // Apply ustensils filter
  if (filters.ustensils && filters.ustensils.length > 0) {
    filtered = filterByUstensils(filtered, filters.ustensils);
  }

  return filtered;
}
