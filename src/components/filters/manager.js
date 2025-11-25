import { setupRecipesCards } from "../cards/manager.js";
import { setupDropdowns, getOpenDropdownType, toggleDropdown } from "../dropdown/manager.js";
import { setupResultsCounter } from "../resultsCounter.js";
import { renderFilters, renderFilterTag } from "./render.js";
import { SearchInput, filterByField } from "@/components/filters/recipeFilters.js";
import { parseURLState, updateURLState, clearURLState } from "@/utils/queryParams.js";
import { normalizeString } from "@/utils/string.js";

let allRecipes = [];
let filteredRecipes = [];
let isInitialLoad = true;

const filters = {
  search: "",
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

const ARIA_HIDDEN = "aria-hidden";
const ARIA_HIDDEN_TRUE = "true";
const ARIA_HIDDEN_FALSE = "false";

const getFiltersElements = () => {
  return {
    filters: document.getElementById("filters"),
    container: document.getElementById("filters-container"),
    count: document.getElementById("filters-count"),
    clearButton: document.getElementById("clear-filters-btn"),
    listsContainer: document.getElementById("filters-tags"),
    tag: document.querySelectorAll("#filter-tag-btn"),
  };
};

export const setupFilters = recipesData => {
  allRecipes = Array.isArray(recipesData) ? recipesData : [];

  const urlState = parseURLState();
  filters.search = urlState.search;
  filters.ingredients = urlState.ingredients;
  filters.appliances = urlState.appliances;
  filters.ustensils = urlState.ustensils;

  const searchInput = document.getElementById("search-input");
  if (searchInput && filters.search) {
    searchInput.value = filters.search;
    const clearSearchBtn = document.getElementById("search-clear-button");
    const searchBtn = document.getElementById("search-submit-btn");
    if (clearSearchBtn) clearSearchBtn.classList.remove("hidden");
    if (searchBtn) searchBtn.classList.add("hidden");
  }

  const { filters: filtersElement } = getFiltersElements();
  if (filtersElement) {
    filtersElement.innerHTML = renderFilters();
  }

  const { clearButton } = getFiltersElements();

  document.addEventListener("dropdown:itemToggled", onDropdownItemToggled);
  document.addEventListener("filters:searchChanged", e => onSearchChanged(e.detail.query));

  window.addEventListener("popstate", () => {
    const urlState = parseURLState();
    filters.search = urlState.search;
    filters.ingredients = urlState.ingredients;
    filters.appliances = urlState.appliances;
    filters.ustensils = urlState.ustensils;

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.value = filters.search;
      const clearSearchBtn = document.getElementById("search-clear-button");
      const searchBtn = document.getElementById("search-submit-btn");
      if (clearSearchBtn) clearSearchBtn.classList.toggle("hidden", !filters.search);
      if (searchBtn) searchBtn.classList.toggle("hidden", !!filters.search);
    }

    syncUI();
  });

  if (clearButton) {
    clearButton.addEventListener("click", clearAllFilters);
  }

  syncUI();
  isInitialLoad = false;
};

const getFilteredRecipes = recipesData => {
  if (!Array.isArray(recipesData)) return [];
  let current = recipesData;
  current = SearchInput(current, filters.search);
  current = filterByField(current, filters.ingredients, "ingredients");
  current = filterByField(current, filters.appliances, "appliances");
  current = filterByField(current, filters.ustensils, "ustensils");
  return current;
};

const onSearchChanged = query => {
  filters.search = query ?? "";
  syncUI();
};

const syncUI = () => {
  const openDropdownType = getOpenDropdownType?.() || null;
  filteredRecipes = getFilteredRecipes(allRecipes);
  setupRecipesCards(filteredRecipes);
  setupDropdowns(filteredRecipes);
  restoreDropdownSelections();
  if (openDropdownType) toggleDropdown(openDropdownType, true);
  updateFilterTagsUI();
  updateFiltersContainer();
  setupResultsCounter(filteredRecipes.length);
  if (!isInitialLoad) {
    updateURLState(filters);
  }
};

const updateFiltersContainer = () => {
  const { container, count, clearButton } = getFiltersElements();
  if (!container || !count || !clearButton) return;

  const total = filters.ingredients.size + filters.appliances.size + filters.ustensils.size;

  if (total === 0) {
    container.style.display = "none";
    if (clearButton) {
      clearButton.classList.remove("visible");
      clearButton.setAttribute(ARIA_HIDDEN, ARIA_HIDDEN_TRUE);
      clearButton.setAttribute("aria-label", "Aucun filtre sélectionné");
    }
    if (count) {
      count.textContent = "(0)";
      count.setAttribute(ARIA_HIDDEN, ARIA_HIDDEN_TRUE);
      count.setAttribute("aria-label", "Aucun filtre sélectionné");
    }
  } else {
    container.style.display = "";
    if (clearButton) {
      clearButton.classList.add("visible");
      clearButton.setAttribute(ARIA_HIDDEN, ARIA_HIDDEN_FALSE);
      clearButton.setAttribute("aria-label", "Retirer tous les filtres");
    }
    if (count) {
      count.textContent = `(${total})`;
      count.setAttribute(ARIA_HIDDEN, ARIA_HIDDEN_FALSE);
      count.setAttribute("aria-label", "Nombre de filtres sélectionnés");
    }
  }
};

const updateFilterTagsUI = () => {
  const { listsContainer } = getFiltersElements();
  if (!listsContainer) return;

  const activeFiltersArray = [
    ...[...filters.ingredients].map(value => ({ value, type: "ingredients" })),
    ...[...filters.appliances].map(value => ({ value, type: "appliances" })),
    ...[...filters.ustensils].map(value => ({ value, type: "ustensils" })),
  ];

  listsContainer.innerHTML = activeFiltersArray
    .map(tag => renderFilterTag(normalizeString(tag.value ?? ""), tag.type))
    .join("");

  listsContainer.querySelectorAll(".filter-tag").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.type;
      const value = button.dataset.value;
      const set = filters[type];
      if (!set) return;

      set.delete(value);

      const selector = `.dropdown-item[data-type="${type}"][data-value="${CSS.escape(value)}"]`;
      const dropdownItem = document.querySelector(selector);
      if (dropdownItem) {
        dropdownItem.classList.remove("selected");
        dropdownItem.querySelector(".dropdown-item-check")?.remove();
      }

      syncUI();
    });
  });
};

const onDropdownItemToggled = event => {
  const { type, value, selected } = event.detail;
  const set = filters[type];
  if (!set) return;

  if (selected) {
    set.add(value);
  } else {
    set.delete(value);
  }

  syncUI();
};

const restoreDropdownSelections = () => {
  Object.entries(filters).forEach(([type, value]) => {
    if (!(value instanceof Set)) return;

    value.forEach(val => {
      const selector = `.dropdown-item[data-type="${type}"][data-value="${CSS.escape(val)}"]`;
      const itemButton = document.querySelector(selector);
      if (!itemButton) return;

      if (!itemButton.classList.contains("selected")) {
        itemButton.classList.add("selected");
      }

      const checkIcon = itemButton.querySelector(".dropdown-item-check");
      if (!checkIcon) {
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-check dropdown-item-check";
        icon.setAttribute(ARIA_HIDDEN, ARIA_HIDDEN_TRUE);
        itemButton.appendChild(icon);
      }
    });
  });
};
const clearAllFilters = () => {
  filters.search = "";
  filters.ingredients.clear();
  filters.appliances.clear();
  filters.ustensils.clear();

  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("search-clear-button");
  const searchBtn = document.getElementById("search-submit-btn");

  if (searchInput) searchInput.value = "";
  if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
  if (searchBtn) searchBtn.classList.remove("hidden");

  document.dispatchEvent(
    new CustomEvent("filters:searchChanged", {
      detail: { query: "" },
    }),
  );

  document.querySelectorAll(".dropdown-item.selected").forEach(item => {
    item.classList.remove("selected");
    item.querySelector(".dropdown-item-check")?.remove();
  });

  clearURLState();
  syncUI();
};
