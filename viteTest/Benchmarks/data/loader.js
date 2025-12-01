
// Paths and data loading utilities for benchmarks
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path constants
const DATA_FILE = "data.json";

// Path to benchmark data file
// This file is at: viteTest/Benchmarks/data/loader.js
// Data file is at: viteTest/Benchmarks/data/data.json (./data.json from here)
const benchmarkDataPath = resolve(__dirname, DATA_FILE);

// Data loading
export const benchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

// Extract unique values from benchmark data
function extractUniqueValues(data) {
  const ingredients = new Set();
  const appliances = new Set();
  const utensils = new Set();

  data.forEach(recipe => {
    if (recipe.appliance) {
      appliances.add(recipe.appliance);
    }
    if (recipe.utensils && Array.isArray(recipe.utensils)) {
      recipe.utensils.forEach(ustensil => {
        if (ustensil) utensils.add(ustensil);
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
    utensils: [...utensils],
  };
}

// Extract and export unique values
export const uniqueValues = extractUniqueValues(benchmarkData);
