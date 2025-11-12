// For loop-based implementations for benchmarking with data mapping
// Uses for loops to normalize/map data before filtering (similar to production but with for loops)
// This implementation uses for loops instead of .map() for data normalization

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
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    if (recipe.search && typeof recipe.search === "string") {
      normalized.push(recipe);
    } else {
      normalized.push({ ...recipe, search: mapRecipeToSearchString(recipe) });
    }
  }
  return normalized;
}

// Filter recipes by search term using for loops
export function filterBySearchTerm(recipes, searchTerm) {
  const query = normalize(searchTerm);
  if (!query) return recipes;

  const normalizedRecipes = mapRecipesToNormalized(recipes);
  const filtered = [];

  for (let i = 0; i < normalizedRecipes.length; i++) {
    const recipe = normalizedRecipes[i];
    if (recipe.search?.includes(query)) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

function mapIngredientsToNormalized(recipes) {
  const normalized = [];
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      normalized.push(recipe);
    } else {
      const normalizedIngredients = [];
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ing = recipe.ingredients[j];
        if (ing.name) {
          normalizedIngredients.push(ing);
        } else if (ing.ingredient) {
          normalizedIngredients.push({ ...ing, name: ing.ingredient });
        } else {
          normalizedIngredients.push(ing);
        }
      }
      normalized.push({ ...recipe, ingredients: normalizedIngredients });
    }
  }
  return normalized;
}

function recipeMatchesIngredient(recipe, normalizedSelected) {
  if (!recipe.ingredients) {
    return false;
  }

  for (let k = 0; k < recipe.ingredients.length; k++) {
    const ingredient = recipe.ingredients[k];
    const ingredientName = ingredient.name ?? "";
    if (normalize(ingredientName) === normalizedSelected) {
      return true;
    }
  }
  return false;
}

function recipeMatchesAllIngredients(recipe, ingredientsArray) {
  for (let j = 0; j < ingredientsArray.length; j++) {
    const selectedIngredient = ingredientsArray[j];
    const normalizedSelected = normalize(selectedIngredient);
    if (!recipeMatchesIngredient(recipe, normalizedSelected)) {
      return false;
    }
  }
  return true;
}

// Filter recipes by ingredients using for loops
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

  for (let i = 0; i < normalizedRecipes.length; i++) {
    const recipe = normalizedRecipes[i];
    if (recipeMatchesAllIngredients(recipe, ingredientsArray)) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

// Filter recipes by appliances using for loops
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

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const normalizedAppliance = normalize(recipe.appliance);
    let matches = false;

    for (let j = 0; j < appliancesArray.length; j++) {
      const selectedAppliance = appliancesArray[j];
      if (normalize(selectedAppliance) === normalizedAppliance) {
        matches = true;
        break;
      }
    }

    if (matches) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

function recipeMatchesUstensil(recipe, normalizedSelected) {
  if (!recipe.ustensils) {
    return false;
  }

  for (let k = 0; k < recipe.ustensils.length; k++) {
    const ustensil = recipe.ustensils[k];
    if (normalize(ustensil) === normalizedSelected) {
      return true;
    }
  }
  return false;
}

function recipeMatchesAllUstensils(recipe, ustensilsArray) {
  for (let j = 0; j < ustensilsArray.length; j++) {
    const selectedUstensil = ustensilsArray[j];
    const normalizedSelected = normalize(selectedUstensil);
    if (!recipeMatchesUstensil(recipe, normalizedSelected)) {
      return false;
    }
  }
  return true;
}

// Filter recipes by ustensils using for loops
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

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    if (recipeMatchesAllUstensils(recipe, ustensilsArray)) {
      filtered.push(recipe);
    }
  }

  return filtered;
}

// Filter recipes with multiple filters using for loops
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
