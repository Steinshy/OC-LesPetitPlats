// Test wrappers - adapts functions for test compatibility
// Consolidated from: dropdownRender.js, searchElements.js, string.js, dropdownData.js

// Test wrapper for dropdown render - adds missing exports for tests
// Import skeleton function
import { dropdownsSkeleton } from "~/src/components/skeletons/renderer.js";

// Re-export all original dropdown render functions
export * from "~/src/components/dropdowns/render.js";

// Re-export for test compatibility
export const renderDropdownsSkeletons = dropdownsSkeleton;

// Mock searchElements for tests
// This provides the same structure as the real searchElements but allows test control
export const searchElements = () => ({
  search: document.getElementById("search-bar"),
  container: document.getElementById("search-bar-container"),
  input: document.getElementById("search-input"),
  clear: document.getElementById("search-clear-button"),
  submit: document.getElementById("search-submit-button"),
});

// Note: String utils wrapper is now handled directly in setup.js to avoid circular dependencies
// This file no longer exports string utils wrappers

// updateCounter function for tests
export const updateCounter = count => {
  const counter = document.getElementById("results-counter");
  if (!counter) return;

  const singular = count === 1;
  counter.innerHTML = `${count} ${singular ? "résultat" : "résultats"}`;
};

// Note: Dropdown data wrapper is now handled directly in setup.js to avoid circular dependencies
// This file no longer exports dropdown data wrappers

