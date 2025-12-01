// Test utilities for components that don't exist in the project
// Consolidated from: dropdownUtils.js and filterTagsUtils.js
import { buildActiveFilters } from "@/components/filters/data.js";
import { renderFilterTag } from "@/components/filters/render.js";
import { normalizeString } from "~/src/utils/normalize.js";

export const DROPDOWN_TYPES = [
  { name: "Ingredients", type: "ingredients" },
  { name: "Appliances", type: "appliances" },
  { name: "utensils", type: "utensils" },
];

export const formatDropdownData = dropdownData => {
  const formatted = {};
  for (const [key, items] of Object.entries(dropdownData)) {
    formatted[key] = items.map(item => {
      if (item == null) return item;
      return String(item).charAt(0).toUpperCase() + String(item).slice(1);
    });
  }
  return formatted;
};

export const getFilteredItems = (type, dropdownData, searchInput) => {
  const items = dropdownData[type];
  if (!items) return undefined;

  if (!searchInput || !searchInput.value || !searchInput.value.trim()) {
    return items;
  }

  const query = normalizeString(searchInput.value);
  return items.filter(item => normalizeString(item).includes(query));
};

export const getDropdownElements = dropdownType => ({
  button: document.getElementById(`dropdown-${dropdownType}-button`),
  searchInput: document.getElementById(`search-${dropdownType}`),
  searchIcon: document.getElementById(`search-icon-${dropdownType}`),
  clearButton: document.getElementById(`clear-search-${dropdownType}`),
  menu: document.getElementById(`menu-${dropdownType}`),
  container: document.getElementById(`dropdown-${dropdownType}-container`),
  backdrop: document.getElementById(`dropdown-${dropdownType}-backdrop`),
});

// Filter tags utilities
export const updateFilterTags = (activeFilters, callbacks = {}) => {
  const { removeFilter, clearAllFilters } = callbacks;

  const container =
    document.querySelector("#filters-tags") ||
    document.querySelector(".lists-container");

  if (!container) return;

  const filtersSection = document.querySelector(".filters");
  const filterCount = document.querySelector("#filters-count");

  // Convert to Sets if needed for buildActiveFilters
  const normalizedFilters = {
    ingredients: activeFilters.ingredients instanceof Set
      ? activeFilters.ingredients
      : new Set(activeFilters.ingredients || []),
    appliances: activeFilters.appliances instanceof Set
      ? activeFilters.appliances
      : new Set(activeFilters.appliances || []),
    utensils: activeFilters.utensils instanceof Set
      ? activeFilters.utensils
      : new Set(activeFilters.utensils || []),
  };

  const activeFiltersArray = buildActiveFilters(normalizedFilters);

  container.innerHTML = activeFiltersArray.map(renderFilterTag).join("");

  if (filtersSection) {
    filtersSection.classList.toggle("has-filters", activeFiltersArray.length > 0);
  }

  if (filterCount) {
    filterCount.textContent = activeFiltersArray.length > 0 ? `(${activeFiltersArray.length})` : "";
  }

  container.querySelectorAll(".filter-tag").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const { type, value } = button.dataset;
      if (type && value && removeFilter) {
        removeFilter(type, value);
      }
    });
  });

  const clearAllBtn = document.querySelector("#clear-filters-btn");
  if (clearAllBtn) {
    const newBtn = clearAllBtn.cloneNode(true);
    clearAllBtn.parentNode.replaceChild(newBtn, clearAllBtn);
    newBtn.addEventListener("click", event => {
      event.preventDefault();
      clearAllFilters?.();
    });
  }
};

