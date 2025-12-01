// Filter functions using forEach loops instead of .map() and .filter() methods

const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const canonicalizeTerm = value => normalizeString(value);

// Search filter - filters recipes by search term using forEach
export const filterBySearchTerm = (recipes, searchTerm) => {
  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  const result = [];
  recipes.forEach(recipe => {
    if (!recipe) return;

    // Build ingredients array with forEach
    const ingredientNames = [];
    (recipe.ingredients || []).forEach(ingredient => {
      const name = ingredient?.ingredient;
      if (name) ingredientNames.push(name);
    });

    // Build haystack array
    const haystackParts = [];
    if (recipe.name) haystackParts.push(recipe.name);
    if (recipe.description) haystackParts.push(recipe.description);
    ingredientNames.forEach(name => haystackParts.push(name));
    if (recipe.appliance) haystackParts.push(recipe.appliance);
    (recipe.utensils || []).forEach(utensil => {
      if (utensil) haystackParts.push(utensil);
    });

    // Normalize with forEach
    const normalizedParts = [];
    haystackParts.forEach(part => {
      normalizedParts.push(normalizeString(part));
    });
    const haystack = normalizedParts.join(" ");

    if (haystack.includes(query)) {
      result.push(recipe);
    }
  });

  return result;
};

// Ingredients filter - filters recipes by selected ingredients using forEach
export const filterByIngredients = (recipes, ingredients) => {
  if (
    !ingredients ||
    (Array.isArray(ingredients) && ingredients.length === 0) ||
    (ingredients instanceof Set && ingredients.size === 0)
  ) {
    return recipes;
  }

  const ingredientsArray = [];
  ingredients.forEach(ing => ingredientsArray.push(ing));

  const result = [];
  recipes.forEach(recipe => {
    if (!recipe) return;

    let allMatch = true;
    ingredientsArray.forEach(selectedIngredient => {
      if (!allMatch) return;

      const normalizedSelected = canonicalizeTerm(selectedIngredient);
      let found = false;
      (recipe.ingredients || []).forEach(ingredient => {
        if (found) return;
        const ingredientName = ingredient.ingredient ?? ingredient.name ?? "";
        if (canonicalizeTerm(ingredientName) === normalizedSelected) {
          found = true;
        }
      });

      if (!found) {
        allMatch = false;
      }
    });

    if (allMatch) {
      result.push(recipe);
    }
  });

  return result;
};

// Appliances filter - filters recipes by selected appliances using forEach
export const filterByAppliances = (recipes, appliances) => {
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }

  const appliancesArray = [];
  appliances.forEach(app => appliancesArray.push(app));

  const result = [];
  recipes.forEach(recipe => {
    if (!recipe) return;

    const normalizedAppliance = canonicalizeTerm(recipe.appliance);
    let found = false;
    appliancesArray.forEach(selectedAppliance => {
      if (found) return;
      if (canonicalizeTerm(selectedAppliance) === normalizedAppliance) {
        found = true;
      }
    });

    if (found) {
      result.push(recipe);
    }
  });

  return result;
};

// Utensils filter - filters recipes by selected utensils using forEach
export const filterByutensils = (recipes, utensils) => {
  if (
    !utensils ||
    (Array.isArray(utensils) && utensils.length === 0) ||
    (utensils instanceof Set && utensils.size === 0)
  ) {
    return recipes;
  }

  const utensilsArray = [];
  utensils.forEach(ut => utensilsArray.push(ut));

  const result = [];
  recipes.forEach(recipe => {
    if (!recipe) return;

    let allMatch = true;
    utensilsArray.forEach(selectedUstensil => {
      if (!allMatch) return;

      const normalizedSelected = canonicalizeTerm(selectedUstensil);
      let found = false;
      (recipe.utensils || []).forEach(ustensil => {
        if (found) return;
        if (canonicalizeTerm(ustensil) === normalizedSelected) {
          found = true;
        }
      });

      if (!found) {
        allMatch = false;
      }
    });

    if (allMatch) {
      result.push(recipe);
    }
  });

  return result;
};
