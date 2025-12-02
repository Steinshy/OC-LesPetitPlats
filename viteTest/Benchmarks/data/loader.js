// Data loading utilities for benchmarks
import { readFile, getDirname, joinPath } from "@viteTest-helper/fileSystem.js";

const DATA_FILE = "data.json";
const benchmarkDataPath = joinPath(getDirname(import.meta.url), DATA_FILE);
const dataContent = readFile(benchmarkDataPath, "utf-8");
if (!dataContent) {
  throw new Error(`Failed to load benchmark data from ${benchmarkDataPath}`);
}
const rawData = JSON.parse(dataContent);

const normalizedData = rawData.map(recipe => {
  const normalized = { ...recipe };
  if (normalized.ustensils && !normalized.utensils) {
    normalized.utensils = normalized.ustensils;
    delete normalized.ustensils;
  }
  return normalized;
});

export const benchmarkData = normalizedData;

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
      recipe.utensils.forEach(utensil => {
        if (utensil) utensils.add(utensil);
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
