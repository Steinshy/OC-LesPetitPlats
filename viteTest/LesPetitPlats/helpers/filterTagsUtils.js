// Test utility for updateFilterTags function that doesn't exist in the project
import { renderFilterTag } from "@/components/filters/render.js";
import { normalizeString } from "@/utils/string.js";

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
