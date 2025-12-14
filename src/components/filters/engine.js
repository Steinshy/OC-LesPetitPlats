import { normalizeString } from "@utils/normalize.js";

export const filtersEngine = {
  // Extraction logic - Changer en class
  extract: {
    ingredients(recipe) {
      return (recipe.ingredients || [])
        .map(i => i?.ingredient)
        .filter(Boolean)
        .map(normalizeString);
    },

    appliances(recipe) {
      return recipe.appliance ? [normalizeString(recipe.appliance)] : [];
    },

    utensils(recipe) {
      return (recipe.utensils || []).filter(Boolean).map(normalizeString);
    },
  },

  // Search logic
  buildSearchText(recipe) {
    const base = [recipe.name, recipe.description, recipe.appliance];

    const extras = [];

    if (Array.isArray(recipe.ingredients)) {
      extras.push(...recipe.ingredients.map(i => i?.ingredient));
    }

    if (Array.isArray(recipe.utensils)) {
      extras.push(...recipe.utensils);
    }

    return normalizeString([...base, ...extras].filter(Boolean).join(" "));
  },

  onSearch(recipes, searchTerm) {
    const query = normalizeString(searchTerm);
    if (!query) return recipes;

    return recipes.filter(recipe => this.buildSearchText(recipe).includes(query));
  },

  // Field filtering logic
  onFilter(recipes, selectedValues, type) {
    if (!selectedValues || selectedValues.size === 0) return recipes;

    const extractMethod = this.extract[type];
    if (typeof extractMethod !== "function") return recipes;

    const selected = [...selectedValues];

    return recipes.filter(recipe => {
      const values = extractMethod(recipe);
      return selected.every(v => values.includes(normalizeString(v)));
    });
  },

  // Dropdown search logic
  filterDropdownItems(items, searchTerm) {
    const query = normalizeString(searchTerm);
    if (!query) return items;

    return items.filter(item => {
      if (item == null) return false;
      const text = normalizeString(item?.label ?? item?.value ?? item);
      return text.includes(query);
    });
  },

  // Final combined filtering
  applyAll(recipes, filters, types = []) {
    let result = recipes;

    // Apply search
    result = this.onSearch(result, filters.search);

    // Apply each dropdown filter
    types.forEach(type => {
      const selected = filters[type];
      result = this.onFilter(result, selected, type);
    });

    return result;
  },
};
