const DATA_URL = "/api/data.json";
import { updateCount } from "../search.js";
import { cacheGetOrSet } from "./cache.js";

export const fetchRecipes = async () => {
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

// Data builders ingredients
const buildIngredients = rawData => {
  const items = Array.isArray(rawData?.ingredients) ? rawData.ingredients : [];
  return items.map(ingredient => ({
    name: ingredient.ingredient ?? "",
    quantity: ingredient.quantity ?? 0,
    unitType: ingredient.unit ?? "",
  }));
};

// Data builders image
const buildImages = rawData => {
  const imageJpg = rawData?.image ?? "";
  return {
    alt: rawData?.name ?? "",
    jpgUrl: imageJpg,
    webpUrl: "",
  };
};

// Data builders search text
const buildSearch = (ingredients, rawData) => {
  const words = [
    rawData?.name ?? "",
    ...ingredients.map(ingredient => ingredient.name),
    ...(Array.isArray(rawData?.ustensils) ? rawData.ustensils : []),
    rawData?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
};

// Build recipes
export const buildRecipes = async () => {
  const recipes = await cacheGetOrSet("recipes_v1", async () => {
    const data = await fetchRecipes();
    return data.map(item => {
      // Build ingredients
      const ingredients = buildIngredients(item);

      // Build images
      const image = buildImages(item);

      // Build search text
      const search = buildSearch(ingredients, item);

      // Return built recipe object
      return {
        id: item?.id ?? 0,
        name: item?.name ?? "",
        description: item?.description ?? "",
        servings: item?.servings ?? 0,
        time: item?.time ?? 0,
        appliance: item?.appliance ?? "",
        ingredients,
        ustensils: Array.isArray(item?.ustensils) ? item.ustensils : [],
        image,
        search,
      };
    });
  });
  updateCount(recipes.length);
  return recipes;
};
