import { updateDropdown, setupDropdown, setupGlobalListeners } from "./dropdown/behavior.js";
import { renderDropdown } from "./dropdown/render.js";
import { DROPDOWN_TYPES } from "./dropdown/utils.js";
import { normalizeString } from "@/helper/helper.js";

let currentActiveFilters = null;
let currentDropdownData = null;
let currentOnFilterChange = null;
let _allRecipes = [];
let currentFilteredRecipes = null;

const buildDropdownDataFromRecipes = recipes => {
  const buildUstensils = recipesData => {
    const ustensils = recipesData.flatMap(recipe => recipe?.ustensils || []);
    const normalized = ustensils.map(normalizeString).filter(Boolean);
    return [...new Set(normalized)].sort();
  };

  const buildIngredientsList = recipesData => {
    const allIngredients = recipesData.flatMap(recipe => {
      const ingredients = recipe?.ingredients || [];
      return ingredients.map(ingredient => normalizeString(ingredient?.name)).filter(Boolean);
    });
    return [...new Set(allIngredients)].sort((a, b) => a.localeCompare(b));
  };

  const buildAppliancesList = recipesData => {
    const allAppliances = recipesData
      .map(recipe => normalizeString(recipe?.appliance))
      .filter(Boolean);
    return [...new Set(allAppliances)].sort((a, b) => a.localeCompare(b));
  };

  return {
    ingredients: buildIngredientsList(recipes),
    appliances: buildAppliancesList(recipes),
    ustensils: buildUstensils(recipes),
  };
};

export const getCurrentDropdownData = () => {
  if (currentFilteredRecipes) {
    return buildDropdownDataFromRecipes(currentFilteredRecipes);
  }
  return currentDropdownData;
};

export const renderDropdowns = () => {
  const container = document.getElementById("filter-dropdown-wrapper");
  if (!container) return;

  const fragment = document.createDocumentFragment();
  const tempDiv = document.createElement("div");

  DROPDOWN_TYPES.forEach(({ name, type }) => {
    const placeholderName = name.toLowerCase();
    const dropdownHTML = renderDropdown(name, type, placeholderName, "");
    tempDiv.innerHTML = dropdownHTML;
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
  });

  container.appendChild(fragment);

  // Disable dropdowns until data is loaded
  DROPDOWN_TYPES.forEach(({ type }) => {
    const button = document.getElementById(`dropdown-${type}-button`);
    if (button) {
      button.disabled = true;
      button.classList.add("disabled");
    }
  });
};

export const updateDropdownsSelection = (activeFilters, filteredRecipes) => {
  currentActiveFilters = activeFilters;
  currentFilteredRecipes = filteredRecipes || null;
  if (!currentOnFilterChange) return;

  const dropdownData = getCurrentDropdownData();
  if (!dropdownData) return;

  const getActiveFilters = () =>
    currentActiveFilters || { ingredients: new Set(), appliances: new Set(), ustensils: new Set() };

  DROPDOWN_TYPES.forEach(({ type }) => {
    const listElement = document.getElementById(`dropdown-${type}-list`);
    if (listElement && listElement.closest(".dropdown-container.open")) {
      updateDropdown(type, getActiveFilters, dropdownData, currentOnFilterChange);
    }
  });
};

export const enableDropdowns = (dropdownData, onFilterChange, recipes) => {
  const container = document.getElementById("filter-dropdown-wrapper");
  if (!container) return;

  // If structure not yet rendered, render it first
  if (container.children.length === 0) {
    renderDropdowns();
  }

  currentDropdownData = dropdownData;
  currentOnFilterChange = onFilterChange || null;
  _allRecipes = recipes || [];
  currentActiveFilters = { ingredients: new Set(), appliances: new Set(), ustensils: new Set() };

  // Enable dropdowns and populate with data
  const getActiveFilters = () =>
    currentActiveFilters || { ingredients: new Set(), appliances: new Set(), ustensils: new Set() };

  DROPDOWN_TYPES.forEach(({ type }) => {
    const button = document.getElementById(`dropdown-${type}-button`);
    if (button) {
      button.disabled = false;
      button.classList.remove("disabled");
    }
    setupDropdown(type, dropdownData, onFilterChange || null, getActiveFilters);
  });

  setupGlobalListeners();
};
