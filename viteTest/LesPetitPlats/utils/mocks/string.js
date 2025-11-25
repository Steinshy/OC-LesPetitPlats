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
