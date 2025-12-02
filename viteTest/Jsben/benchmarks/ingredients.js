// Ingredients filter benchmark generator
import { normalizeString, canonicalizeTerm } from "@viteTest-helper/jsben.js";

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
${canonicalizeTerm}

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const ingredients = ${JSON.stringify(testIngredients)};`,

    production: `// Production implementation using .map()/.filter()
const FIELD_CONFIG = {
  ingredients: {
    extract: recipe => (recipe.ingredients || []).map(ingredient => ingredient?.ingredient),
    isArray: true,
  },
};

const getRecipeFieldValues = (recipe, fieldType) => {
  const config = FIELD_CONFIG[fieldType];
  if (!config) return [];
  const rawValue = config.extract(recipe);
  if (!rawValue) return [];
  const values = config.isArray ? rawValue : [rawValue];
  return values.filter(Boolean).map(normalizeString);
};

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

const filterByIngredients = (recipes, ingredients) => {
  return filterByField(recipes, ingredients, "ingredients");
};

return filterByIngredients(recipes, ingredients);`,

    forEach: `// forEach implementation
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

return filterByIngredients(recipes, ingredients);`,
  };
}

