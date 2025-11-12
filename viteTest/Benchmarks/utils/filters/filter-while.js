// while loop-based implementations for benchmarking
// Uses while loops for iteration and filtering recipes
// This implementation uses while loops instead of for loops for comparison

function normalize(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function mapRecipeToSearchString(recipe) {
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const ustensils = Array.isArray(recipe?.ustensils) ? recipe.ustensils : [];
  const words = [
    recipe?.name ?? "",
    ...ingredients.map(ing => ing.name ?? ing.ingredient ?? ""),
    ...ustensils,
    recipe?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
}

function mapRecipesToNormalized(recipes) {
  const normalized = [];
  let i = 0;
  while (i < recipes.length) {
    const recipe = recipes[i];
    if (recipe.search && typeof recipe.search === "string") {
      normalized.push(recipe);
    } else {
      normalized.push({ ...recipe, search: mapRecipeToSearchString(recipe) });
    }
    i++;
  }
  return normalized;
}

// Filter recipes by search term using while loops
export function filterBySearchTerm(recipes, searchTerm) {
  const query = normalize(searchTerm);
  if (!query) return recipes;

  const normalizedRecipes = mapRecipesToNormalized(recipes);
  const filtered = [];
  let i = 0;

  while (i < normalizedRecipes.length) {
    const recipe = normalizedRecipes[i];
    if (recipe.search?.includes(query)) {
      filtered.push(recipe);
    }
    i++;
  }

  return filtered;
}

function mapIngredientsToNormalized(recipes) {
  const normalized = [];
  let i = 0;

  while (i < recipes.length) {
    const recipe = recipes[i];
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      normalized.push(recipe);
    } else {
      const normalizedIngredients = [];
      let j = 0;

      while (j < recipe.ingredients.length) {
        const ing = recipe.ingredients[j];
        if (ing.name) {
          normalizedIngredients.push(ing);
        } else if (ing.ingredient) {
          normalizedIngredients.push({ ...ing, name: ing.ingredient });
        } else {
          normalizedIngredients.push(ing);
        }
        j++;
      }
      normalized.push({ ...recipe, ingredients: normalizedIngredients });
    }
    i++;
  }
  return normalized;
}

function recipeMatchesIngredient(recipe, normalizedSelected) {
  if (!recipe.ingredients) {
    return false;
  }

  let k = 0;
  while (k < recipe.ingredients.length) {
    const ingredient = recipe.ingredients[k];
    const ingredientName = ingredient.name ?? "";
    if (normalize(ingredientName) === normalizedSelected) {
      return true;
    }
    k++;
  }
  return false;
}

function recipeMatchesAllIngredients(recipe, ingredientsArray) {
  let j = 0;
  while (j < ingredientsArray.length) {
    const selectedIngredient = ingredientsArray[j];
    const normalizedSelected = normalize(selectedIngredient);
    if (!recipeMatchesIngredient(recipe, normalizedSelected)) {
      return false;
    }
    j++;
  }
  return true;
}

// Filter recipes by ingredients using while loops
export function filterByIngredients(recipes, ingredients) {
  if (
    !ingredients ||
    (Array.isArray(ingredients) && ingredients.length === 0) ||
    (ingredients instanceof Set && ingredients.size === 0)
  ) {
    return recipes;
  }

  const ingredientsArray = Array.isArray(ingredients) ? ingredients : [...ingredients];
  const normalizedRecipes = mapIngredientsToNormalized(recipes);
  const filtered = [];
  let i = 0;

  while (i < normalizedRecipes.length) {
    const recipe = normalizedRecipes[i];
    if (recipeMatchesAllIngredients(recipe, ingredientsArray)) {
      filtered.push(recipe);
    }
    i++;
  }

  return filtered;
}

// Filter recipes by appliances using while loops
export function filterByAppliances(recipes, appliances) {
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }

  const appliancesArray = Array.isArray(appliances) ? appliances : [...appliances];
  const filtered = [];
  let i = 0;

  while (i < recipes.length) {
    const recipe = recipes[i];
    const normalizedAppliance = normalize(recipe.appliance);
    let matches = false;
    let j = 0;

    while (j < appliancesArray.length) {
      const selectedAppliance = appliancesArray[j];
      if (normalize(selectedAppliance) === normalizedAppliance) {
        matches = true;
        break;
      }
      j++;
    }

    if (matches) {
      filtered.push(recipe);
    }
    i++;
  }

  return filtered;
}

function recipeMatchesUstensil(recipe, normalizedSelected) {
  if (!recipe.ustensils) {
    return false;
  }

  let k = 0;
  while (k < recipe.ustensils.length) {
    const ustensil = recipe.ustensils[k];
    if (normalize(ustensil) === normalizedSelected) {
      return true;
    }
    k++;
  }
  return false;
}

function recipeMatchesAllUstensils(recipe, ustensilsArray) {
  let j = 0;
  while (j < ustensilsArray.length) {
    const selectedUstensil = ustensilsArray[j];
    const normalizedSelected = normalize(selectedUstensil);
    if (!recipeMatchesUstensil(recipe, normalizedSelected)) {
      return false;
    }
    j++;
  }
  return true;
}

// Filter recipes by ustensils using while loops
export function filterByUstensils(recipes, ustensils) {
  if (
    !ustensils ||
    (Array.isArray(ustensils) && ustensils.length === 0) ||
    (ustensils instanceof Set && ustensils.size === 0)
  ) {
    return recipes;
  }

  const ustensilsArray = Array.isArray(ustensils) ? ustensils : [...ustensils];
  const filtered = [];
  let i = 0;

  while (i < recipes.length) {
    const recipe = recipes[i];
    if (recipeMatchesAllUstensils(recipe, ustensilsArray)) {
      filtered.push(recipe);
    }
    i++;
  }

  return filtered;
}

// Filter recipes with multiple filters using while loops
export function filterRecipes(recipes, searchTermOrFilters, activeFilters) {
  let filtered = [...recipes];
  let searchTerm = null;
  let filters = null;

  if (
    typeof searchTermOrFilters === "string" ||
    searchTermOrFilters === null ||
    searchTermOrFilters === undefined
  ) {
    searchTerm = searchTermOrFilters;
    filters = activeFilters;
  } else if (typeof searchTermOrFilters === "object" && searchTermOrFilters !== null) {
    filters = searchTermOrFilters;
    searchTerm = filters.searchTerm;
  }

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
}
