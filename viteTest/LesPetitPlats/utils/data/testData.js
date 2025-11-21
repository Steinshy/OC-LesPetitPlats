// Shared test data for LesPetitPlats component tests
import {
  RECIPE_1,
  RECIPE_2,
  RECIPE_ONE,
  FILTER_TAG_SELECTOR,
  RESULTS_COUNTER_SELECTOR,
  SEARCH_INPUT_SELECTOR,
  SEARCH_BUTTON_SELECTOR,
  INGREDIENTS_LIST_SELECTOR,
  FILTERS_BOX_SELECTOR,
} from "../constants.js";

// Export constants for convenience
export {
  RECIPE_1,
  RECIPE_2,
  RECIPE_ONE,
  FILTER_TAG_SELECTOR,
  RESULTS_COUNTER_SELECTOR,
  SEARCH_INPUT_SELECTOR,
  SEARCH_BUTTON_SELECTOR,
  INGREDIENTS_LIST_SELECTOR,
  FILTERS_BOX_SELECTOR,
};

// Mock recipes for filter tests (with search property)
export const mockRecipesWithSearch = [
  {
    name: RECIPE_ONE,
    description: "A recipe with one ingredient",
    ingredients: [{ name: "Tomato" }, { name: "Onion" }],
    appliance: "Oven",
    ustensils: ["Spoon", "Fork"],
    search: "recipe one tomato onion spoon fork oven",
  },
  {
    name: RECIPE_2,
    description: "A test recipe",
    ingredients: [{ name: "Potato" }, { name: "Onion" }],
    appliance: "Stove",
    ustensils: ["Knife", "Spoon"],
    search: "recipe 2 a test recipe potato onion knife spoon stove",
  },
  {
    name: "Recipe 3",
    description: "Another recipe",
    ingredients: [{ name: "Carrot" }],
    appliance: "Oven",
    ustensils: ["Fork"],
    search: "recipe 3 carrot fork oven",
  },
];

// Mock recipes for search tests (simplified)
export const mockRecipesForSearch = [
  { name: RECIPE_1, search: "recipe one test" },
  { name: RECIPE_2, search: "recipe two test" },
  { name: "Recipe 3", search: "recipe three test" },
];

// Mock recipes for dropdown tests (without search property)
export const mockRecipesForDropdown = [
  {
    ingredients: [{ name: "Tomato" }, { name: "Onion" }],
    appliance: "Oven",
    ustensils: ["Spoon", "Fork"],
  },
  {
    ingredients: [{ name: "Potato" }, { name: "Onion" }],
    appliance: "Stove",
    ustensils: ["Knife", "Spoon"],
  },
  {
    ingredients: [{ name: "Carrot" }],
    appliance: "Oven",
    ustensils: ["Fork"],
  },
];
