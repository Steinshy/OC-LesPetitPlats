// Map-based filter functions using .map() and .filter() methods

const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const canonicalizeTerm = value => normalizeString(value);

// Search filter - filters recipes by search term using map/filter
export const filterBySearchTerm = (recipes, searchTerm) => {
  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  return recipes.filter(recipe => {
    // Build ingredients array with map
    const ingredientNames = (recipe.ingredients || [])
      .map(ingredient => ingredient?.ingredient)
      .filter(Boolean);

    // Build haystack array
    const haystackParts = [
      recipe.name,
      recipe.description,
      ...ingredientNames,
      recipe.appliance,
      ...(recipe.utensils || []),
    ].filter(Boolean);

    // Normalize with map
    const normalizedParts = haystackParts.map(part => normalizeString(part));
    const haystack = normalizedParts.join(" ");

    return haystack.includes(query);
  });
};

// Ingredients filter - filters recipes by selected ingredients using map/filter
export const filterByIngredients = (recipes, ingredients) => {
  if (
    !ingredients ||
    (Array.isArray(ingredients) && ingredients.length === 0) ||
    (ingredients instanceof Set && ingredients.size === 0)
  ) {
    return recipes;
  }

  const ingredientsArray = [...ingredients];

  return recipes.filter(recipe => {
    return ingredientsArray.every(selectedIngredient => {
      const normalizedSelected = canonicalizeTerm(selectedIngredient);
      return (recipe.ingredients || []).some(ingredient => {
        const ingredientName = ingredient.ingredient ?? ingredient.name ?? "";
        return canonicalizeTerm(ingredientName) === normalizedSelected;
      });
    });
  });
};

// Appliances filter - filters recipes by selected appliances using map/filter
export const filterByAppliances = (recipes, appliances) => {
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }

  const appliancesArray = [...appliances];

  return recipes.filter(recipe => {
    const normalizedAppliance = canonicalizeTerm(recipe.appliance);
    return appliancesArray.some(selectedAppliance => {
      return canonicalizeTerm(selectedAppliance) === normalizedAppliance;
    });
  });
};

// utensils filter - filters recipes by selected utensils using map/filter
export const filterByutensils = (recipes, utensils) => {
  if (
    !utensils ||
    (Array.isArray(utensils) && utensils.length === 0) ||
    (utensils instanceof Set && utensils.size === 0)
  ) {
    return recipes;
  }

  const utensilsArray = [...utensils];

  return recipes.filter(recipe => {
    return utensilsArray.every(selectedUstensil => {
      const normalizedSelected = canonicalizeTerm(selectedUstensil);
      return (recipe.utensils || []).some(ustensil => {
        return canonicalizeTerm(ustensil) === normalizedSelected;
      });
    });
  });
};
