import { normalizeString } from "@/helper/helper.js";
import { cacheGetOrSet } from "@/utils/cache.js";

const BASE = import.meta.env.BASE_URL || "/";
const DATA_URL = `${BASE}${"api/data.json".replace(/^\/+/, "")}`;
const imagePath = src => `recipes/${src}`;

const withBase = path => `${BASE}${path.replace(/^\/+/, "")}`;
const encodePath = path =>
  String(path).split("/").filter(Boolean).map(encodeURIComponent).join("/");

const fetchRecipes = async () => {
  return cacheGetOrSet("recipes_v1", async () => {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    const recipes = await response.json();
    return Array.isArray(recipes) ? recipes : [];
  });
};

const buildAppliances = recipe => {
  const appliance = recipe?.appliance;
  return appliance ? normalizeString(appliance) : "";
};

const buildUstensils = recipesData => {
  const ustensils = recipesData.flatMap(recipe => recipe?.ustensils || []);
  const normalized = ustensils.map(normalizeString).filter(Boolean);
  return [...new Set(normalized)].sort();
};

const buildUstensilsForRecipe = recipe => {
  const ustensils = recipe?.ustensils || [];
  return ustensils.map(normalizeString).filter(Boolean);
};

const buildIngredientsList = recipesData => {
  const allIngredients = recipesData.flatMap(recipe => {
    const ingredients = recipe?.ingredients || [];
    return ingredients.map(ingredient => normalizeString(ingredient?.ingredient)).filter(Boolean);
  });
  return [...new Set(allIngredients)].sort((a, b) => a.localeCompare(b));
};

const buildAppliancesList = recipesData => {
  const allAppliances = recipesData
    .map(recipe => normalizeString(recipe?.appliance))
    .filter(Boolean);
  return [...new Set(allAppliances)].sort((a, b) => a.localeCompare(b));
};

const buildIngredients = recipe => {
  const ingredients = recipe?.ingredients || [];
  return ingredients
    .map(ingredient => ({
      name: normalizeString(ingredient?.ingredient),
      quantity: ingredient?.quantity ?? null,
      unitType: normalizeString(ingredient?.unit),
    }))
    .filter(ingredient => Boolean(ingredient.name));
};

const buildImage = recipe => {
  const alt = recipe?.name ?? "";
  const src = recipe?.image;
  if (!src) {
    return { alt, jpgUrl: "", webpUrl: "" };
  }
  const jpgUrl = withBase(encodePath(imagePath(src)));
  const webpUrl = withBase(encodePath(imagePath(src).replace(/\.jpg$/, ".webp")));
  return { alt, jpgUrl, webpUrl };
};

const buildSearch = (ingredients, item) => {
  const words = [
    normalizeString(item?.name),
    ...ingredients.map(ingredient => ingredient.name),
    ...(item?.ustensils || []).map(normalizeString),
    normalizeString(item?.appliance),
  ];
  return words.filter(Boolean).join(" ").trim();
};

export const buildRecipesData = async () => {
  const recipesData = await fetchRecipes();

  const ustensils = buildUstensils(recipesData);
  const ingredientsList = buildIngredientsList(recipesData);
  const appliancesList = buildAppliancesList(recipesData);

  const recipes = recipesData.map(recipe => {
    const ingredients = buildIngredients(recipe);
    const image = buildImage(recipe);
    const search = buildSearch(ingredients, recipe);
    const appliance = buildAppliances(recipe);
    const recipeUstensils = buildUstensilsForRecipe(recipe);

    return {
      id: recipe?.id ?? 0,
      name: recipe?.name ?? "",
      description: recipe?.description ?? "",
      servings: recipe?.servings ?? 0,
      time: recipe?.time ?? 0,
      ingredients,
      ustensils: recipeUstensils,
      appliance,
      image,
      search,
    };
  });

  return {
    recipes,
    dropdownData: {
      ingredients: ingredientsList,
      appliances: appliancesList,
      ustensils,
    },
  };
};
