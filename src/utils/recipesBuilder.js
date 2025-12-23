// src/utils/recipesBuilder.js
import { baseUrl } from "@utils/config.js";
import { fetchRecipes } from "@utils/recipeApi.js";

const buildImages = recipe => {
  const base = recipe?.image?.replace(/\.[^./]+$/, "") || recipe?.image;
  return {
    alt: recipe?.name || "",
    jpgUrl: base ? `${baseUrl}pictures/card/${base}-card.jpg` : null,
    webpUrl: base ? `${baseUrl}pictures/card/${base}-card.webp` : null,
  };
};

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
      image: recipe?.image || "",
      images,
    };
  });

export const buildRecipes = async () => {
  const recipesResult = await fetchRecipes();
  return transformRecipes(recipesResult);
};
