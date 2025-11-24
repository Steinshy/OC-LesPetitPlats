import { ok, err } from "neverthrow";
import { cacheGetOrSet } from "./cache.js";
import { dataUrl } from "./string.js";

const fetchRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    try {
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
};

export { fetchRecipes };
