// src/components/filters/state.js

export const filtersState = {
  allRecipes: [],
  filteredRecipes: [],
  isInitialLoad: true,
  filters: {
    search: "",
    ingredients: new Set(),
    appliances: new Set(),
    utensils: new Set(),
  },
};
