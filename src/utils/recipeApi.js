import { cacheGetOrSet } from "./cache.js";
import { dataUrl } from "./string.js";

const fetchRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    const recipes = await response.json();
    return Array.isArray(recipes) ? recipes : [];
  });
};

export { fetchRecipes };
