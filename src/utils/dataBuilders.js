const DATA_URL = "/api/data.json";
import { cacheGetOrSet } from "./cache.js";

// Data builders ingredients
const buildIngredientsFromData = (rawData) => {
  const items = Array.isArray(rawData?.ingredients) ? rawData.ingredients : [];
  return items.map((ingredient) => ({
    name: ingredient.ingredient ?? "",
    quantity: ingredient.quantity ?? 0,
    unitType: ingredient.unit ?? "",
  }));
};

// Data builders image
const buildImageFromData = (rawData) => {
  const imageJpg = rawData?.image ?? "";
  return {
    alt: rawData?.name ?? "",
    jpgUrl: imageJpg,
    webpUrl: "",
  };
};

// Data builders search text
const buildSearchTextFrom = (ingredients, rawData) => {
  const words = [
    rawData?.name ?? "",
    ...ingredients.map((ingredient) => ingredient.name),
    ...(Array.isArray(rawData?.ustensils) ? rawData.ustensils : []),
    rawData?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
};

// Data builders recipe
const buildRecipe = (data) => {
  const ingredients = buildIngredientsFromData(data);
  const image = buildImageFromData(data);
  const searchText = buildSearchTextFrom(ingredients, data);
  return {
    id: data?.id ?? 0,
    name: data?.name ?? "",
    description: data?.description ?? "",
    servings: data?.servings ?? 0,
    time: data?.time ?? 0,
    appliance: data?.appliance ?? "",
    ingredients,
    ustensils: Array.isArray(data?.ustensils) ? data.ustensils : [],
    image,
    searchText,
  };
};

// Get recipes
export const getRecipes = async () => {
  const response = await fetch(DATA_URL, {
    headers: { Accept: "application/json" },
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

// Build recipes
export const buildRecipes = async () => {
  const recipes = await cacheGetOrSet("recipes_v1", async () => {
    const data = await getRecipes();
    return data.map((item) => buildRecipe(item));
  });
  return recipes;
};
