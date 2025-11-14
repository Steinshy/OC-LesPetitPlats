import { renderRecipes } from "../card.js";
import { updateDropdownsSelection } from "./dropdown.js";
import { updateFilterTags } from "./filterTags.js";
import { filterRecipes } from "./search/filter.js";
import { hideSearchSkeleton } from "./skeletons.js";

const DEBOUNCE_DELAY = 300;
const SELECTORS = {
  input: "#recipe-search, .search-bar-group input",
  button: ".search-bar-group .search-btn",
  counter: ".results-counter h2",
};

const createInitialFilters = () => ({
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
});

const debounce = (fn, delay = DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const getElement = key => document.querySelector(SELECTORS[key]);

let allRecipes = [];
let currentSearchTerm = "";
let activeFilters = createInitialFilters();

export const renderSearch = () => {
  const input = document.getElementById("recipe-search");
  const searchButton = document.querySelector(".search-bar-group .search-btn");
  if (input) {
    input.disabled = true;
    input.classList.add("disabled");
    input.setAttribute("aria-disabled", "true");
  }
  if (searchButton) {
    searchButton.disabled = true;
    searchButton.classList.add("disabled");
    searchButton.setAttribute("aria-disabled", "true");
  }
};

const applyFilters = () => {
  const filtered = filterRecipes(allRecipes, currentSearchTerm, activeFilters);
  renderRecipes(filtered);
  updateCount(filtered.length);
  updateFilterTags(activeFilters);
  updateDropdownsSelection(activeFilters, filtered);
};

const handleSearchInput = input => {
  currentSearchTerm = input.value;
  applyFilters();
};

const updateClearButtonVisibility = (clearButton, input) => {
  clearButton?.classList.toggle("hidden", !input.value.trim());
};

const handleClearClick = (input, clearButton) => {
  input.value = "";
  input.focus();
  updateClearButtonVisibility(clearButton, input);
  handleSearchInput(input);
};

const setupSearchInput = (input, clearButton) => {
  const debouncedSearch = debounce(() => handleSearchInput(input), DEBOUNCE_DELAY);

  input.addEventListener("input", () => {
    updateClearButtonVisibility(clearButton, input);
    debouncedSearch();
  });

  clearButton?.addEventListener("click", () => handleClearClick(input, clearButton));

  getElement("button")?.addEventListener("click", () => handleSearchInput(input));

  updateClearButtonVisibility(clearButton, input);
};

const initializeSearch = () => {
  const input = getElement("input");
  const clearButton = document.getElementById("clear-recipe-search");
  if (!input) return;

  setupSearchInput(input, clearButton);
};

const scheduleInitialization = () => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initializeSearch, { timeout: 2000 });
  } else {
    setTimeout(initializeSearch, 0);
  }
};

export const updateCount = count => {
  const counter = getElement("counter");
  if (!counter) return;

  const num = Math.max(0, count ?? 0);
  counter.textContent = `${num} ${num === 1 ? "résultat" : "résultats"}`;
  counter.closest(".results-counter")?.classList.remove("skeleton-loading");
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
  activeFilters = createInitialFilters();
  applyFilters();
};

export const getActiveFilters = () => ({
  ingredients: new Set(activeFilters.ingredients),
  appliances: new Set(activeFilters.appliances),
  ustensils: new Set(activeFilters.ustensils),
});

export const enableSearch = recipesData => {
  const input = document.getElementById("recipe-search");
  const searchButton = document.querySelector(".search-bar-group .search-btn");

  if (input) {
    input.disabled = false;
    input.classList.remove("disabled");
    input.removeAttribute("aria-disabled");
  }
  if (searchButton) {
    searchButton.disabled = false;
    searchButton.classList.remove("disabled");
    searchButton.removeAttribute("aria-disabled");
  }

  hideSearchSkeleton();

  allRecipes = recipesData;
  currentSearchTerm = "";
  activeFilters = createInitialFilters();
  scheduleInitialization();
};
