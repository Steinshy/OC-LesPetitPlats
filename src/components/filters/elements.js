// src/components/filters/elements.js

export const filtersState = {
  allRecipes: [],
  filteredRecipes: [],
  isInitialLoad: true,
  filters: {
    search: "",
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set(),
  },
};

export const filtersConstants = {
  ariaHidden: "aria-hidden",
  ariaHiddenTrue: "true",
  ariaHiddenFalse: "false",
};

export const filtersElements = {
  get mainContainer() {
    return document.getElementById("filters");
  },
  get filtersContainer() {
    return document.getElementById("filters-container");
  },
  get filterCount() {
    return document.getElementById("filters-count");
  },
  get clearAll() {
    return document.getElementById("clear-filters-btn");
  },
  get listsContainer() {
    return document.getElementById("filters-tags");
  },
  get filterTags() {
    // Get by class (avoid id)
    return document.querySelectorAll(".filter-tag");
  },
};
