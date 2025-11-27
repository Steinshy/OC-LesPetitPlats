// Shared test data and constants for LesPetitPlats component tests
// Constants (merged from constants.js)
export const RECIPE_1 = "Recipe 1";
export const RECIPE_2 = "Recipe 2";
export const RECIPE_ONE = "Recipe One";

// Common DOM selectors
export const FILTER_TAG_SELECTOR = ".filter-tag";
export const RESULTS_COUNTER_SELECTOR = ".results-counter h2";
export const SEARCH_INPUT_SELECTOR = ".main-search-bar input";
export const SEARCH_BUTTON_SELECTOR = ".main-search-bar .search-btn";
export const INGREDIENTS_LIST_SELECTOR = ".ingredients-list";
export const FILTERS_BOX_SELECTOR = ".filters-box";

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
  {
    name: "Pasta Carbonara",
    description: "Classic Italian pasta dish with eggs and bacon",
    ingredients: [{ name: "Pasta" }, { name: "Eggs" }, { name: "Bacon" }, { name: "Cheese" }],
    appliance: "Stove",
    ustensils: ["Pan", "Whisk", "Spoon"],
    search: "pasta carbonara classic italian pasta dish with eggs and bacon stove pan whisk spoon",
  },
  {
    name: "Chocolate Cake",
    description: "Delicious homemade chocolate cake",
    ingredients: [{ name: "Flour" }, { name: "Sugar" }, { name: "Cocoa" }, { name: "Eggs" }],
    appliance: "Oven",
    ustensils: ["Whisk", "Bowl", "Spatula"],
    search: "chocolate cake delicious homemade chocolate cake flour sugar cocoa eggs oven whisk bowl spatula",
  },
  {
    name: "Grilled Salmon",
    description: "Fresh salmon with herbs and lemon",
    ingredients: [{ name: "Salmon" }, { name: "Lemon" }, { name: "Herbs" }],
    appliance: "Grill",
    ustensils: ["Tongs", "Knife"],
    search: "grilled salmon fresh salmon with herbs and lemon grill tongs knife",
  },
  {
    name: "Vegetable Soup",
    description: "Healthy vegetable soup",
    ingredients: [{ name: "Carrot" }, { name: "Potato" }, { name: "Onion" }, { name: "Celery" }],
    appliance: "Stove",
    ustensils: ["Pot", "Ladle", "Knife"],
    search: "vegetable soup healthy vegetable soup carrot potato onion celery stove pot ladle knife",
  },
  {
    name: "Beef Stew",
    description: "Hearty beef stew with vegetables",
    ingredients: [{ name: "Beef" }, { name: "Potato" }, { name: "Carrot" }, { name: "Onion" }],
    appliance: "Stove",
    ustensils: ["Pot", "Spoon", "Knife"],
    search: "beef stew hearty beef stew with vegetables beef potato carrot onion stove pot spoon knife",
  },
  {
    name: "Caesar Salad",
    description: "Fresh Caesar salad with croutons",
    ingredients: [{ name: "Lettuce" }, { name: "Cheese" }, { name: "Croutons" }],
    appliance: "None",
    ustensils: ["Bowl", "Fork"],
    search: "caesar salad fresh caesar salad with croutons lettuce cheese croutons none bowl fork",
  },
  {
    name: "Chicken Curry",
    description: "Spicy chicken curry with rice",
    ingredients: [{ name: "Chicken" }, { name: "Rice" }, { name: "Curry Powder" }, { name: "Onion" }],
    appliance: "Stove",
    ustensils: ["Pan", "Spoon", "Knife"],
    search: "chicken curry spicy chicken curry with rice chicken rice curry powder onion stove pan spoon knife",
  },
];

// Mock recipes for search tests (simplified)
export const mockRecipesForSearch = [
  { name: RECIPE_1, search: "recipe one test" },
  { name: RECIPE_2, search: "recipe two test" },
  { name: "Recipe 3", search: "recipe three test" },
  { name: "Pasta Carbonara", search: "pasta carbonara italian" },
  { name: "Chocolate Cake", search: "chocolate cake dessert" },
  { name: "Grilled Salmon", search: "grilled salmon fish" },
  { name: "Vegetable Soup", search: "vegetable soup healthy" },
  { name: "Beef Stew", search: "beef stew meat" },
  { name: "Caesar Salad", search: "caesar salad fresh" },
  { name: "Chicken Curry", search: "chicken curry spicy" },
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
  {
    ingredients: [{ name: "Pasta" }, { name: "Eggs" }, { name: "Bacon" }, { name: "Cheese" }],
    appliance: "Stove",
    ustensils: ["Pan", "Whisk", "Spoon"],
  },
  {
    ingredients: [{ name: "Flour" }, { name: "Sugar" }, { name: "Cocoa" }, { name: "Eggs" }],
    appliance: "Oven",
    ustensils: ["Whisk", "Bowl", "Spatula"],
  },
  {
    ingredients: [{ name: "Salmon" }, { name: "Lemon" }, { name: "Herbs" }],
    appliance: "Grill",
    ustensils: ["Tongs", "Knife"],
  },
  {
    ingredients: [{ name: "Carrot" }, { name: "Potato" }, { name: "Onion" }, { name: "Celery" }],
    appliance: "Stove",
    ustensils: ["Pot", "Ladle", "Knife"],
  },
  {
    ingredients: [{ name: "Beef" }, { name: "Potato" }, { name: "Carrot" }, { name: "Onion" }],
    appliance: "Stove",
    ustensils: ["Pot", "Spoon", "Knife"],
  },
  {
    ingredients: [{ name: "Lettuce" }, { name: "Cheese" }, { name: "Croutons" }],
    appliance: "None",
    ustensils: ["Bowl", "Fork"],
  },
  {
    ingredients: [{ name: "Chicken" }, { name: "Rice" }, { name: "Curry Powder" }, { name: "Onion" }],
    appliance: "Stove",
    ustensils: ["Pan", "Spoon", "Knife"],
  },
];
