// src/utils/recipeApi.js

import { ok, err } from "neverthrow";
import { cacheGetOrSet } from "@utils/cache.js";
import { baseUrl } from "@utils/config.js";

export const dataUrl = `${baseUrl}api/data.json`;

const fetchRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    try {
      // return err(new Error("Test error: This is a test error message"));
      const response = await fetch(dataUrl);
      if (!response.ok) {
        return err(new Error(`Network error: ${response.status}`));
      }
      const recipes = await response.json();
      return ok(Array.isArray(recipes) ? recipes : []);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  });
  return result.isOk ? result : ok(result);
};

export { fetchRecipes };
