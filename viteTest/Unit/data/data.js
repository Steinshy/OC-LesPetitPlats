// Shared test data and constants for component tests
export const RECIPE_1 = "Recipe 1";
export const RECIPE_2 = "Recipe 2";
export const RECIPE_ONE = "Recipe One";

// Common DOM selectors
export const FILTER_TAG_SELECTOR = ".filter-tag";
export const RESULTS_COUNTER_SELECTOR = ".results-counter h2";
export const SEARCH_INPUT_SELECTOR = ".main-search-bar input";
export const SEARCH_BUTTON_SELECTOR = ".main-search-bar .search-button";
export const FILTERS_SELECTOR = ".filters";
export const FILTERS_TAGS_SELECTOR = "#tags-list";

// Mock recipes for filter tests
export const mockRecipesWithSearch = [
  {
    name: RECIPE_ONE,
    description: "A recipe with one ingredient",
    ingredients: [{ ingredient: "Tomato" }, { ingredient: "Onion" }],
    appliance: "Oven",
    utensils: ["Spoon", "Fork"],
    search: "recipe one tomato onion spoon fork oven",
  },
  {
    name: RECIPE_2,
    description: "A test recipe",
    ingredients: [{ ingredient: "Potato" }, { ingredient: "Onion" }],
    appliance: "Stove",
    utensils: ["Knife", "Spoon"],
    search: "recipe 2 a test recipe potato onion knife spoon stove",
  },
  {
    name: "Recipe 3",
    description: "Another recipe",
    ingredients: [{ ingredient: "Carrot" }],
    appliance: "Oven",
    utensils: ["Fork"],
    search: "recipe 3 carrot fork oven",
  },
  {
    name: "Pasta Carbonara",
    description: "Classic Italian pasta dish with eggs and bacon",
    ingredients: [
      { ingredient: "Pasta" },
      { ingredient: "Eggs" },
      { ingredient: "Bacon" },
      { ingredient: "Cheese" },
    ],
    appliance: "Stove",
    utensils: ["Pan", "Whisk", "Spoon"],
    search: "pasta carbonara classic italian pasta dish with eggs and bacon stove pan whisk spoon",
  },
  {
    name: "Chocolate Cake",
    description: "Delicious homemade chocolate cake",
    ingredients: [
      { ingredient: "Flour" },
      { ingredient: "Sugar" },
      { ingredient: "Cocoa" },
      { ingredient: "Eggs" },
    ],
    appliance: "Oven",
    utensils: ["Whisk", "Bowl", "Spatula"],
    search:
      "chocolate cake delicious homemade chocolate cake flour sugar cocoa eggs oven whisk bowl spatula",
  },
  {
    name: "Grilled Salmon",
    description: "Fresh salmon with herbs and lemon",
    ingredients: [{ ingredient: "Salmon" }, { ingredient: "Lemon" }, { ingredient: "Herbs" }],
    appliance: "Grill",
    utensils: ["Tongs", "Knife"],
    search: "grilled salmon fresh salmon with herbs and lemon grill tongs knife",
  },
  {
    name: "Vegetable Soup",
    description: "Healthy vegetable soup",
    ingredients: [
      { ingredient: "Carrot" },
      { ingredient: "Potato" },
      { ingredient: "Onion" },
      { ingredient: "Celery" },
    ],
    appliance: "Stove",
    utensils: ["Pot", "Ladle", "Knife"],
    search:
      "vegetable soup healthy vegetable soup carrot potato onion celery stove pot ladle knife",
  },
  {
    name: "Beef Stew",
    description: "Hearty beef stew with vegetables",
    ingredients: [
      { ingredient: "Beef" },
      { ingredient: "Potato" },
      { ingredient: "Carrot" },
      { ingredient: "Onion" },
    ],
    appliance: "Stove",
    utensils: ["Pot", "Spoon", "Knife"],
    search:
      "beef stew hearty beef stew with vegetables beef potato carrot onion stove pot spoon knife",
  },
  {
    name: "Caesar Salad",
    description: "Fresh Caesar salad with croutons",
    ingredients: [{ ingredient: "Lettuce" }, { ingredient: "Cheese" }, { ingredient: "Croutons" }],
    appliance: "None",
    utensils: ["Bowl", "Fork"],
    search: "caesar salad fresh caesar salad with croutons lettuce cheese croutons none bowl fork",
  },
  {
    name: "Chicken Curry",
    description: "Spicy chicken curry with rice",
    ingredients: [
      { ingredient: "Chicken" },
      { ingredient: "Rice" },
      { ingredient: "Curry Powder" },
      { ingredient: "Onion" },
    ],
    appliance: "Stove",
    utensils: ["Pan", "Spoon", "Knife"],
    search:
      "chicken curry spicy chicken curry with rice chicken rice curry powder onion stove pan spoon knife",
  },
];

// Mock recipes for search tests
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

// Mock recipes for dropdown tests
export const mockRecipesForDropdown = [
  {
    ingredients: [{ ingredient: "Tomato" }, { ingredient: "Onion" }],
    appliance: "Oven",
    utensils: ["Spoon", "Fork"],
  },
  {
    ingredients: [{ ingredient: "Potato" }, { ingredient: "Onion" }],
    appliance: "Stove",
    utensils: ["Knife", "Spoon"],
  },
  {
    ingredients: [{ ingredient: "Carrot" }],
    appliance: "Oven",
    utensils: ["Fork"],
  },
  {
    ingredients: [
      { ingredient: "Pasta" },
      { ingredient: "Eggs" },
      { ingredient: "Bacon" },
      { ingredient: "Cheese" },
    ],
    appliance: "Stove",
    utensils: ["Pan", "Whisk", "Spoon"],
  },
  {
    ingredients: [
      { ingredient: "Flour" },
      { ingredient: "Sugar" },
      { ingredient: "Cocoa" },
      { ingredient: "Eggs" },
    ],
    appliance: "Oven",
    utensils: ["Whisk", "Bowl", "Spatula"],
  },
  {
    ingredients: [{ ingredient: "Salmon" }, { ingredient: "Lemon" }, { ingredient: "Herbs" }],
    appliance: "Grill",
    utensils: ["Tongs", "Knife"],
  },
  {
    ingredients: [
      { ingredient: "Carrot" },
      { ingredient: "Potato" },
      { ingredient: "Onion" },
      { ingredient: "Celery" },
    ],
    appliance: "Stove",
    utensils: ["Pot", "Ladle", "Knife"],
  },
  {
    ingredients: [
      { ingredient: "Beef" },
      { ingredient: "Potato" },
      { ingredient: "Carrot" },
      { ingredient: "Onion" },
    ],
    appliance: "Stove",
    utensils: ["Pot", "Spoon", "Knife"],
  },
  {
    ingredients: [{ ingredient: "Lettuce" }, { ingredient: "Cheese" }, { ingredient: "Croutons" }],
    appliance: "None",
    utensils: ["Bowl", "Fork"],
  },
  {
    ingredients: [
      { ingredient: "Chicken" },
      { ingredient: "Rice" },
      { ingredient: "Curry Powder" },
      { ingredient: "Onion" },
    ],
    appliance: "Stove",
    utensils: ["Pan", "Spoon", "Knife"],
  },
];
