// Test utilities for dropdown functions that don't exist in the project
import { normalizeString } from "@/utils/string.js";

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
