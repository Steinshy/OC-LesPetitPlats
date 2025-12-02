// Production filter functions from src/utils/filterEngine.js and src/utils/normalize.js
const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

// Field configuration
const FIELD_CONFIG = {
  ingredients: {
    extract: recipe => (recipe.ingredients || []).map(ingredient => ingredient?.ingredient),
    isArray: true,
  },
  appliances: {
    extract: recipe => recipe.appliance,
    isArray: false,
  },
  utensils: {
    extract: recipe => recipe.utensils || [],
    isArray: true,
  },
};

const SEARCHABLE_FIELDS = ["name", "description", "appliance"];

// Normalize and flatten recipe values for a given field
const getRecipeFieldValues = (recipe, fieldType) => {
  const config = FIELD_CONFIG[fieldType];
  if (!config) return [];

  const rawValue = config.extract(recipe);
  if (!rawValue) return [];

  const values = config.isArray ? rawValue : [rawValue];
  return values.filter(Boolean).map(normalizeString);
};

// Build searchable text from a recipe
const buildSearchableText = recipe => {
  const parts = [];

  for (const field of SEARCHABLE_FIELDS) {
    if (recipe[field]) parts.push(recipe[field]);
  }

  for (const config of Object.values(FIELD_CONFIG)) {
    if (config.isArray) {
      const values = config.extract(recipe);
      if (Array.isArray(values)) {
        parts.push(...values.filter(Boolean));
      }
    }
  }

  return parts.join(" ");
};

// Filter recipes by search term (wrapped as filterBySearchTerm for benchmark compatibility)
export const filterBySearchTerm = (recipes, searchTerm) => {
  if (!Array.isArray(recipes)) return [];

  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  return recipes.filter(recipe => {
    if (!recipe) return false;
    const text = normalizeString(buildSearchableText(recipe));
    return text.includes(query);
  });
};

// Filter recipes by a specific field
const filterByField = (recipes, selectedValues, fieldType) => {
  if (!Array.isArray(recipes)) return [];
  if (!FIELD_CONFIG[fieldType]) return recipes;

  const selected = selectedValues instanceof Set ? [...selectedValues] : selectedValues;
  if (!selected || selected.length === 0) return recipes;

  return recipes.filter(recipe => {
    if (!recipe) return false;
    const recipeValues = getRecipeFieldValues(recipe, fieldType);
    const normalizedSelected = selected.map(normalizeString);
    return normalizedSelected.every(value => recipeValues.includes(value));
  });
};

// Ingredients filter wrapper
export const filterByIngredients = (recipes, ingredients) => {
  return filterByField(recipes, ingredients, "ingredients");
};

// Appliances filter uses OR logic (any appliance matches)
export const filterByAppliances = (recipes, appliances) => {
  if (!Array.isArray(recipes)) return [];

  const selected = appliances instanceof Set ? [...appliances] : appliances;
  if (!selected || selected.length === 0) return recipes;

  const normalizedSelected = selected.map(normalizeString);

  return recipes.filter(recipe => {
    if (!recipe) return false;
    const recipeAppliance = normalizeString(recipe.appliance || "");
    return normalizedSelected.some(selectedAppliance => selectedAppliance === recipeAppliance);
  });
};

// Utensils filter wrapper
export const filterByutensils = (recipes, utensils) => {
  return filterByField(recipes, utensils, "utensils");
};
