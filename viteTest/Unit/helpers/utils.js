// Test utilities for components that don't exist in the project
// Consolidated from: dropdownUtils.js and filterTagsUtils.js
import { renderFilterTag } from "@/components/filters/render.js";
import { normalizeString } from "@/utils/string.js";

// Dropdown utilities
export const DROPDOWN_TYPES = [
  { name: "Ingredients", type: "ingredients" },
  { name: "Appliances", type: "appliances" },
  { name: "Ustensils", type: "ustensils" },
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
  // Try multiple possible container selectors
  const container =
    document.querySelector(".ingredients-list") ||
    document.querySelector("#filters-tags") ||
    document.querySelector(".lists-container");

  if (!container) return;

  const filtersBox =
    document.querySelector(".filters-box") || document.querySelector("#filters-container");
  const filterCount =
    document.querySelector("#filter-count") || document.querySelector(".filter-count");

  // Build active filters array - handle both Sets and Arrays
  const toArray = value => {
    if (!value) return [];
    if (value instanceof Set) return [...value];
    if (Array.isArray(value)) return value;
    return [];
  };

  const activeFiltersArray = [
    ...toArray(activeFilters.ingredients).map(value => ({ value, type: "ingredients" })),
    ...toArray(activeFilters.appliances).map(value => ({ value, type: "appliances" })),
    ...toArray(activeFilters.ustensils).map(value => ({ value, type: "ustensils" })),
  ];

  // Update container - normalize values before passing to renderFilterTag
  container.innerHTML = activeFiltersArray
    .map(tag => renderFilterTag(normalizeString(tag.value), tag.type))
    .join("");

  // Update filters box class
  if (filtersBox) {
    filtersBox.classList.toggle("has-filters", activeFiltersArray.length > 0);
  }

  // Update filter count
  if (filterCount) {
    filterCount.textContent = `(${activeFiltersArray.length})`;
  }

  // Set up click handlers
  container.querySelectorAll(".filter-tag").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const type = button.dataset.type;
      const value = button.dataset.value;
      if (type && value && removeFilter) {
        removeFilter(type, value);
      }
    });
  });

  // Set up clear all button
  const clearAllBtn =
    document.querySelector("#clear-filters-btn") || document.querySelector(".clear-filters-btn");
  if (clearAllBtn) {
    // Remove existing listeners by cloning
    const newBtn = clearAllBtn.cloneNode(true);
    clearAllBtn.parentNode.replaceChild(newBtn, clearAllBtn);
    newBtn.addEventListener("click", event => {
      event.preventDefault();
      if (clearAllFilters) {
        clearAllFilters();
      }
    });
  }
};

