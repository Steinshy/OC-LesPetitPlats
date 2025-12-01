// src/utils/recipesBuilder.js
import { baseUrl } from "@utils/config.js";
import { fetchRecipes } from "@utils/recipeApi.js";

// Build image URLs from recipe data
const buildImages = recipe => {
  const base = recipe?.image?.replace(/\.[^./]+$/, "") || recipe?.image;
  return {
    alt: recipe?.name || "",
    jpgUrl: base ? `${baseUrl}recipes/${base}.jpg` : null,
    webpUrl: base ? `${baseUrl}recipes/${base}.webp` : null,
  };
};

// Transform API response to app model
const transformRecipes = apiRecipesData =>
  apiRecipesData.map(recipe => {
    const images = buildImages(recipe);

    return {
      id: recipe?.id || 0,
      name: recipe?.name || "",
      description: recipe?.description || "",
      servings: recipe?.servings || 0,
      time: recipe?.time || 0,
      ingredients: recipe?.ingredients || [],
      utensils: recipe?.ustensils || [],
      appliance: recipe?.appliance || "",
      images,
    };
  });

// Fetch and transform recipes
export const buildRecipesData = async () => {
  const recipesResult = await fetchRecipes();
  return recipesResult.map(transformRecipes);
};
