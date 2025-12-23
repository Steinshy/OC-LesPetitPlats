// src/utils/recipeApi.js
import { cacheGetOrSet } from "@utils/cache.js";
import { baseUrl } from "@utils/config.js";

export const fetchRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    const dataUrl = `${baseUrl}api/data.json`;
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    const recipes = await response.json();
    return Array.isArray(recipes) ? recipes : [];
  });
};
