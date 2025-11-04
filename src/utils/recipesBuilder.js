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
  const ustensils = Array.isArray(item?.ustensils) ? (item?.ustensils ?? []) : [];
  const words = [
    item?.name ?? "",
    ...ingredients.map(ingredient => ingredient?.name ?? ""),
    ...ustensils,
    item?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
};

// Helper function to process items in batches with yielding between batches
const buildBatches = async (items, processor, batchSize) => {
  const results = [];
  for (let startIndex = 0; startIndex < items.length; startIndex += batchSize) {
    const batch = items.slice(startIndex, startIndex + batchSize);
    const buildBatch = processor(batch);
    results.push(...buildBatch);
    if (startIndex + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  return results;
};

// Transform a single raw recipe item into a structured recipe object
const buildRecipe = (rawItem) => {
  const ingredients = buildIngredients(rawItem);
  const image = buildImages(rawItem);
  const search = buildSearch(ingredients, rawItem);
  return {
    id: rawItem?.id ?? 0,
    name: rawItem?.name ?? "",
    description: rawItem?.description ?? "",
    servings: rawItem?.servings ?? 0,
    time: rawItem?.time ?? 0,
    appliance: rawItem?.appliance ?? "",
    ingredients,
    ustensils: Array.isArray(rawItem?.ustensils) ? rawItem?.ustensils : [],
    image,
    search,
  };
};

// Transform a batch of raw recipe items into structured recipe objects
const buildRecipes = (rawItemsBatch) => {
  return rawItemsBatch.map(buildRecipe);
};

// Build recipes with batching to avoid blocking the main thread
export const fetchAndBuildRecipes = async () => {
  const recipes = await cacheGetOrSet("recipes_v1", async () => {
    const rawItems = await fetchRecipes();
    const RECIPES_PER_BATCH = 50;
    return buildBatches(rawItems, buildRecipes, RECIPES_PER_BATCH);
  });
  updateCount(recipes.length);
  return recipes;
};
