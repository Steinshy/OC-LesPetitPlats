// src/components/dropdowns/elements.js

import { normalizeString } from "@utils/normalize.js";

// Main => dropdowns (root container)
export const dropdownsElements = () => ({
  section: document.getElementById("dropdowns"),
  container: document.getElementById("dropdowns-container"),
});

// Dropdown elements (Single dropdown)
export const dropdownElements = type => ({
  container: document.getElementById(`dropdown-${type}-container`),
  button: document.getElementById(`dropdown-${type}-button`),
  backdrop: document.getElementById(`dropdown-${type}-backdrop`),
  menu: document.getElementById(`menu-${type}`),
});

// Search elements
export const dropdownSearchElements = type => ({
  searchWrapper: document.getElementById(`dropdown-${type}-search`),
  searchInput: document.getElementById(`search-${type}`),
  searchClear: document.getElementById(`dropdown-${type}-search-clear-button`),
  searchSubmit: document.getElementById(`dropdown-${type}-search-submit-button`),
});

// List elements
export const dropdownListElements = type => ({
  menu: document.getElementById(`menu-${type}`),
  itemsList: document.getElementById(`dropdown-${type}-list`),
  emptyState: document.getElementById(`dropdown-${type}-empty-state`),
});

// Need to check that closer
// Get selector for a dropdown item button
export const getDropdownItemSelector = (type, value) =>
  `.dropdown-item.item-btn[data-type="${type}"][data-value="${normalizeString(value)}"]`;

// Get all selected dropdown items
export const getSelectedDropdownItems = () =>
  document.querySelectorAll(".dropdown-item.item-btn.selected");
