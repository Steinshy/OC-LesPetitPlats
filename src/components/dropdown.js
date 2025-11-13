import { normalizeString } from "@/helper/helper.js";
import { updateDropdown, setupDropdown, setupGlobalListeners } from "./dropdown/behavior.js";
import { renderDropdown } from "./dropdown/render.js";
import { DROPDOWN_TYPES } from "./dropdown/utils.js";

let currentActiveFilters = null;
let currentDropdownData = null;
let currentOnFilterChange = null;
let allRecipes = [];
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

export const initDropdowns = (dropdownData, onFilterChange, recipes) => {
  const container = document.querySelector(".filter-dropdown-wrapper");
  if (!container) return;

  currentDropdownData = dropdownData;
  currentOnFilterChange = onFilterChange;
  allRecipes = recipes || [];
  currentActiveFilters = { ingredients: new Set(), appliances: new Set(), ustensils: new Set() };

  container.innerHTML = DROPDOWN_TYPES.map(({ name, type }) => {
    const placeholderName = name.toLowerCase();
    return renderDropdown(name, type, placeholderName, "");
  }).join("");

  const getActiveFilters = () =>
    currentActiveFilters || { ingredients: new Set(), appliances: new Set(), ustensils: new Set() };
  DROPDOWN_TYPES.forEach(({ type }) =>
    setupDropdown(type, dropdownData, onFilterChange, getActiveFilters),
  );
  setupGlobalListeners();
};
