// Utensils filter benchmark generator
import { normalizeString } from "@viteTest-helper/jsben.js";

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

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const utensils = ${JSON.stringify(testUtensils)};`,

    production: `// Production implementation from src/components/filters/engine.js
const filtersEngine = {
  extract: {
    utensils(recipe) {
      return (recipe.utensils || []).filter(Boolean).map(normalizeString);
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

const filterByutensils = (recipes, utensils) => {
  if (!Array.isArray(recipes)) return [];
  const selectedValues = utensils instanceof Set ? utensils : new Set(utensils || []);
  return filtersEngine.onFilter(recipes, selectedValues, "utensils");
};

filterByutensils(recipes, utensils);`,

    forEach: `// forEach implementation
const canonicalizeTerm = value => normalizeString(value);

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

filterByutensils(recipes, utensils);`,
  };
}
