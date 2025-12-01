// src/components/dropdown/elements.js

// Root container
export const getDropdownsContainer = () => ({
  container: document.getElementById("dropdowns-container"),
});

// Dropdown elements
export const getDropdownElements = type => ({
  container: document.getElementById(`dropdown-${type}-container`),
  button: document.getElementById(`dropdown-${type}-button`),
  backdrop: document.getElementById(`dropdown-${type}-backdrop`),
  menu: document.getElementById(`menu-${type}`),
});

// Search elements
export const getDropdownSearchElements = type => ({
  searchWrapper: document.getElementById(`dropdown-${type}-search`),
  filterBysearchInput: document.getElementById(`search-${type}`),
  searchClear: document.getElementById(`dropdown-${type}-search-clear-button`),
});

// List elements
export const getDropdownListElements = type => ({
  menu: document.getElementById(`menu-${type}`),
  itemsList: document.getElementById(`dropdown-${type}-list`),
  emptyState: document.getElementById(`dropdown-${type}-empty-state`),
});
