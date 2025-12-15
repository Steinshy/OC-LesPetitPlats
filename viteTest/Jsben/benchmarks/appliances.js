// Appliances filter benchmark generator
import { normalizeString } from "@viteTest-helper/jsben.js";

export function generateAppliancesBenchmark(sampleRecipes) {
  const appliancesSet = new Set();
  sampleRecipes.forEach(recipe => {
    if (recipe.appliance) appliancesSet.add(recipe.appliance);
  });
  const testAppliances = [...appliancesSet].slice(0, 3);

  return {
    setup: `${normalizeString}

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const appliances = ${JSON.stringify(testAppliances)};`,

    production: `// Production implementation from src/components/filters/engine.js
const filtersEngine = {
  extract: {
    appliances(recipe) {
      return recipe.appliance ? [normalizeString(recipe.appliance)] : [];
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

const filterByAppliances = (recipes, appliances) => {
  if (!Array.isArray(recipes)) return [];
  const selectedValues = appliances instanceof Set ? appliances : new Set(appliances || []);
  return filtersEngine.onFilter(recipes, selectedValues, "appliances");
};

filterByAppliances(recipes, appliances);`,

    forEach: `// forEach implementation
const canonicalizeTerm = value => normalizeString(value);

const filterByAppliances = (recipes, appliances) => {
  if (!appliances || (Array.isArray(appliances) && appliances.length === 0)) {
    return recipes;
  }

  const appliancesArray = [];
  appliances.forEach(app => appliancesArray.push(app));

  const result = [];
  recipes.forEach(recipe => {
    if (!recipe) return;

    const recipeAppliance = recipe.appliance;
    if (!recipeAppliance) return;

    const normalizedRecipeAppliance = canonicalizeTerm(recipeAppliance);
    const recipeApplianceArray = [normalizedRecipeAppliance];

    let allMatch = true;
    appliancesArray.forEach(selectedAppliance => {
      if (!allMatch) return;

      const normalizedSelected = canonicalizeTerm(selectedAppliance);
      let found = false;
      recipeApplianceArray.forEach(appliance => {
        if (found) return;
        if (appliance === normalizedSelected) {
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

filterByAppliances(recipes, appliances);`,
  };
}
