/**
 * Native loop implementations of filter functions for benchmarking.
 * These functions use for/while loops instead of functional programming methods.
 */

/**
 * Filters recipes by search term using native loops.
 * Searches in name, description, and ingredients.
 * @param {Array} recipes - Array of recipe objects
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered recipes
 */
export function filterBySearchTermNative(recipes, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return recipes;
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  const filtered = [];
  const recipesLength = recipes.length;

  for (let i = 0; i < recipesLength; i++) {
    const recipe = recipes[i];
    let matches = false;

    // Check name
    if (recipe.name && recipe.name.toLowerCase().includes(normalizedSearchTerm)) {
      matches = true;
    }

    // Check description
    if (!matches && recipe.description && recipe.description.toLowerCase().includes(normalizedSearchTerm)) {
      matches = true;
    }

    // Check ingredients
    if (!matches && recipe.ingredients) {
      const ingredientsLength = recipe.ingredients.length;
      for (let j = 0; j < ingredientsLength; j++) {
        const ingredient = recipe.ingredients[j];
        if (ingredient.ingredient && ingredient.ingredient.toLowerCase().includes(normalizedSearchTerm)) {
          matches = true;
          break;
        }
      }
    }

    if (matches) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

/**
 * Filters recipes by selected ingredients using native loops.
 * Recipe must contain all selected ingredients.
 * @param {Array} recipes - Array of recipe objects
 * @param {Array} selectedIngredients - Array of ingredient names to filter by
 * @returns {Array} Filtered recipes
 */
export function filterByIngredientsNative(recipes, selectedIngredients) {
  if (!selectedIngredients || selectedIngredients.length === 0) {
    return recipes;
  }

  const filtered = [];
  const recipesLength = recipes.length;
  const selectedLength = selectedIngredients.length;

  for (let i = 0; i < recipesLength; i++) {
    const recipe = recipes[i];
    let matchesAll = true;

    // Check if recipe has all selected ingredients
    for (let j = 0; j < selectedLength; j++) {
      const selectedIngredient = selectedIngredients[j].toLowerCase();
      let found = false;

      if (recipe.ingredients) {
        const ingredientsLength = recipe.ingredients.length;
        for (let k = 0; k < ingredientsLength; k++) {
          const ingredient = recipe.ingredients[k];
          if (ingredient.ingredient && ingredient.ingredient.toLowerCase() === selectedIngredient) {
            found = true;
            break;
          }
        }
      }

      if (!found) {
        matchesAll = false;
        break;
      }
    }

    if (matchesAll) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

/**
 * Filters recipes by selected appliances using native loops.
 * Recipe appliance must match one of the selected appliances.
 * @param {Array} recipes - Array of recipe objects
 * @param {Array} selectedAppliances - Array of appliance names to filter by
 * @returns {Array} Filtered recipes
 */
export function filterByAppliancesNative(recipes, selectedAppliances) {
  if (!selectedAppliances || selectedAppliances.length === 0) {
    return recipes;
  }

  const filtered = [];
  const recipesLength = recipes.length;
  const selectedLength = selectedAppliances.length;

  for (let i = 0; i < recipesLength; i++) {
    const recipe = recipes[i];
    let matches = false;

    if (recipe.appliance) {
      const recipeAppliance = recipe.appliance.toLowerCase();
      for (let j = 0; j < selectedLength; j++) {
        if (recipeAppliance === selectedAppliances[j].toLowerCase()) {
          matches = true;
          break;
        }
      }
    }

    if (matches) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

/**
 * Filters recipes by selected ustensils using native loops.
 * Recipe must contain all selected ustensils.
 * @param {Array} recipes - Array of recipe objects
 * @param {Array} selectedUstensils - Array of ustensil names to filter by
 * @returns {Array} Filtered recipes
 */
export function filterByUstensilsNative(recipes, selectedUstensils) {
  if (!selectedUstensils || selectedUstensils.length === 0) {
    return recipes;
  }

  const filtered = [];
  const recipesLength = recipes.length;
  const selectedLength = selectedUstensils.length;

  for (let i = 0; i < recipesLength; i++) {
    const recipe = recipes[i];
    let matchesAll = true;

    // Check if recipe has all selected ustensils
    for (let j = 0; j < selectedLength; j++) {
      const selectedUstensil = selectedUstensils[j].toLowerCase();
      let found = false;

      if (recipe.ustensils) {
        const ustensilsLength = recipe.ustensils.length;
        for (let k = 0; k < ustensilsLength; k++) {
          const ustensil = recipe.ustensils[k];
          if (ustensil && ustensil.toLowerCase() === selectedUstensil) {
            found = true;
            break;
          }
        }
      }

      if (!found) {
        matchesAll = false;
        break;
      }
    }

    if (matchesAll) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

/**
 * Combines all filters using native loops.
 * Applies search term, ingredients, appliances, and ustensils filters sequentially.
 * @param {Array} recipes - Array of recipe objects
 * @param {Object} filters - Filter object with searchTerm, ingredients, appliances, ustensils
 * @returns {Array} Filtered recipes
 */
export function filterRecipesNative(recipes, filters) {
  let filtered = recipes;

  // Apply search term filter
  if (filters.searchTerm) {
    filtered = filterBySearchTermNative(filtered, filters.searchTerm);
  }

  // Apply ingredients filter
  if (filters.ingredients && filters.ingredients.length > 0) {
    filtered = filterByIngredientsNative(filtered, filters.ingredients);
  }

  // Apply appliances filter
  if (filters.appliances && filters.appliances.length > 0) {
    filtered = filterByAppliancesNative(filtered, filters.appliances);
  }

  // Apply ustensils filter
  if (filters.ustensils && filters.ustensils.length > 0) {
    filtered = filterByUstensilsNative(filtered, filters.ustensils);
  }

  return filtered;
}

