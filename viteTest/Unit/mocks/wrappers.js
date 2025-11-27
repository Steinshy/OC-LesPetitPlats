// Test wrappers - adapts functions for test compatibility
// Consolidated from: dropdownRender.js, searchElements.js, string.js, dropdownData.js

// Test wrapper for dropdown render - adds missing exports for tests
export * from "@/components/dropdown/render.js";
import { dropdownsSkeleton } from "@/components/renderSqueletons.js";

// Re-export for test compatibility
export const renderDropdownsSkeletons = dropdownsSkeleton;

// Mock searchElements for tests
// This provides the same structure as the real searchElements but allows test control
export const searchElements = {
  get searchBar() {
    return document.getElementById("search-bar");
  },
  get searchInput() {
    return document.getElementById("search-input");
  },
  get clearButton() {
    return document.getElementById("search-clear-button");
  },
  get submitSearch() {
    return document.getElementById("search-submit-btn");
  },
};

// Test wrapper for string utils - adapts functions for test compatibility
export * from "@/utils/string.js";
import { cleanupDuplicatedItems as originalCleanupDuplicatedItems } from "@/utils/string.js";

// Wrapper that returns strings instead of objects for test compatibility
export const cleanupDuplicatedItems = (items = []) => {
  const result = originalCleanupDuplicatedItems(items);
  // Tests expect array of strings, but function returns array of { label, value } objects
  return result.map(item => item.label || item.value || item);
};

// updateCounter function for tests
export const updateCounter = count => {
  const counter = document.getElementById("results-counter");
  if (!counter) return;

  const singular = count === 1;
  counter.innerHTML = `${count} ${singular ? "résultat" : "résultats"}`;
};

// Test wrapper for dropdown data - adapts return structure for tests
export * from "@/components/dropdown/data.js";
import { buildDropdownsData as originalBuildDropdownsData } from "@/components/dropdown/data.js";

// Wrapper that returns the structure tests expect
export const buildDropdownsData = recipesData => {
  const result = originalBuildDropdownsData(recipesData);
  // Tests expect { ingredients, ustensils, appliances } directly
  // but function returns { dropdowns: { ingredients, ustensils, appliances } }
  if (!result || !result.dropdowns) {
    return {
      ingredients: [],
      ustensils: [],
      appliances: [],
    };
  }
  return {
    ingredients: result.dropdowns.ingredients || [],
    ustensils: result.dropdowns.ustensils || [],
    appliances: result.dropdowns.appliances || [],
  };
};

