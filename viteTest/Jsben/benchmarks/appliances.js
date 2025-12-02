// Appliances filter benchmark generator
import { normalizeString, canonicalizeTerm } from "@viteTest-helper/jsben.js";

export function generateAppliancesBenchmark(sampleRecipes) {
  const appliancesSet = new Set();
  sampleRecipes.forEach(recipe => {
    if (recipe.appliance) appliancesSet.add(recipe.appliance);
  });
  const testAppliances = [...appliancesSet].slice(0, 3);

  return {
    setup: `${normalizeString}
${canonicalizeTerm}

const recipes = ${JSON.stringify(sampleRecipes, null, 2)};
const appliances = ${JSON.stringify(testAppliances)};`,

    production: `// Production implementation using .map()/.filter()
const filterByAppliances = (recipes, appliances) => {
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

return filterByAppliances(recipes, appliances);`,

    forEach: `// forEach implementation
const filterByAppliances = (recipes, appliances) => {
  if (!appliances || (Array.isArray(appliances) && appliances.length === 0)) {
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

return filterByAppliances(recipes, appliances);`,
  };
}

