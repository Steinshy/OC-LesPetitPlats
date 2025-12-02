// src/components/filters/manager.js

import {
  getDropdownItemSelector,
  getSelectedDropdownItems,
} from "@components/dropdowns/elements.js";
import { dropdownTypes } from "@components/dropdowns/manager.js";
import { buildActiveFilters, getFilterCount } from "@components/filters/data.js";
import { filtersElements } from "@components/filters/elements.js";
import { renderFiltersContainer, renderFilterTag } from "@components/filters/render.js";
import { filtersState } from "@components/filters/state.js";
import { searchElements } from "@components/search/elements.js";
import { applyAllFilters } from "@utils/filterEngine.js";
import { parseURLState, clearURLState } from "@utils/urlState.js";

const ARIA_HIDDEN = "aria-hidden";

// ---------------
// setup
// ---------------

export const setupFilters = recipesData => {
  if (!recipesData) return;

  filtersState.allRecipes = Array.isArray(recipesData) ? recipesData : [];

  const { container } = filtersElements();
  if (!container) return;

  container.innerHTML = renderFiltersContainer();

  searchFromState();
  setupListeners();
  syncUI();

  filtersState.isInitialLoad = false;
};

const searchFromState = () => {
  const { input, clear, submit } = searchElements();
  if (!input || !filtersState.filters.search) return;

  input.value = filtersState.filters.search;
  clear?.classList.toggle("hidden", !filtersState.filters.search);
  submit?.classList.toggle("hidden", !!filtersState.filters.search);
};

// ---------------
// listeners
// ---------------

const setupListeners = () => {
  const { clearBtn } = filtersElements();

  clearBtn?.addEventListener("click", clearAll);

  document.addEventListener("dropdown:itemToggled", onItemToggled);
  document.addEventListener("filters:searchChanged", event => onSearchChanged(event.detail.query));

  window.addEventListener("popstate", onPopState);
};

const onItemToggled = event => {
  const { type, value, selected } = event.detail;
  const set = filtersState.filters[type];
  if (!set) return;

  selected ? set.add(value) : set.delete(value);
  syncUI();
};

const onSearchChanged = query => {
  filtersState.filters.search = query ?? "";
  syncUI();
};

const onPopState = () => {
  const urlFilters = parseURLState();

  filtersState.filters.search = urlFilters.search ?? "";
  filtersState.filters.ingredients = new Set(urlFilters.ingredients || []);
  filtersState.filters.appliances = new Set(urlFilters.appliances || []);
  filtersState.filters.utensils = new Set(urlFilters.utensils || []);

  searchFromState();
  syncUI();
};

// ---------------
// state sync
// ---------------

const syncUI = () => {
  const { filters } = filtersState;

  filtersState.filteredRecipes = applyAllFilters(filtersState.allRecipes, filters);

  updateContainer();
  updateTags();
  syncDropdownSelections();

  document.dispatchEvent(
    new CustomEvent("filters:stateChanged", {
      detail: { filteredRecipes: filtersState.filteredRecipes, filters },
    }),
  );
};

// ---------------
// container update
// ---------------

const updateContainer = () => {
  const { section, count, clearBtn } = filtersElements();
  if (!count || !clearBtn) return;

  const total = getFilterCount(filtersState.filters);
  const hasFilters = total > 0;

  section?.classList.toggle("has-filters", hasFilters);
  clearBtn.classList.toggle("visible", hasFilters);
  clearBtn.setAttribute(ARIA_HIDDEN, String(!hasFilters));

  count.textContent = hasFilters ? `(${total})` : "";
  count.setAttribute(ARIA_HIDDEN, String(!hasFilters));
};

// ---------------
// tags update
// ---------------

const updateTags = () => {
  const { tagsList } = filtersElements();
  if (!tagsList) return;

  const activeFilters = buildActiveFilters(filtersState.filters);

  tagsList.innerHTML = activeFilters.map(renderFilterTag).join("");

  tagsList.querySelectorAll(".filter-tag").forEach(button => {
    button.addEventListener("click", () => removeTag(button.dataset.type, button.dataset.value));
  });
};

const removeTag = (type, value) => {
  const set = filtersState.filters[type];
  if (!set) return;

  set.delete(value);
  unselectDropdownItem(type, value);
  syncUI();
};

// ---------------
// dropdown sync
// ---------------

const syncDropdownSelections = () => {
  dropdownTypes.forEach(type => {
    const set = filtersState.filters[type];
    if (!(set instanceof Set)) return;

    set.forEach(value => {
      const item = document.querySelector(getDropdownItemSelector(type, value));
      if (!item || item.classList.contains("selected")) return;

      item.classList.add("selected");
      item.setAttribute("aria-pressed", "true");
      item.closest("li[role='option']")?.setAttribute("aria-selected", "true");
    });
  });
};

const unselectDropdownItem = (type, value) => {
  const item = document.querySelector(getDropdownItemSelector(type, value));
  if (!item) return;

  item.classList.remove("selected");
  item.setAttribute("aria-pressed", "false");
  item.closest("li[role='option']")?.setAttribute("aria-selected", "false");
};

// ---------------
// clear all
// ---------------

const clearAll = () => {
  // Reset state
  filtersState.filters.search = "";
  filtersState.filters.ingredients.clear();
  filtersState.filters.appliances.clear();
  filtersState.filters.utensils.clear();

  // Reset search input
  const { input, clear, submit } = searchElements();
  if (input) {
    input.value = "";
    clear?.classList.add("hidden");
    submit?.classList.remove("hidden");
  }

  // Clear all dropdown selections
  getSelectedDropdownItems().forEach(item => {
    item.classList.remove("selected");
    item.setAttribute("aria-pressed", "false");
    item.closest("li[role='option']")?.setAttribute("aria-selected", "false");
  });

  clearURLState();
  syncUI();
};
