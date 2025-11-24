import { fetchRecipes } from "./recipeApi.js";
import { jpgUrl, webpUrl } from "./string.js";

const buildImages = recipe => {
  return {
    alt: recipe?.name || "",
    jpgUrl: jpgUrl(recipe?.image) || null,
    webpUrl: webpUrl(recipe?.image) || null,
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
      ustensils: recipe?.ustensils || [],
      appliance: recipe?.appliance || "",
      images,
    };
  });

export const buildRecipesData = async () => {
  const recipesResult = await fetchRecipes();
  return recipesResult.map(transformRecipes);
};
