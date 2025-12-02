// Test wrappers for test compatibility
import { dropdownsSkeleton } from "@/components/skeletons/renderer.js";

export * from "@/components/dropdowns/render.js";
export const renderDropdownsSkeletons = dropdownsSkeleton;

// Mock searchElements for tests
export const searchElements = () => ({
  search: document.getElementById("search-bar"),
  container: document.getElementById("search-bar-container"),
  input: document.getElementById("search-input"),
  clear: document.getElementById("search-clear-button"),
  submit: document.getElementById("search-submit-button"),
});

// updateCounter function for tests
export const updateCounter = count => {
  const counter = document.getElementById("results-counter");
  if (!counter) return;

  const singular = count === 1;
  counter.innerHTML = `${count} ${singular ? "résultat" : "résultats"}`;
};
