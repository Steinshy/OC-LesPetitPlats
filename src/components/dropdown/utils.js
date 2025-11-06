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

export const getFilteredItems = (type, dropdownData, searchInput) => {
  const query = searchInput ? normalize(searchInput.value) : "";
  return query
    ? dropdownData[type].filter(item => normalize(item).includes(query))
    : dropdownData[type];
};
