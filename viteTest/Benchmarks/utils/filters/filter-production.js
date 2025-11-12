// Production filter implementations for benchmarks
// Uses production filter functions from src/components/search/filter.js with functional mapping (.map())
// This implementation normalizes data using .map() before applying production filters
import {
  filterBySearchTerm as filterBySearchTermProd,
  filterByIngredients as filterByIngredientsProd,
  filterByAppliances as filterByAppliancesProd,
  filterByUstensils as filterByUstensilsProd,
  filterRecipes as filterRecipesProd,
} from "../../../../src/components/search/filter.js";

function mapRecipeToSearchString(recipe) {
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const ustensils = Array.isArray(recipe?.ustensils) ? recipe.ustensils : [];
  const words = [
    recipe?.name ?? "",
    ...ingredients.map(ing => ing.name ?? ing.ingredient ?? ""),
    ...ustensils,
    recipe?.appliance ?? "",
  ];
  return words.join(" ").toLowerCase();
}

function mapRecipesToNormalized(recipes) {
  return recipes.map(recipe => {
    if (recipe.search && typeof recipe.search === "string") {
      return recipe;
    }
    return { ...recipe, search: mapRecipeToSearchString(recipe) };
  });
}

// Filter recipes by search term using production filters
export function filterBySearchTerm(recipes, searchTerm) {
  return filterBySearchTermProd(mapRecipesToNormalized(recipes), searchTerm);
}

function mapIngredientsToNormalized(recipes) {
  return recipes.map(recipe => {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      return recipe;
    }
    const normalizedIngredients = recipe.ingredients.map(ing => {
      if (ing.name) return ing;
      if (ing.ingredient) return { ...ing, name: ing.ingredient };
      return ing;
    });
    return { ...recipe, ingredients: normalizedIngredients };
  });
}

// Filter recipes by ingredients using production filters
export function filterByIngredients(recipes, ingredients) {
  return filterByIngredientsProd(mapIngredientsToNormalized(recipes), ingredients);
}

// Filter recipes by appliances using production filters
export const filterByAppliances = filterByAppliancesProd;
// Filter recipes by ustensils using production filters
export const filterByUstensils = filterByUstensilsProd;

// Filter recipes with multiple filters using production filters
export function filterRecipes(recipes, searchTermOrFilters, activeFilters) {
  return filterRecipesProd(mapRecipesToNormalized(recipes), searchTermOrFilters, activeFilters);
}
