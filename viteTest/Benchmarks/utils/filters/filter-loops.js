// For loops-based implementation for benchmarking
// Uses traditional for loops for direct filtering without data normalization/mapping

// Filter recipes by search term using for loops
export function filterBySearchTermLoops(recipes, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return recipes;
  }

  // Normalized search term
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  // Filtered results array
  const filtered = [];
  // Total recipes count
  const recipesLength = recipes.length;

  for (let i = 0; i < recipesLength; i++) {
    // Current recipe
    const recipe = recipes[i];
    // Match flag
    let matches = false;

    if (recipe.name && recipe.name.toLowerCase().includes(normalizedSearchTerm)) {
      matches = true;
    }

    if (
      !matches &&
      recipe.description &&
      recipe.description.toLowerCase().includes(normalizedSearchTerm)
    ) {
      matches = true;
    }

    if (!matches && recipe.ingredients) {
      // Ingredients count
      const ingredientsLength = recipe.ingredients.length;
      for (let j = 0; j < ingredientsLength; j++) {
        // Current ingredient
        const ingredient = recipe.ingredients[j];
        if (
          ingredient.ingredient &&
          ingredient.ingredient.toLowerCase().includes(normalizedSearchTerm)
        ) {
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

// Filter recipes by ingredients using for loops
export function filterByIngredientsLoops(recipes, selectedIngredients) {
  if (!selectedIngredients || selectedIngredients.length === 0) {
    return recipes;
  }

  // Filtered results array
  const filtered = [];
  // Total recipes count
  const recipesLength = recipes.length;
  // Selected ingredients count
  const selectedLength = selectedIngredients.length;

  for (let i = 0; i < recipesLength; i++) {
    // Current recipe
    const recipe = recipes[i];
    // All ingredients match flag
    let matchesAll = true;

    for (let j = 0; j < selectedLength; j++) {
      // Normalized selected ingredient
      const selectedIngredient = selectedIngredients[j].toLowerCase();
      // Ingredient found flag
      let found = false;

      if (recipe.ingredients) {
        // Ingredients count
        const ingredientsLength = recipe.ingredients.length;
        for (let k = 0; k < ingredientsLength; k++) {
          // Current ingredient
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

// Filter recipes by appliances using for loops
export function filterByAppliancesLoops(recipes, selectedAppliances) {
  if (!selectedAppliances || selectedAppliances.length === 0) {
    return recipes;
  }

  // Filtered results array
  const filtered = [];
  // Total recipes count
  const recipesLength = recipes.length;
  // Selected appliances count
  const selectedLength = selectedAppliances.length;

  for (let i = 0; i < recipesLength; i++) {
    // Current recipe
    const recipe = recipes[i];
    // Match flag
    let matches = false;

    if (recipe.appliance) {
      // Normalized appliance
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

// Filter recipes by ustensils using for loops
export function filterByUstensilsLoops(recipes, selectedUstensils) {
  if (!selectedUstensils || selectedUstensils.length === 0) {
    return recipes;
  }

  // Filtered results array
  const filtered = [];
  // Total recipes count
  const recipesLength = recipes.length;
  // Selected ustensils count
  const selectedLength = selectedUstensils.length;

  for (let i = 0; i < recipesLength; i++) {
    // Current recipe
    const recipe = recipes[i];
    // All ustensils match flag
    let matchesAll = true;

    for (let j = 0; j < selectedLength; j++) {
      // Normalized selected ustensil
      const selectedUstensil = selectedUstensils[j].toLowerCase();
      // Ustensil found flag
      let found = false;

      if (recipe.ustensils) {
        // Ustensils count
        const ustensilsLength = recipe.ustensils.length;
        for (let k = 0; k < ustensilsLength; k++) {
          // Current ustensil
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

// Filter recipes with multiple filters using for loops
export function filterRecipesLoops(recipes, filters) {
  // Filtered recipes array
  let filtered = recipes;

  if (filters.searchTerm) {
    filtered = filterBySearchTermLoops(filtered, filters.searchTerm);
  }

  if (filters.ingredients && filters.ingredients.length > 0) {
    filtered = filterByIngredientsLoops(filtered, filters.ingredients);
  }

  if (filters.appliances && filters.appliances.length > 0) {
    filtered = filterByAppliancesLoops(filtered, filters.appliances);
  }

  if (filters.ustensils && filters.ustensils.length > 0) {
    filtered = filterByUstensilsLoops(filtered, filters.ustensils);
  }

  return filtered;
}
