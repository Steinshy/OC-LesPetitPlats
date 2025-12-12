// Test wrapper for filters setupFilters (mirrors src/components/filters/setupFilters.js)
import { setupRecipesCards } from "@/components/cards/manager.js";
import { dropdownTypes } from "@/components/dropdowns/manager.js";
import { filtersEngine } from "@/components/filters/filtersEngine.js";
import { setupFilters } from "@/components/filters/setupFilters.js";

export { setupFilters };

// Test-only state (separate from source)
let allRecipes = [];
let filteredRecipes = [];
const filtersState = {
  mainSearchText: "",
  tags: {
    ingredients: new Set(),
    utensils: new Set(),
    appliances: new Set(),
  },
};

// Reset state for tests
export const resetFiltersState = () => {
  allRecipes = [];
  filteredRecipes = [];
  filtersState.mainSearchText = "";
  filtersState.tags.ingredients.clear();
  filtersState.tags.utensils.clear();
  filtersState.tags.appliances.clear();
};

const syncUI = () => {
  const filters = {
    search: filtersState.mainSearchText,
    ingredients: filtersState.tags.ingredients,
    appliances: filtersState.tags.appliances,
    utensils: filtersState.tags.utensils,
  };
  filteredRecipes = filtersEngine.applyAll(allRecipes, filters, dropdownTypes);

  if (setupRecipesCards) {
    setupRecipesCards(filteredRecipes);
  }
};
export const renderSearch = () => {
  const input = document.getElementById("recipe-search");
  const button = document.querySelector(".search-button");

  if (input) {
    input.disabled = true;
    input.classList.add("disabled");
    input.setAttribute("aria-disabled", "true");
  }

  if (button) {
    button.disabled = true;
    button.classList.add("disabled");
    button.setAttribute("aria-disabled", "true");
  }
};

export const updateCount = count => {
  const counter = document.querySelector(".results-counter h2");
  if (!counter) return;

  const actualCount = Math.max(0, count || 0);
  counter.textContent = `${actualCount} résultats`;
};

export const enableSearch = recipes => {
  allRecipes = recipes || [];
  filteredRecipes = allRecipes;

  const searchInput = document.querySelector(".main-search-bar input");
  const clearButton = document.getElementById("clear-recipe-search");
  const searchButton = document.querySelector(".main-search-bar .search-button");

  if (!searchInput) return;

  const applySearch = () => {
    const query = searchInput.value || "";
    filtersState.mainSearchText = query;
    syncUI();
  };

  const scheduleSearch = () => {
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(
        () => {
          applySearch();
        },
        { timeout: 2000 },
      );
      return id;
    } else {
      setTimeout(applySearch, 0);
      return null;
    }
  };

  searchInput.addEventListener("input", () => {
    const hasText = (searchInput.value || "").trim().length > 0;
    if (clearButton) {
      clearButton.classList.toggle("hidden", !hasText);
    }
    if (searchButton) {
      searchButton.classList.toggle("hidden", hasText);
    }
    scheduleSearch();
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      if (clearButton) clearButton.classList.add("hidden");
      if (searchButton) searchButton.classList.remove("hidden");
      scheduleSearch();
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      searchInput.focus();
      scheduleSearch();
    });
  }

  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        syncUI();
      },
      { timeout: 2000 },
    );
  }
};

export const addFilter = (type, value) => {
  const set = filtersState.tags[type];
  if (!set) return;

  set.add(value);
  syncUI();
};

export const removeFilter = (type, value) => {
  const set = filtersState.tags[type];
  if (!set) return;

  set.delete(value);
  syncUI();
};

export const getActiveFilters = () => {
  return {
    ingredients: new Set(filtersState.tags.ingredients),
    appliances: new Set(filtersState.tags.appliances),
    utensils: new Set(filtersState.tags.utensils),
  };
};

export const clearAllFilters = () => {
  filtersState.mainSearchText = "";
  filtersState.tags.ingredients.clear();
  filtersState.tags.appliances.clear();
  filtersState.tags.utensils.clear();

  const mainsearchInput = document.getElementById("main-search-input");
  const clearSearchBtn = document.getElementById("main-clear-search-btn");
  const searchBtn = document.getElementById("main-search-btn");

  if (mainsearchInput) mainsearchInput.value = "";
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

  syncUI();
};
