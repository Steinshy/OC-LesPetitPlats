// Production filter functions - copy of actual source code
// Copied from src/components/filters/recipeFilters.js and src/utils/string.js

// Normalize string function (copied from src/utils/string.js)
const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

// Search filter - copied from filterBysearchInput in src/components/filters/recipeFilters.js
const applySearch = (items, searchTerm, getText) => {
  if (!Array.isArray(items)) return [];

  const query = normalizeString(searchTerm);
  if (!query) return items;

  return items.filter(item => {
    if (!item) return false;
    const rawText = getText(item);
    if (!rawText) return false;

    const text = normalizeString(rawText);
    return text.includes(query);
  });
};

export const filterBySearchTerm = (recipes, searchTerm) => {
  return applySearch(recipes, searchTerm, recipe => {
    const ingredientNames = (recipe.ingredients || []).map(ing => ing?.ingredient).filter(Boolean);

    const searchableFields = [
      recipe.name,
      recipe.description,
      ...ingredientNames,
      recipe.appliance,
      ...(recipe.utensils || []),
    ].filter(Boolean);

    return searchableFields.join(" ");
  });
};

// Filter by field - copied from filterByField in src/components/filters/recipeFilters.js
const filterByField = (recipes, filter, fieldType) => {
  if (!recipes) return [];

  const filterSize = Array.isArray(filter) ? filter.length : (filter?.size ?? 0);
  if (!filter || filterSize === 0) return recipes;

  const selected = Array.isArray(filter) ? filter : [...filter];

  return recipes.filter(recipe => {
    if (!recipe) return false;
    let normalizedRecipeValues = [];

    if (fieldType === "ingredients") {
      normalizedRecipeValues = (recipe.ingredients || []).map(ingredient =>
        normalizeString(ingredient?.ingredient ?? ingredient?.name ?? ""),
      );
    }

    if (fieldType === "appliances") {
      normalizedRecipeValues = [normalizeString(recipe.appliance)];
    }

    if (fieldType === "utensils") {
      normalizedRecipeValues = (recipe.utensils || []).map(ustensil => normalizeString(ustensil));
    }

    return selected.every(selectedValue => normalizedRecipeValues.includes(selectedValue));
  });
};

// Ingredients filter - wrapper around filterByField
export const filterByIngredients = (recipes, ingredients) => {
  return filterByField(recipes, ingredients, "ingredients");
};

// Appliances filter - uses OR logic (any appliance matches)
// Note: This differs from filterByField which uses AND logic
export const filterByAppliances = (recipes, appliances) => {
  if (!recipes) return [];
  const filterSize = Array.isArray(appliances) ? appliances.length : (appliances?.size ?? 0);
  if (!appliances || filterSize === 0) return recipes;
  const selected = Array.isArray(appliances) ? appliances : [...appliances];
  return recipes.filter(recipe => {
    if (!recipe) return false;
    const normalizedRecipeAppliance = normalizeString(recipe.appliance || "");
    return selected.some(selectedAppliance => {
      const normalizedSelected = normalizeString(selectedAppliance);
      return normalizedRecipeAppliance === normalizedSelected;
    });
  });
};

// utensils filter - wrapper around filterByField
export const filterByutensils = (recipes, utensils) => {
  return filterByField(recipes, utensils, "utensils");
};
