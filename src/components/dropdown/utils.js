export const DROPDOWN_TYPES = [
  { name: "Ingredients", type: "ingredients" },
  { name: "Appliances", type: "appliances" },
  { name: "Ustensils", type: "ustensils" },
];

import { normalizeString, capitalizeFirstLetter } from "@/helper/helper.js";

export const formatDropdownData = dropdownData => ({
  ingredients: dropdownData.ingredients.map(capitalizeFirstLetter),
  appliances: dropdownData.appliances.map(capitalizeFirstLetter),
  ustensils: dropdownData.ustensils.map(capitalizeFirstLetter),
});

export const getFilteredItems = (type, dropdownData, searchInput) => {
  const query = searchInput ? normalizeString(searchInput.value) : "";
  return query
    ? dropdownData[type].filter(item => normalizeString(item).includes(query))
    : dropdownData[type];
};

export const getDropdownElements = type => ({
  button: document.getElementById(`dropdown-${type}-button`),
  searchInput: document.getElementById(`search-${type}`),
  searchIcon: document.getElementById(`search-icon-${type}`),
  clearButton: document.getElementById(`clear-search-${type}`),
  menu: document.getElementById(`menu-${type}`),
  container: document.getElementById(`dropdown-${type}-container`),
  backdrop: document.getElementById(`dropdown-${type}-backdrop`),
});
