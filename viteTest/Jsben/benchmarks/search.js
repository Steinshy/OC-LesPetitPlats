// Search filter benchmark generator
import { normalizeString } from "@viteTest-helper/jsben.js";

export function generateSearchBenchmark(sampleRecipes) {
  const searchTerm = "chocolat";

  return {
    setup: `${normalizeString}

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const searchTerm = ${JSON.stringify(searchTerm)};`,

    production: `// Production implementation using .map()/.filter()
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

const getRecipeFieldValues = (recipe, fieldType) => {
  const config = FIELD_CONFIG[fieldType];
  if (!config) return [];
  const rawValue = config.extract(recipe);
  if (!rawValue) return [];
  const values = config.isArray ? rawValue : [rawValue];
  return values.filter(Boolean).map(normalizeString);
};

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

const filterBySearchTerm = (recipes, searchTerm) => {
  if (!Array.isArray(recipes)) return [];
  const query = normalizeString(searchTerm);
  if (!query) return recipes;
  return recipes.filter(recipe => {
    if (!recipe) return false;
    const text = normalizeString(buildSearchableText(recipe));
    return text.includes(query);
  });
};

return filterBySearchTerm(recipes, searchTerm);`,

    forEach: `// forEach implementation
const filterBySearchTerm = (recipes, searchTerm) => {
  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  const result = [];
  recipes.forEach(recipe => {
    if (!recipe) return;

    const ingredientNames = [];
    (recipe.ingredients || []).forEach(ingredient => {
      const name = ingredient?.ingredient;
      if (name) ingredientNames.push(name);
    });

    const haystackParts = [];
    if (recipe.name) haystackParts.push(recipe.name);
    if (recipe.description) haystackParts.push(recipe.description);
    ingredientNames.forEach(name => haystackParts.push(name));
    if (recipe.appliance) haystackParts.push(recipe.appliance);
    (recipe.utensils || []).forEach(utensil => {
      if (utensil) haystackParts.push(utensil);
    });

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

return filterBySearchTerm(recipes, searchTerm);`,
  };
}

