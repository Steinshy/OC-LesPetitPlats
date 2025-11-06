import { renderRecipes } from "../card.js";
import { updateDropdownsSelection } from "./dropdown.js";
import { updateFilterTags } from "./filterTags.js";
import { filterRecipes } from "./search/filter.js";

const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const selectors = {
  input: ".search-bar-group input",
  button: ".search-bar-group .search-btn",
  counter: ".results-counter h2",
};

const getElement = key => document.querySelector(selectors[key]);

let allRecipes = [];
let currentSearchTerm = "";
let activeFilters = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

const applyFilters = () => {
  const filtered = filterRecipes(allRecipes, currentSearchTerm, activeFilters);
  renderRecipes(filtered);
  updateCount(filtered.length);
  updateFilterTags(activeFilters);
  updateDropdownsSelection(activeFilters);
};

const handleSearch = input => {
  currentSearchTerm = input.value;
  applyFilters();
};

export const updateCount = (count = 0) => {
  const counter = getElement("counter");
  if (counter) counter.textContent = `${Math.max(0, count)} Résultats`;
};

export const addFilter = (type, value) => {
  if (activeFilters[type]) {
    activeFilters[type].add(value);
    applyFilters();
  }
};

export const removeFilter = (type, value) => {
  if (activeFilters[type]) {
    activeFilters[type].delete(value);
    applyFilters();
  }
};

export const getActiveFilters = () => activeFilters;

export const initSearch = recipesData => {
  allRecipes = recipesData;
  currentSearchTerm = "";
  activeFilters = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set(),
  };

  const onReady = () => {
    const input = getElement("input");
    if (!input) return;

    const searchFn = () => handleSearch(input);
    const debouncedSearch = debounce(searchFn, 300);

    input.addEventListener("input", debouncedSearch);
    getElement("button")?.addEventListener("click", searchFn);
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(onReady, { timeout: 2000 });
  } else {
    setTimeout(onReady, 0);
  }
};

