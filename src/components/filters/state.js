export const filtersState = {
  search: "",
  ingredients: new Set(),
  appliances: new Set(),
  utensils: new Set(),
};

export const updateFilterState = {
  setSearch: value => (filtersState.search = value),
  add: (type, value) => filtersState[type]?.add(value),
  remove: (type, value) => filtersState[type]?.delete(value),
  clear: type => filtersState[type]?.clear(),
};
