// Search filter benchmark generator
import { normalizeString } from "@viteTest-helper/jsben.js";

export function generateSearchBenchmark(sampleRecipes) {
  const searchTerm = "chocolat";

  return {
    setup: `${normalizeString}

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const searchTerm = ${JSON.stringify(searchTerm)};`,

    production: `// Production implementation from src/components/filters/engine.js
const filtersEngine = {
  extract: {
    ingredients(recipe) {
      return (recipe.ingredients || [])
        .map(i => i?.ingredient)
        .filter(Boolean)
        .map(normalizeString);
    },
    appliances(recipe) {
      return recipe.appliance ? [normalizeString(recipe.appliance)] : [];
    },
    utensils(recipe) {
      return (recipe.utensils || []).filter(Boolean).map(normalizeString);
    },
  },
  buildSearchText(recipe) {
    const base = [recipe.name, recipe.description, recipe.appliance];
    const extras = [];
    if (Array.isArray(recipe.ingredients)) {
      extras.push(...recipe.ingredients.map(i => i?.ingredient));
    }
    if (Array.isArray(recipe.utensils)) {
      extras.push(...recipe.utensils);
    }
    return normalizeString([...base, ...extras].filter(Boolean).join(" "));
  },
  onSearch(recipes, searchTerm) {
    const query = normalizeString(searchTerm);
    if (!query) return recipes;
    return recipes.filter(recipe => this.buildSearchText(recipe).includes(query));
  },
};

const filterBySearchTerm = (recipes, searchTerm) => {
  if (!Array.isArray(recipes)) return [];
  return filtersEngine.onSearch(recipes, searchTerm);
};

filterBySearchTerm(recipes, searchTerm);`,

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

filterBySearchTerm(recipes, searchTerm);`,
  };
}
