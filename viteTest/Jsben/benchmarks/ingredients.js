// Ingredients filter benchmark generator
import { normalizeString } from "@viteTest-helper/jsben.js";

export function generateIngredientsBenchmark(sampleRecipes) {
  const ingredientsSet = new Set();
  sampleRecipes.forEach(recipe => {
    (recipe.ingredients || []).forEach(ing => {
      if (ing?.ingredient) ingredientsSet.add(ing.ingredient);
    });
  });
  const testIngredients = [...ingredientsSet].slice(0, 5);

  return {
    setup: `${normalizeString}

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const ingredients = ${JSON.stringify(testIngredients)};`,

    production: `// Production implementation from src/components/filters/engine.js
const filtersEngine = {
  extract: {
    ingredients(recipe) {
      return (recipe.ingredients || [])
        .map(i => i?.ingredient)
        .filter(Boolean)
        .map(normalizeString);
    },
  },
  onFilter(recipes, selectedValues, type) {
    if (!selectedValues || selectedValues.size === 0) return recipes;
    const extractMethod = this.extract[type];
    if (typeof extractMethod !== "function") return recipes;
    const selected = [...selectedValues];
    return recipes.filter(recipe => {
      const values = extractMethod(recipe);
      return selected.every(v => values.includes(normalizeString(v)));
    });
  },
};

const filterByIngredients = (recipes, ingredients) => {
  if (!Array.isArray(recipes)) return [];
  const selectedValues = ingredients instanceof Set ? ingredients : new Set(ingredients || []);
  return filtersEngine.onFilter(recipes, selectedValues, "ingredients");
};

filterByIngredients(recipes, ingredients);`,

    forEach: `// forEach implementation
const canonicalizeTerm = value => normalizeString(value);

const filterByIngredients = (recipes, ingredients) => {
  if (!ingredients || (Array.isArray(ingredients) && ingredients.length === 0)) {
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

filterByIngredients(recipes, ingredients);`,
  };
}
