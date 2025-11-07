import { updateDropdownList, setupDropdown, setupGlobalListeners } from "./dropdown/behavior.js";
import { renderDropdown } from "./dropdown/render.js";
import { DROPDOWN_TYPES, buildDropdownData, getFilteredItems } from "./dropdown/utils.js";

let currentActiveFilters = null;
let currentDropdownData = null;
let currentOnFilterChange = null;

export const updateDropdownsSelection = activeFilters => {
  currentActiveFilters = activeFilters;
  if (!currentDropdownData || !currentOnFilterChange) return;

  DROPDOWN_TYPES.forEach(({ type }) => {
    const searchInput = document.getElementById(`search-${type}`);
    updateDropdownList(
      type,
      getFilteredItems(type, currentDropdownData, searchInput),
      currentOnFilterChange,
      activeFilters,
    );
  });
};

export const initDropdowns = (recipes, onFilterChange) => {
  const container = document.querySelector(".filter-dropdown-wrapper");
  if (!container) return;

  const dropdownData = buildDropdownData(recipes);
  currentDropdownData = dropdownData;
  currentOnFilterChange = onFilterChange;
  currentActiveFilters = { ingredients: new Set(), appliances: new Set(), ustensils: new Set() };

  container.innerHTML = DROPDOWN_TYPES
    .map(({ name, type }) => renderDropdown(name, type, dropdownData[type]))
    .join("");

  DROPDOWN_TYPES.forEach(({ type }) => setupDropdown(type, dropdownData, onFilterChange, currentActiveFilters));
  setupGlobalListeners();
};
