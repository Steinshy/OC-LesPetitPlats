import { cacheGetOrSet } from "./cache.js";

const BASE = import.meta.env.BASE_URL || "/";
const DATA_URL = `${BASE}${"api/data.json".replace(/^\/+/, "")}`;

const withBase = path => `${BASE}${path.replace(/^\/+/, "")}`;
const encodePath = path =>
  String(path).split("/").filter(Boolean).map(encodeURIComponent).join("/");

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

const buildIngredients = item => {
  const ingredients = Array.isArray(item?.ingredients) ? item.ingredients : [];
  return ingredients.map(ingredient => ({
    name: ingredient?.ingredient ?? "",
    quantity: ingredient?.quantity ?? 0,
    unitType: ingredient?.unit ?? "",
  }));
};

const buildImages = item => {
  const alt = item?.name ?? "";
  let src = item?.image ?? "";

  if (!src || /^https?:\/\//i.test(src)) {
    return { alt, jpgUrl: src || "", webpUrl: "" };
  }

  src = src.replace(/^\/+/, "").replace(/^(?!recipes\/)/, "recipes/");
  return {
    alt,
    jpgUrl: withBase(encodePath(src)),
    webpUrl: withBase(encodePath(src.replace(/\.jpg$/, ".webp"))),
  };
};

const buildSearch = (ingredients, item) => {
  const ustensils = Array.isArray(item?.ustensils) ? item.ustensils : [];
  const words = [
    item?.name ?? "",
    ...ingredients.map(ingredient => ingredient?.name ?? ""),
    ...ustensils,
    item?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
};

const buildRecipe = rawItem => {
  const ingredients = buildIngredients(rawItem);
  return {
    id: rawItem?.id ?? 0,
    name: rawItem?.name ?? "",
    description: rawItem?.description ?? "",
    servings: rawItem?.servings ?? 0,
    time: rawItem?.time ?? 0,
    appliance: rawItem?.appliance ?? "",
    ingredients,
    ustensils: Array.isArray(rawItem?.ustensils) ? rawItem.ustensils : [],
    image: buildImages(rawItem),
    search: buildSearch(ingredients, rawItem),
  };
};

const buildRecipes = async (items, batchSize = 50) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(...batch.map(buildRecipe));
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  return results;
};

export const fetchAndBuildRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    const rawItems = await fetchRecipes();
    return buildRecipes(rawItems);
  });
};
