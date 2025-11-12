// Shared test data for component tests

// Recipe name constants
export const RECIPE_1 = "Recipe 1";
export const RECIPE_2 = "Recipe 2";
export const RECIPE_ONE = "Recipe One";

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

// Common selectors
export const FILTER_TAG_SELECTOR = ".filter-tag";
export const RESULTS_COUNTER_SELECTOR = ".results-counter h2";
export const SEARCH_INPUT_SELECTOR = ".search-bar-group input";
export const SEARCH_BUTTON_SELECTOR = ".search-bar-group .search-btn";
export const INGREDIENTS_LIST_SELECTOR = ".ingredients-list";
export const FILTERS_BOX_SELECTOR = ".filters-box";

