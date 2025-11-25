import { fetchRecipes } from "./recipeApi.js";
import { baseUrl } from "./string.js";

const buildImages = recipe => {
  const base = recipe?.image?.replace(/\.[^./]+$/, "") || recipe?.image;
  return {
    alt: recipe?.name || "",
    jpgUrl: base ? `${baseUrl}recipes/${base}.jpg` : null,
    webpUrl: base ? `${baseUrl}recipes/${base}.webp` : null,
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
