import { cacheGetOrSet } from "@/utils/cache.js";

const BASE = import.meta.env.BASE_URL || "/";
const DATA_URL = `${BASE}${"api/data.json".replace(/^\/+/, "")}`;

const withBase = path => `${BASE}${path.replace(/^\/+/, "")}`;
const encodePath = path =>
  String(path).split("/").filter(Boolean).map(encodeURIComponent).join("/");

const fetchRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    const recipes = await response.json();
    return recipes || [];
  });
};

const buildIngredients = recipe => {
  const ingredients = recipe?.ingredients || [];
  return ingredients.map(ingredient => ({
    name: ingredient?.ingredient ?? "",
    quantity: ingredient?.quantity ?? null,
    unitType: ingredient?.unit ?? "",
  }));
};

const buildUstensils = recipe => {
  return recipe?.ustensils || [];
};

const buildImage = recipe => {
  const alt = recipe?.name ?? "";
  const src = recipe?.image;
  const imagePath = `recipes/${src}`;
  if (!src) {
    return { alt, jpgUrl: "", webpUrl: "" };
  }
  const jpgUrl = withBase(encodePath(imagePath));
  const webpUrl = withBase(encodePath(imagePath.replace(/\.jpg$/, ".webp")));
  return { alt, jpgUrl, webpUrl };
};

const buildSearch = (ingredients, item) => {
  const ustensils = item?.ustensils || [];
  const words = [
    item?.name ?? "",
    ...ingredients.map(ingredient => ingredient?.name ?? ""),
    ...ustensils,
    item?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
};

export const buildRecipesData = async () => {
  const recipesData = await fetchRecipes();

  const recipes = recipesData.map(recipe => {
    const ingredients = buildIngredients(recipe);
    const image = buildImage(recipe);
    const search = buildSearch(ingredients, recipe);
    const ustensils = buildUstensils(recipe);

    return {
      id: recipe?.id || 0,
      name: recipe?.name || "",
      description: recipe?.description || "",
      servings: recipe?.servings || 0,
      time: recipe?.time || 0,

      ingredients,
      ustensils,
      image,
      search,
    };
  });

  return recipes;
};
