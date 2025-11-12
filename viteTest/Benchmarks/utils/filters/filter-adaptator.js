// Benchmark adapter: handles raw recipe data for benchmark tests
import {
  filterBySearchTerm as filterBySearchTermProd,
  filterByIngredients as filterByIngredientsProd,
  filterByAppliances as filterByAppliancesProd,
  filterByUstensils as filterByUstensilsProd,
  filterRecipes as filterRecipesProd,
} from "../../../../src/components/search/filter.js";

const buildSearchForRawRecipe = recipe => {
  // Recipe ingredients
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  // Recipe ustensils
  const ustensils = Array.isArray(recipe?.ustensils) ? recipe.ustensils : [];
  // Searchable words array
  const words = [
    recipe?.name ?? "",
    ...ingredients.map(ing => ing.name ?? ing.ingredient ?? ""),
    ...ustensils,
    recipe?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
};

const processRecipes = recipes => {
  return recipes.map(recipe => {
    if (recipe.search && typeof recipe.search === "string") {
      return recipe;
    }
    return { ...recipe, search: buildSearchForRawRecipe(recipe) };
  });
};

export const filterBySearchTerm = (recipes, searchTerm) => {
  return filterBySearchTermProd(processRecipes(recipes), searchTerm);
};

export const filterByIngredients = (recipes, ingredients) => {
  // Process each recipe
  const processedRecipes = recipes.map(recipe => {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      return recipe;
    }
    // Normalize ingredient structure
    const processedIngredients = recipe.ingredients.map(ing => {
      if (ing.name) return ing;
      if (ing.ingredient) return { ...ing, name: ing.ingredient };
      return ing;
    });
    return { ...recipe, ingredients: processedIngredients };
  });
  return filterByIngredientsProd(processedRecipes, ingredients);
};

export const filterByAppliances = filterByAppliancesProd;
export const filterByUstensils = filterByUstensilsProd;

export const filterRecipes = (recipes, searchTermOrFilters, activeFilters) => {
  return filterRecipesProd(processRecipes(recipes), searchTermOrFilters, activeFilters);
};
