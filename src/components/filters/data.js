// src/components/filters/data.js

import { dropdownTypes } from "@components/dropdowns/manager.js";
import { normalizeString } from "@utils/normalize.js";

// Build active filters array from state for rendering tags
export const buildActiveFilters = filters => {
  const result = [];

  dropdownTypes.forEach(type => {
    const set = filters[type];
    if (!(set instanceof Set)) return;

    set.forEach(value => {
      result.push({
        type,
        value,
        label: capitalize(value),
        id: `filter-tag-${type}-${normalizeString(value)}`,
      });
    });
  });

  return result;
};

// Get total count of active filters (excluding search)
export const getFilterCount = filters => {
  let count = 0;
  dropdownTypes.forEach(type => {
    const set = filters[type];
    if (set instanceof Set) count += set.size;
  });
  return count;
};

// Capitalize first letter
const capitalize = value =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";
