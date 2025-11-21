// Production filter functions using forEach-based implementation
// Adapted from src/components/filters/filtersBy.js

// Normalize string function (copied from src/utils/string.js)
const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const canonicalizeTerm = value => normalizeString(value);

// Search filter - filters recipes by search term
export const filterBySearchTerm = (recipes, searchTerm) => {
  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  const filtered = [];

  recipes.forEach(recipe => {
    // Build ingredients array with forEach
    const ingredientNames = [];
    (recipe.ingredients || []).forEach(ingredient => {
      if (ingredient?.ingredient) {
        ingredientNames.push(ingredient.ingredient);
      }
    });

    // Build haystack array
    const haystackParts = [
      recipe.name,
      recipe.description,
      ...ingredientNames,
      recipe.appliance,
      ...(recipe.ustensils || []),
    ].filter(Boolean);

    // Normalize with forEach
    const normalizedParts = [];
    haystackParts.forEach(part => {
      normalizedParts.push(normalizeString(part));
    });

    const haystack = normalizedParts.join(" ");

    if (haystack.includes(query)) {
      filtered.push(recipe);
    }
  });

  return filtered;
};

// Ingredients filter - filters recipes by selected ingredients
export const filterByIngredients = (recipes, ingredients) => {
  if (
    !ingredients ||
    (Array.isArray(ingredients) && ingredients.length === 0) ||
    (ingredients instanceof Set && ingredients.size === 0)
  ) {
    return recipes;
  }

  const ingredientsArray = [...ingredients];
  const filtered = [];

  recipes.forEach(recipe => {
    let matchesAll = true;

    ingredientsArray.forEach(selectedIngredient => {
      const normalizedSelected = canonicalizeTerm(selectedIngredient);
      let found = false;

      if (recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const ingredientName = ingredient.ingredient ?? ingredient.name ?? "";
          if (canonicalizeTerm(ingredientName) === normalizedSelected) {
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
};

// Appliances filter - filters recipes by selected appliances
export const filterByAppliances = (recipes, appliances) => {
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }

  const appliancesArray = [...appliances];
  const filtered = [];

  recipes.forEach(recipe => {
    const normalizedAppliance = canonicalizeTerm(recipe.appliance);
    let matches = false;

    appliancesArray.forEach(selectedAppliance => {
      if (canonicalizeTerm(selectedAppliance) === normalizedAppliance) {
        matches = true;
      }
    });

    if (matches) {
      filtered.push(recipe);
    }
  });

  return filtered;
};

// Ustensils filter - filters recipes by selected ustensils
export const filterByUstensils = (recipes, ustensils) => {
  if (
    !ustensils ||
    (Array.isArray(ustensils) && ustensils.length === 0) ||
    (ustensils instanceof Set && ustensils.size === 0)
  ) {
    return recipes;
  }

  const ustensilsArray = [...ustensils];
  const filtered = [];

  recipes.forEach(recipe => {
    let matchesAll = true;

    ustensilsArray.forEach(selectedUstensil => {
      const normalizedSelected = canonicalizeTerm(selectedUstensil);
      let found = false;

      if (recipe.ustensils) {
        recipe.ustensils.forEach(ustensil => {
          if (canonicalizeTerm(ustensil) === normalizedSelected) {
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
};
