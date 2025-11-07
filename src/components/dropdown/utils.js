export const DROPDOWN_TYPES = [
  { name: "Ingredients", type: "ingredients" },
  { name: "Appliances", type: "appliances" },
  { name: "Ustensils", type: "ustensils" },
];

export const normalize = value => (typeof value === "string" ? value.trim().toLowerCase() : "");

export const extractDropdownData = (recipes, type) => {
  const dataSet = new Set();
  recipes.forEach(recipe => {
    if (type === "ingredients") {
      recipe.ingredients?.forEach(ingredient => ingredient?.name && dataSet.add(ingredient.name));
    } else if (type === "appliances") {
      recipe.appliance && dataSet.add(recipe.appliance);
    } else if (type === "ustensils") {
      recipe.ustensils?.forEach(ustensil => ustensil && dataSet.add(ustensil));
    }
  });
  return [...dataSet].sort();
};

export const buildDropdownData = recipes =>
  DROPDOWN_TYPES.reduce((acc, { type }) => {
    acc[type] = extractDropdownData(recipes, type);
    return acc;
  }, {});

export const getFilteredItems = (type, dropdownData, searchInput) => {
  const query = searchInput ? normalize(searchInput.value) : "";
  return query
    ? dropdownData[type].filter(item => normalize(item).includes(query))
    : dropdownData[type];
};

export const getDropdownElements = type => ({
  button: document.getElementById(`dropdown-${type}-button`),
  searchInput: document.getElementById(`search-${type}`),
  menu: document.getElementById(`menu-${type}`),
  clearButton: document.getElementById(`clear-search-${type}`),
  container: document.querySelector(`.dropdown-container[data-type="${type}"]`),
  backdrop: document.querySelector(`.dropdown-container[data-type="${type}"] .dropdown-backdrop`),
});
