// reduce method-based implementations for benchmarking
// Uses Array.reduce() iteration method for filtering recipes
// This implementation accumulates filtered results using the reduce pattern

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
  return recipes.reduce((acc, recipe) => {
    if (recipe.search && typeof recipe.search === "string") {
      acc.push(recipe);
    } else {
      acc.push({ ...recipe, search: mapRecipeToSearchString(recipe) });
    }
    return acc;
  }, []);
}

// Filter recipes by search term using reduce
export function filterBySearchTerm(recipes, searchTerm) {
  const query = normalize(searchTerm);
  if (!query) return recipes;

  const normalizedRecipes = mapRecipesToNormalized(recipes);
  return normalizedRecipes.reduce((acc, recipe) => {
    if (recipe.search?.includes(query)) {
      acc.push(recipe);
    }
    return acc;
  }, []);
}

function mapIngredientsToNormalized(recipes) {
  return recipes.reduce((acc, recipe) => {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      acc.push(recipe);
    } else {
      const normalizedIngredients = recipe.ingredients.reduce((ingAcc, ing) => {
        if (ing.name) {
          ingAcc.push(ing);
        } else if (ing.ingredient) {
          ingAcc.push({ ...ing, name: ing.ingredient });
        } else {
          ingAcc.push(ing);
        }
        return ingAcc;
      }, []);
      acc.push({ ...recipe, ingredients: normalizedIngredients });
    }
    return acc;
  }, []);
}

// Filter recipes by ingredients using reduce
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

  return normalizedRecipes.reduce((acc, recipe) => {
    const matchesAll = ingredientsArray.reduce((matchAcc, selectedIngredient) => {
      if (!matchAcc) return false;
      const normalizedSelected = normalize(selectedIngredient);
      const found = recipe.ingredients?.reduce((foundAcc, ingredient) => {
        if (foundAcc) return true;
        const ingredientName = ingredient.name ?? "";
        return normalize(ingredientName) === normalizedSelected;
      }, false);
      return found !== false;
    }, true);

    if (matchesAll) {
      acc.push(recipe);
    }
    return acc;
  }, []);
}

// Filter recipes by appliances using reduce
export function filterByAppliances(recipes, appliances) {
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }

  const appliancesArray = Array.isArray(appliances) ? appliances : [...appliances];

  return recipes.reduce((acc, recipe) => {
    const normalizedAppliance = normalize(recipe.appliance);
    const matches = appliancesArray.reduce((matchAcc, selectedAppliance) => {
      if (matchAcc) return true;
      return normalize(selectedAppliance) === normalizedAppliance;
    }, false);

    if (matches) {
      acc.push(recipe);
    }
    return acc;
  }, []);
}

// Filter recipes by ustensils using reduce
export function filterByUstensils(recipes, ustensils) {
  if (
    !ustensils ||
    (Array.isArray(ustensils) && ustensils.length === 0) ||
    (ustensils instanceof Set && ustensils.size === 0)
  ) {
    return recipes;
  }

  const ustensilsArray = Array.isArray(ustensils) ? ustensils : [...ustensils];

  return recipes.reduce((acc, recipe) => {
    const matchesAll = ustensilsArray.reduce((matchAcc, selectedUstensil) => {
      if (!matchAcc) return false;
      const normalizedSelected = normalize(selectedUstensil);
      const found = recipe.ustensils?.reduce((foundAcc, ustensil) => {
        if (foundAcc) return true;
        return normalize(ustensil) === normalizedSelected;
      }, false);
      return found !== false;
    }, true);

    if (matchesAll) {
      acc.push(recipe);
    }
    return acc;
  }, []);
}

// Filter recipes with multiple filters using reduce
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
