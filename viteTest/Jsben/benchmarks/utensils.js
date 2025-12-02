// Utensils filter benchmark generator
import { normalizeString, canonicalizeTerm } from "@viteTest-helper/jsben.js";

export function generateUtensilsBenchmark(sampleRecipes) {
  const utensilsSet = new Set();
  sampleRecipes.forEach(recipe => {
    (recipe.utensils || []).forEach(ut => {
      if (ut) utensilsSet.add(ut);
    });
  });
  const testUtensils = [...utensilsSet].slice(0, 5);

  return {
    setup: `${normalizeString}
${canonicalizeTerm}

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const utensils = ${JSON.stringify(testUtensils)};`,

    production: `// Production implementation using .map()/.filter()
const FIELD_CONFIG = {
  utensils: {
    extract: recipe => recipe.utensils || [],
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

const filterByutensils = (recipes, utensils) => {
  return filterByField(recipes, utensils, "utensils");
};

return filterByutensils(recipes, utensils);`,

    forEach: `// forEach implementation
const filterByutensils = (recipes, utensils) => {
  if (!utensils || (Array.isArray(utensils) && utensils.length === 0)) {
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

return filterByutensils(recipes, utensils);`,
  };
}

