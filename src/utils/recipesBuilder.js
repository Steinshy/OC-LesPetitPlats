import { fetchRecipes } from "./recipeApi.js";
import { jpgUrl, webpUrl } from "./string.js";

const buildImages = recipe => {
  return {
    alt: recipe?.name || "",
    jpgUrl: jpgUrl(recipe?.image) || null,
    webpUrl: webpUrl(recipe?.image) || null,
  };
};
export const buildRecipesData = async () => {
  const apiRecipesData = await fetchRecipes();

  const builtRecipesData = apiRecipesData.map(recipe => {
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

  return builtRecipesData;
};
