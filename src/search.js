import { renderRecipes } from "./card.js";

const normalize = value => (typeof value === "string" ? value.trim().toLowerCase() : "");

const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const getSearchInput = () => document.querySelector(".search-bar-group input");
const getSearchButton = () => document.querySelector(".search-bar-group .search-btn");
const getResultsCounter = () => document.querySelector(".results-counter h2");

const filterRecipes = (recipes, searchTerm) => {
  const query = normalize(searchTerm);
  if (!query) return recipes;
  return recipes.filter(recipe => recipe.search?.includes(query));
};

const handleSearch = (recipes, input) => {
  const filteredRecipes = filterRecipes(recipes, input.value);
  renderRecipes(filteredRecipes);
  updateCount(filteredRecipes.length);
};

export const updateCount = (count = 0) => {
  const counter = getResultsCounter();
  if (counter) counter.textContent = `${count >= 0 ? count : 0} Résultats`;
};

export const initSearch = recipes => {
  const input = getSearchInput();
  if (!input) return;
  const button = getSearchButton();

  const searchFn = () => handleSearch(recipes, input);
  const debouncedSearchFn = debounce(searchFn, 300);

  input.addEventListener("input", debouncedSearchFn);
  button?.addEventListener("click", searchFn);
};
