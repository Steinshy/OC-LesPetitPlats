// src/components/dropdown/elements.js

// Root container for all dropdowns
export const getDropdownsContainer = () => ({
  container: document.getElementById("dropdowns-container"),
});

// Main structural elements for a single dropdown
export const getDropdownElements = type => ({
  container: document.getElementById(`dropdown-${type}-container`),
  button: document.getElementById(`dropdown-${type}-button`),
  backdrop: document.getElementById(`dropdown-${type}-backdrop`),
  menu: document.getElementById(`menu-${type}`),
});

// Search-related elements for a single dropdown
export const getDropdownSearchElements = type => ({
  searchWrapper: document.getElementById(`dropdown-${type}-search`),
  searchInput: document.getElementById(`search-${type}`),
  searchClear: document.getElementById(`dropdown-${type}-search-clear-button`),
});

// List & empty-state elements for a single dropdown
export const getDropdownListElements = type => ({
  menu: document.getElementById(`menu-${type}`),
  itemsList: document.getElementById(`dropdown-${type}-list`),
  emptyState: document.getElementById(`dropdown-${type}-empty-state`),
});
