import { toggleDropdown, closeAllDropdowns, updateDropdownList } from "./dropdown/behavior.js";
import { renderDropdown } from "./dropdown/render.js";
import { extractDropdownData, getFilteredItems } from "./dropdown/utils.js";

let globalClickHandler = null;
let globalKeydownHandler = null;
let currentActiveFilters = null;
let currentDropdownData = null;
let currentOnFilterChange = null;

export const updateDropdownsSelection = activeFilters => {
  currentActiveFilters = activeFilters;
  if (!currentDropdownData || !currentOnFilterChange) return;

  ["ingredients", "appliances", "ustensils"].forEach(type => {
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

  if (globalClickHandler) {
    document.removeEventListener("click", globalClickHandler);
    document.removeEventListener("keydown", globalKeydownHandler);
  }

  const types = [
    { name: "Ingredients", type: "ingredients" },
    { name: "Appliances", type: "appliances" },
    { name: "Ustensils", type: "ustensils" },
  ];

  const dropdownData = types.reduce((acc, { type }) => {
    acc[type] = extractDropdownData(recipes, type);
    return acc;
  }, {});

  currentDropdownData = dropdownData;
  currentOnFilterChange = onFilterChange;

  container.innerHTML = types
    .map(({ name, type }) => renderDropdown(name, type, dropdownData[type]))
    .join("");

  types.forEach(({ type }) => {
    const button = document.getElementById(`dropdown-${type}-button`);
    const searchInput = document.getElementById(`search-${type}`);
    const menu = document.getElementById(`menu-${type}`);

    button?.addEventListener("click", event => {
      event.stopPropagation();
      const isOpen = !button.classList.contains("active");
      closeAllDropdowns();
      if (isOpen) {
        toggleDropdown(type, true);
        updateDropdownList(
          type,
          getFilteredItems(type, dropdownData, searchInput),
          onFilterChange,
          currentActiveFilters,
        );
      }
    });

    const clearButton = document.getElementById(`clear-search-${type}`);
    
    const updateDropdown = () => {
      if (!searchInput) return;
      clearButton?.classList.toggle("hidden", !searchInput.value.trim());
      updateDropdownList(
        type,
        getFilteredItems(type, dropdownData, searchInput),
        onFilterChange,
        currentActiveFilters,
      );
    };

    searchInput?.addEventListener("input", updateDropdown);

    clearButton?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
        updateDropdown();
      }
    });

    searchInput?.addEventListener("click", event => event.stopPropagation());
    menu?.addEventListener("click", event => {
      if (!event.target.closest(".dropdown-item")) event.stopPropagation();
    });

    updateDropdownList(type, dropdownData[type], onFilterChange, currentActiveFilters);
  });

  globalClickHandler = event => {
    if (!event.target.closest(".dropdown-container")) closeAllDropdowns();
  };
  globalKeydownHandler = event => {
    if (event.key === "Escape") {
      const openDropdown = document.querySelector(".dropdown-container.open");
      closeAllDropdowns();
      if (openDropdown) {
        document.getElementById(`dropdown-${openDropdown.dataset.type}-button`)?.focus();
      }
    }
  };

  document.addEventListener("click", globalClickHandler);
  document.addEventListener("keydown", globalKeydownHandler);
};
