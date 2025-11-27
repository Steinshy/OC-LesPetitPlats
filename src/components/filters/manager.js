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

// --------------------------------------------------
// filtering logic
// --------------------------------------------------

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
  // 1) Compute filtered recipes from ALL recipes + current filters
  filtersState.filteredRecipes = getFilteredRecipes(filtersState.allRecipes, filters);

  // 2) Update cards + dropdowns
  setupRecipesCards(filtersState.filteredRecipes);
  setupDropdowns(filtersState.filteredRecipes);

  // 3) Restore dropdown selections from filters state
  restoreDropdownSelections();

  // 4) Update filter tags under the search bar
  updateFilterTagsUI();

  // 5) Update "active filters" container + clear-all button
  updateFiltersContainer(filters);

  // 6) Update results counter
  setupResultsCounter(filtersState.filteredRecipes.length);

  // 7) Keep URL in sync (avoid doing this on first load)
  if (!filtersState.isInitialLoad) {
    updateURLState(filters);
  }
};

// --------------------------------------------------
// ui state: filters container
// --------------------------------------------------

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

// --------------------------------------------------
// ui state: filter tags
// --------------------------------------------------

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

  // Tag click: remove value from filters and sync
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
        const checkIcon = dropdownItem.querySelector(".dropdown-item-check");
        if (checkIcon) {
          checkIcon.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenTrue);
        }
      }

      syncUI(filtersState.filters);
    });
  });
};

// --------------------------------------------------
// dropdown item toggle
// --------------------------------------------------

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

// --------------------------------------------------
// restore dropdown selections (from filters state)
// --------------------------------------------------

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

// --------------------------------------------------
// clear all filters
// --------------------------------------------------

const clearAllFilters = () => {
  // reset filter state
  filtersState.filters.search = "";
  filtersState.filters.ingredients.clear();
  filtersState.filters.appliances.clear();
  filtersState.filters.ustensils.clear();

  // reset main search ui
  if (searchElements.searchInput && searchElements.clearButton && searchElements.submitSearch) {
    searchElements.searchInput.value = "";
    searchElements.clearButton.classList.add("hidden");
    searchElements.submitSearch.classList.remove("hidden");
  }

  // Clear selection in dropdown items
  document.querySelectorAll(".dropdown-item.item-btn.selected").forEach(itemButton => {
    itemButton.classList.remove("selected");
    itemButton.setAttribute("aria-pressed", "false");
    const checkIcon = itemButton.querySelector(".dropdown-item-check");
    if (checkIcon) {
      checkIcon.setAttribute(filtersConstants.ariaHidden, filtersConstants.ariaHiddenTrue);
    }
  });

  // Notify search reset
  document.dispatchEvent(
    new CustomEvent("filters:searchChanged", {
      detail: { query: "" },
    }),
  );

  // Reset URL + resync UI
  clearURLState();
  syncUI(filtersState.filters);
};
