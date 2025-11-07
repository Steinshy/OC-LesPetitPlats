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
  input: "#recipe-search, .search-bar-group input",
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

export const updateCount = count => {
  const counter = getElement("counter");
  if (counter) {
    const num = Math.max(0, count);
    counter.textContent = `${num} ${num === 1 ? "résultat" : "résultats"}`;
    counter.closest(".results-counter")?.classList.remove("skeleton-loading");
  }
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

export const clearAllFilters = () => {
  activeFilters.ingredients.clear();
  activeFilters.appliances.clear();
  activeFilters.ustensils.clear();
  applyFilters();
};

export const getActiveFilters = () => ({
  ingredients: new Set(activeFilters.ingredients),
  appliances: new Set(activeFilters.appliances),
  ustensils: new Set(activeFilters.ustensils),
});

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
    const clearButton = document.getElementById("clear-recipe-search");
    if (!input) return;

    const updateSearch = () => {
      clearButton?.classList.toggle("hidden", !input.value.trim());
      handleSearch(input);
    };

    const debouncedSearch = debounce(updateSearch, 300);

    input.addEventListener("input", debouncedSearch);

    clearButton?.addEventListener("click", () => {
      input.value = "";
      input.focus();
      updateSearch();
    });

    getElement("button")?.addEventListener("click", updateSearch);
    
    clearButton?.classList.toggle("hidden", !input.value.trim());
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(onReady, { timeout: 2000 });
  } else {
    setTimeout(onReady, 0);
  }
};
