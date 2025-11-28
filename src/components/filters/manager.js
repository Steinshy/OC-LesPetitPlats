// src/components/filters/manager.js

import { setupRecipesCards } from "@components/cards/manager.js";
import { setupDropdowns } from "@components/dropdown/manager.js";
import { filtersState, filtersConstants, filtersElements } from "@components/filters/elements.js";
import { SearchInput, filterByField } from "@components/filters/recipeFilters.js";
import { renderFilters, renderFilterTag } from "@components/filters/render.js";
import { setupResultsCounter } from "@components/resultsCounter.js";
import { searchElements } from "@components/search/elements.js";
import { parseURLState, updateURLState, clearURLState } from "@utils/queryParams.js";
import { normalizeString } from "@utils/string.js";

export const setupFilters = recipesData => {
  if (!recipesData) return;

  // Store all recipes once
  filtersState.allRecipes = Array.isArray(recipesData) ? recipesData : [];

  const { searchInput, clearButton, submitSearch } = searchElements;
  const { mainContainer } = filtersElements;

  // Initial search input value from filters state (e.g., from URL)
  if (searchInput && filtersState.filters.search) {
    searchInput.value = filtersState.filters.search ?? "";
    clearButton?.classList.toggle("hidden", !filtersState.filters.search);
    submitSearch?.classList.toggle("hidden", !!filtersState.filters.search);
  }

  mainContainer.innerHTML = renderFilters();

  // Now that filters markup exists, get the clear-all button
  const { clearAll } = filtersElements;
  clearAll?.addEventListener("click", clearAllFilters);

  // Dropdown item toggle -> update filters
  document.addEventListener("dropdown:itemToggled", onDropdownItemToggled);

  // Search change event (from main search bar)
  document.addEventListener("filters:searchChanged", event =>
    onSearchChanged(filtersState.filters, event.detail.query),
  );

  // Handle browser back/forward
  window.addEventListener("popstate", () => {
    const urlFilters = parseURLState();

    filtersState.filters.search = urlFilters.search ?? "";

    filtersState.filters.ingredients = new Set(urlFilters.ingredients || []);
    filtersState.filters.appliances = new Set(urlFilters.appliances || []);
    filtersState.filters.ustensils = new Set(urlFilters.ustensils || []);

    if (searchInput) {
      searchInput.value = filtersState.filters.search ?? "";
      clearButton?.classList.toggle("hidden", !filtersState.filters.search);
      submitSearch?.classList.toggle("hidden", !!filtersState.filters.search);
    }

    syncUI(filtersState.filters);
  });

  // First sync
  syncUI(filtersState.filters);
  filtersState.isInitialLoad = false;
};

// ---------------
// filtering logic
// ---------------

const getFilteredRecipes = (recipes, filters) => {
  if (!Array.isArray(recipes)) return [];

  let current = recipes;

  current = SearchInput(current, filters.search ?? "");
  current = filterByField(current, filters.ingredients, "ingredients");
  current = filterByField(current, filters.appliances, "appliances");
  current = filterByField(current, filters.ustensils, "ustensils");

  return current;
};

const onSearchChanged = (filters, query) => {
  filtersState.filters.search = query ?? "";
  syncUI(filtersState.filters);
};

const syncUI = filters => {
  // Compute filtered recipes
  filtersState.filteredRecipes = getFilteredRecipes(filtersState.allRecipes, filters);

  // Update cards + dropdowns
  setupRecipesCards(filtersState.filteredRecipes);
  setupDropdowns(filtersState.filteredRecipes);

  // Restore selections
  restoreDropdownSelections();

  // Update filter tags
  updateFilterTagsUI();

  // Update filters container
  updateFiltersContainer(filters);

  // Update results count
  setupResultsCounter(filtersState.filteredRecipes.length);

  // Sync URL
  if (!filtersState.isInitialLoad) {
    updateURLState(filters);
  }
};

// ---------------
// filters container
// ---------------

const updateFiltersContainer = filters => {
  const { filtersContainer, filterCount, clearAll } = filtersElements;
  if (!filtersContainer || !filterCount || !clearAll) return;

  const total = filters.ingredients.size + filters.appliances.size + filters.ustensils.size;

  if (total === 0) {
    filtersContainer.style.display = "none";
    clearAll.classList.remove("visible");
    clearAll.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenTrue);
    clearAll.setAttribute("aria-label", "Aucun filtre sélectionné");
    filterCount.textContent = "";
    filterCount.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenTrue);
  } else {
    filtersContainer.style.display = "";
    clearAll.classList.add("visible");
    clearAll.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenFalse);
    clearAll.setAttribute("aria-label", "Retirer tous les filtres");

    filterCount.textContent = `(${total})`;
    filterCount.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenFalse);
    filterCount.setAttribute("aria-label", "Nombre de filtres sélectionnés");
  }
};

// ---------------
// filter tags
// ---------------

const updateFilterTagsUI = () => {
  const { listsContainer } = filtersElements;
  if (!listsContainer) return;

  const activeFiltersArray = [
    ...[...filtersState.filters.ingredients].map(value => ({ value, type: "ingredients" })),
    ...[...filtersState.filters.appliances].map(value => ({ value, type: "appliances" })),
    ...[...filtersState.filters.ustensils].map(value => ({ value, type: "ustensils" })),
  ];

  listsContainer.innerHTML = activeFiltersArray
    .map(tag => renderFilterTag(normalizeString(tag.value ?? ""), tag.type))
    .join("");

  // Tag click handler
  listsContainer.querySelectorAll(".filter-tag").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.type;
      const value = button.dataset.value;
      const set = filtersState.filters[type];
      if (!set) return;

      set.delete(value);

      const selector = `.dropdown-item.item-btn[data-type="${type}"][data-value="${normalizeString(
        value,
      )}"]`;
      const dropdownItem = document.querySelector(selector);
      if (dropdownItem) {
        dropdownItem.classList.remove("selected");
        dropdownItem.setAttribute("aria-pressed", "false");
        const listItem = dropdownItem.closest("li[role='option']");
        if (listItem) {
          listItem.setAttribute("aria-selected", "false");
        }
        const checkIcon = dropdownItem.querySelector(".dropdown-item-check");
        if (checkIcon) {
          checkIcon.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenTrue);
        }
      }

      syncUI(filtersState.filters);
    });
  });
};

// ---------------
// item toggle
// ---------------

const onDropdownItemToggled = event => {
  const { type, value, selected } = event.detail;
  const set = filtersState.filters[type];
  if (!set) return;

  if (selected) {
    set.add(value);
  } else {
    set.delete(value);
  }

  syncUI(filtersState.filters);
};

// ---------------
// restore selections
// ---------------

const restoreDropdownSelections = () => {
  Object.entries(filtersState.filters).forEach(([type, value]) => {
    if (!(value instanceof Set)) return;

    value.forEach(val => {
      const selector = `.dropdown-item.item-btn[data-type="${type}"][data-value="${normalizeString(
        val ?? "",
      )}"]`;
      const itemButton = document.querySelector(selector);
      if (!itemButton) return;

      if (!itemButton.classList.contains("selected")) {
        itemButton.classList.add("selected");
        itemButton.setAttribute("aria-pressed", "true");
        const listItem = itemButton.closest("li[role='option']");
        if (listItem) {
          listItem.setAttribute("aria-selected", "true");
        }
      }

      let checkIcon = itemButton.querySelector(".dropdown-item-check");
      if (!checkIcon) {
        checkIcon = document.createElement("i");
        checkIcon.className = "ri-checkbox-line dropdown-item-check";
        checkIcon.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenTrue);
        itemButton.appendChild(checkIcon);
      } else {
        checkIcon.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenFalse);
      }
    });
  });
};

// ---------------
// clear all
// ---------------

const clearAllFilters = () => {
  // Reset state
  filtersState.filters.search = "";
  filtersState.filters.ingredients.clear();
  filtersState.filters.appliances.clear();
  filtersState.filters.ustensils.clear();

  // Reset search UI
  if (searchElements.searchInput && searchElements.clearButton && searchElements.submitSearch) {
    searchElements.searchInput.value = "";
    searchElements.clearButton.classList.add("hidden");
    searchElements.submitSearch.classList.remove("hidden");
  }

  // Clear dropdown selections
  document.querySelectorAll(".dropdown-item.item-btn.selected").forEach(itemButton => {
    itemButton.classList.remove("selected");
    itemButton.setAttribute("aria-pressed", "false");
    const listItem = itemButton.closest("li[role='option']");
    if (listItem) {
      listItem.setAttribute("aria-selected", "false");
    }
    const checkIcon = itemButton.querySelector(".dropdown-item-check");
    if (checkIcon) {
      checkIcon.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenTrue);
    }
  });

  // Dispatch reset event
  document.dispatchEvent(
    new CustomEvent("filters:searchChanged", {
      detail: { query: "" },
    }),
  );

  // Reset URL + sync
  clearURLState();
  syncUI(filtersState.filters);
};
