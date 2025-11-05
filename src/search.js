import { renderRecipes } from "./card.js";

const normalize = value => (typeof value === "string" ? value.trim().toLowerCase() : "");

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

const filterRecipes = (recipes, searchTerm) => {
  const query = normalize(searchTerm);
  return query ? recipes.filter(recipe => recipe.search?.includes(query)) : recipes;
};

const handleSearch = (recipes, input) => {
  const filtered = filterRecipes(recipes, input.value);
  renderRecipes(filtered);
  updateCount(filtered.length);
};

export const updateCount = (count = 0) => {
  const counter = getElement("counter");
  if (counter) counter.textContent = `${Math.max(0, count)} Résultats`;
};

export const initSearch = recipes => {
  const input = getElement("input");
  if (!input) return;

  const searchFn = () => handleSearch(recipes, input);
  const debouncedSearch = debounce(searchFn, 300);

  input.addEventListener("input", debouncedSearch);
  getElement("button")?.addEventListener("click", searchFn);
};
