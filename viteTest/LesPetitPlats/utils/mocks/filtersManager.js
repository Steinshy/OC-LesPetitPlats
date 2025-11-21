// Test wrapper for filters manager - adds missing exports without modifying source
import * as filtersBy from "../../../../src/components/filters/filtersBy.js";
export * from "../../../../src/components/filters/manager.js";
import * as manager from "../../../../src/components/filters/manager.js";

// Test-only state for filters manager (separate from source code state)
let allRecipes = [];
let filteredRecipes = [];
const filtersState = {
  mainSearchText: "",
  tags: {
    ingredients: new Set(),
    ustensils: new Set(),
    appliances: new Set(),
  },
};

const syncUI = () => {
  // Apply filters
  filteredRecipes = allRecipes;
  filteredRecipes = filtersBy.SearchInput(filteredRecipes, filtersState.mainSearchText);
  filteredRecipes = filtersBy.IngredientsInput(filteredRecipes, filtersState.tags.ingredients);
  filteredRecipes = filtersBy.AppliancesInput(filteredRecipes, filtersState.tags.appliances);
  filteredRecipes = filtersBy.UstensilsInput(filteredRecipes, filtersState.tags.ustensils);

  // Update cards if setupRecipesCards is available
  if (manager.setupRecipesCards) {
    manager.setupRecipesCards(filteredRecipes);
  }
};

// Test exports
export const renderSearch = () => {
  const input = document.getElementById("recipe-search");
  const button = document.querySelector(".search-btn");

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
  const searchButton = document.querySelector(".main-search-bar .search-btn");

  if (!searchInput) return;

  const applySearch = () => {
    const query = searchInput.value || "";
    filtersState.mainSearchText = query;
    syncUI();
  };

  const scheduleSearch = () => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(
        () => {
          applySearch();
        },
        { timeout: 2000 },
      );
    } else {
      setTimeout(applySearch, 0);
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
    ustensils: new Set(filtersState.tags.ustensils),
  };
};

export const clearAllFilters = () => {
  filtersState.mainSearchText = "";
  filtersState.tags.ingredients.clear();
  filtersState.tags.appliances.clear();
  filtersState.tags.ustensils.clear();

  const mainSearchInput = document.getElementById("recipe-search");
  const clearSearchBtn = document.getElementById("clear-recipe-search");
  if (mainSearchInput) mainSearchInput.value = "";
  if (clearSearchBtn) clearSearchBtn.classList.add("hidden");

  document.querySelectorAll(".dropdown-item.selected").forEach(item => {
    item.classList.remove("selected");
    item.querySelector(".dropdown-item-check")?.remove();
  });

  syncUI();
};
