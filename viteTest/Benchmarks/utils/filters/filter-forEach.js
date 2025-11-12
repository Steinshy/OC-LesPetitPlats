// forEach method-based implementation for benchmarking
// Uses Array.forEach() iteration method for filtering recipes
// This implementation uses the forEach callback pattern instead of traditional loops

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
  recipes.forEach(recipe => {
    if (recipe.search && typeof recipe.search === "string") {
      normalized.push(recipe);
    } else {
      normalized.push({ ...recipe, search: mapRecipeToSearchString(recipe) });
    }
  });
  return normalized;
}

// Filter recipes by search term using forEach
export function filterBySearchTerm(recipes, searchTerm) {
  const query = normalize(searchTerm);
  if (!query) return recipes;

  const normalizedRecipes = mapRecipesToNormalized(recipes);
  const filtered = [];

  normalizedRecipes.forEach(recipe => {
    if (recipe.search?.includes(query)) {
      filtered.push(recipe);
    }
  });

  return filtered;
}

function mapIngredientsToNormalized(recipes) {
  const normalized = [];
  recipes.forEach(recipe => {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      normalized.push(recipe);
    } else {
      const normalizedIngredients = [];
      recipe.ingredients.forEach(ing => {
        if (ing.name) {
          normalizedIngredients.push(ing);
        } else if (ing.ingredient) {
          normalizedIngredients.push({ ...ing, name: ing.ingredient });
        } else {
          normalizedIngredients.push(ing);
        }
      });
      normalized.push({ ...recipe, ingredients: normalizedIngredients });
    }
  });
  return normalized;
}

// Filter recipes by ingredients using forEach
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

  normalizedRecipes.forEach(recipe => {
    let matchesAll = true;

    ingredientsArray.forEach(selectedIngredient => {
      const normalizedSelected = normalize(selectedIngredient);
      let found = false;

      if (recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const ingredientName = ingredient.name ?? "";
          if (normalize(ingredientName) === normalizedSelected) {
            found = true;
          }
        });
      }

      if (!found) {
        matchesAll = false;
      }
    });

    if (matchesAll) {
      filtered.push(recipe);
    }
  });

  return filtered;
}

// Filter recipes by appliances using forEach
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

  recipes.forEach(recipe => {
    const normalizedAppliance = normalize(recipe.appliance);
    let matches = false;

    appliancesArray.forEach(selectedAppliance => {
      if (normalize(selectedAppliance) === normalizedAppliance) {
        matches = true;
      }
    });

    if (matches) {
      filtered.push(recipe);
    }
  });

  return filtered;
}

// Filter recipes by ustensils using forEach
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

  recipes.forEach(recipe => {
    let matchesAll = true;

    ustensilsArray.forEach(selectedUstensil => {
      const normalizedSelected = normalize(selectedUstensil);
      let found = false;

      if (recipe.ustensils) {
        recipe.ustensils.forEach(ustensil => {
          if (normalize(ustensil) === normalizedSelected) {
            found = true;
          }
        });
      }

      if (!found) {
        matchesAll = false;
      }
    });

    if (matchesAll) {
      filtered.push(recipe);
    }
  });

  return filtered;
}

// Filter recipes with multiple filters using forEach
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
