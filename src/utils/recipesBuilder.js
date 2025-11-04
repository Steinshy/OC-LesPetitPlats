import { updateCount } from "../search.js";
import { cacheGetOrSet } from "./cache.js";

const BASE = import.meta.env.BASE_URL || "/";
// utils
const withBase = (p) => `${BASE}${p.replace(/^\/+/, "")}`;
const encodePath = (p) => String(p).split("/").filter(Boolean).map(encodeURIComponent).join("/");
const DATA_URL = withBase("api/data.json");

export const fetchRecipes = async () => {
  const response = await fetch(DATA_URL, {
    headers: { Accept: "application/json" },
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error(`Network error: ${response.status} for ${DATA_URL}`);
  }
  const items = await response.json();
  return Array.isArray(items) ? items : [];
};

// Data builders ingredients
const buildIngredients = item => {
  const ingredients = Array.isArray(item?.ingredients) ? item.ingredients : [];
  return ingredients.map(ingredient => ({
    name: ingredient?.ingredient ?? "",
    quantity: ingredient?.quantity ?? 0,
    unitType: ingredient?.unit ?? "",
  }));
};

// Data builders image
const buildImages = item => {
  const alt = item?.name ?? "";
  let src = item?.image ?? "";
  
  if (!src || /^https?:\/\//i.test(src)) {
    return { alt, jpgUrl: src || "", webpUrl: "" };
  }

  src = src.replace(/^\/+/, "").replace(/^(?!recipes\/)/, "recipes/");
  return { alt, jpgUrl: withBase(encodePath(src)), webpUrl: withBase(encodePath(src.replace(/\.jpg$/, ".webp"))) };
};

// Data builders search text
const buildSearch = (ingredients, item) => {
  const words = [
    item?.name ?? "",
    ...ingredients.map(ingredient => ingredient?.name ?? ""),
    ...(Array.isArray(item?.ustensils) ? item?.ustensils : []),
    item?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
};

// Build recipes
export const buildRecipes = async () => {
  const recipes = await cacheGetOrSet("recipes_v1", async () => {
    const items = await fetchRecipes();
    return items.map(item => {
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
        ustensils: Array.isArray(item?.ustensils) ? item?.ustensils : [],
        image,
        search,
      };
    });
  });
  updateCount(recipes.length);
  return recipes;
};
