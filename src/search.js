import { buildRecipes } from "./utils/dataBuilders.js";

const normalize = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const debounce = (callback, delayMs = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delayMs);
  };
};

const getSearchInput = () => document.querySelector(".search-bar-group input");
const getSearchButton = () => document.querySelector(".search-bar-group .search-btn");
const getResultsCounter = () => document.querySelector(".results-counter h2");

const filterRecipes = (recipes, query) => {
  if (!query) return recipes;
  return recipes.filter((recipe) => recipe.searchText.includes(query));
};

export const searchRecipes = async (term) => {
  const recipes = await buildRecipes();
  const query = normalize(term);
  return filterRecipes(recipes, query);
};

export const updateSearchResultsCount = (count) => {
  const counter = getResultsCounter();
  if (counter) {
    counter.textContent = `${count || 0} Résultats`;
  }
};

const createSearchHandler = (renderRecipes) => {
  const input = getSearchInput();
  if (!input) return null;

  return async () => {
    const term = input.value;
    const results = await searchRecipes(term);
    renderRecipes(results);
  };
};

export const initSearch = (renderRecipes) => {
  const input = getSearchInput();
  const button = getSearchButton();
  if (!input) return;

  const performSearch = createSearchHandler(renderRecipes);
  if (!performSearch) return;

  const debouncedSearch = debounce(performSearch, 300);
  input.addEventListener("input", debouncedSearch);
  if (button) button.addEventListener("click", performSearch);
};
