// Paths and data loading utilities for benchmarks
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path constants
const DATA_FILE = "data-benchmark.json";

// Path to benchmark data file
const benchmarkDataPath = resolve(__dirname, "../../../../public/api", DATA_FILE);

// Data loading
export const benchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

// Extract unique values from benchmark data
function extractUniqueValues(data) {
  const ingredients = new Set();
  const appliances = new Set();
  const ustensils = new Set();

  data.forEach(recipe => {
    if (recipe.appliance) {
      appliances.add(recipe.appliance);
    }
    if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
      recipe.ustensils.forEach(ustensil => {
        if (ustensil) ustensils.add(ustensil);
      });
    }
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach(ingredient => {
        const ingredientName = ingredient.ingredient || ingredient.name;
        if (ingredientName) {
          ingredients.add(ingredientName);
        }
      });
    }
  });

  return {
    ingredients: [...ingredients],
    appliances: [...appliances],
    ustensils: [...ustensils],
  };
}

// Extract and export unique values
export const uniqueValues = extractUniqueValues(benchmarkData);
