import { cacheGetOrSet } from "./cache.js";

const BASE = import.meta.env.BASE_URL || "/";
const DATA_URL = `${BASE}${"api/data.json".replace(/^\/+/, "")}`;

const withBase = path => `${BASE}${path.replace(/^\/+/, "")}`;
const encodePath = path =>
  String(path).split("/").filter(Boolean).map(encodeURIComponent).join("/");

const fetchRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    const fetchRawRecipes = async () => {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`Network error: ${response.status}`);
      const recipes = await response.json();
      return Array.isArray(recipes) ? recipes : [];
    };
    return fetchRawRecipes();
  });
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

const buildUstensils = rawItem => {
  const ustensils = Array.isArray(rawItem?.ustensils) ? rawItem.ustensils : [];
  return ustensils.map(ustensil => ustensil?.name);
};

const buildRecipe = rawItem => {
  const ingredients = buildIngredients(rawItem);
  const images = buildImages(rawItem);
  const search = buildSearch(ingredients, rawItem);
  const ustensils = buildUstensils(rawItem);

  return {
    id: rawItem?.id || 0,
    name: rawItem?.name || "",
    description: rawItem?.description || "",
    servings: rawItem?.servings || 0,
    time: rawItem?.time || 0,
    appliance: rawItem?.appliance || "",
    ingredients,
    ustensils,
    images,
    search,
  };
};

export const buildRecipesData = async () => {
  const recipes = await fetchRecipes();
  return recipes.map(buildRecipe);
};
