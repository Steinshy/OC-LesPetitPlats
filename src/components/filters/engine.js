import { normalizeString } from "@utils/normalize.js";

const canonicalizeTerm = value => normalizeString(value);

export const filtersEngine = {
  extract: {
    ingredients(recipe) {
      const result = [];
      (recipe.ingredients || []).forEach(ingredient => {
        const name = ingredient?.ingredient;
        if (name) result.push(normalizeString(name));
      });
      return result;
    },

    appliances(recipe) {
      return recipe.appliance ? [normalizeString(recipe.appliance)] : [];
    },

    utensils(recipe) {
      const result = [];
      (recipe.utensils || []).forEach(utensil => {
        if (utensil) result.push(normalizeString(utensil));
      });
      return result;
    },
  },

  buildSearchText(recipe) {
    const ingredientNames = [];
    (recipe.ingredients || []).forEach(ingredient => {
      const name = ingredient?.ingredient;
      if (name) ingredientNames.push(name);
    });

    const haystackParts = [];
    if (recipe.name) haystackParts.push(recipe.name);
    if (recipe.description) haystackParts.push(recipe.description);
    ingredientNames.forEach(name => haystackParts.push(name));
    if (recipe.appliance) haystackParts.push(recipe.appliance);
    (recipe.utensils || []).forEach(utensil => {
      if (utensil) haystackParts.push(utensil);
    });

    const normalizedParts = [];
    haystackParts.forEach(part => {
      normalizedParts.push(normalizeString(part));
    });

    return normalizedParts.join(" ");
  },

  onSearch(recipes, searchTerm) {
    const query = normalizeString(searchTerm);
    if (!query) return recipes;

    const result = [];
    recipes.forEach(recipe => {
      if (!recipe) return;

      const ingredientNames = [];
      (recipe.ingredients || []).forEach(ingredient => {
        const name = ingredient?.ingredient;
        if (name) ingredientNames.push(name);
      });

      const haystackParts = [];
      if (recipe.name) haystackParts.push(recipe.name);
      if (recipe.description) haystackParts.push(recipe.description);
      ingredientNames.forEach(name => haystackParts.push(name));
      if (recipe.appliance) haystackParts.push(recipe.appliance);
      (recipe.utensils || []).forEach(utensil => {
        if (utensil) haystackParts.push(utensil);
      });

      const normalizedParts = [];
      haystackParts.forEach(part => {
        normalizedParts.push(normalizeString(part));
      });
      const haystack = normalizedParts.join(" ");

      if (haystack.includes(query)) {
        result.push(recipe);
      }
    });

    return result;
  },

  onFilter(recipes, selectedValues, type) {
    if (!selectedValues || selectedValues.size === 0) return recipes;

    const selectedArray = [];
    selectedValues.forEach(value => selectedArray.push(value));

    if (type === "ingredients") {
      const result = [];
      recipes.forEach(recipe => {
        if (!recipe) return;

        let allMatch = true;
        selectedArray.forEach(selectedIngredient => {
          if (!allMatch) return;

          const normalizedSelected = canonicalizeTerm(selectedIngredient);
          let found = false;
          (recipe.ingredients || []).forEach(ingredient => {
            if (found) return;
            const ingredientName = ingredient?.ingredient ?? "";
            if (canonicalizeTerm(ingredientName) === normalizedSelected) {
              found = true;
            }
          });

          if (!found) {
            allMatch = false;
          }
        });

        if (allMatch) {
          result.push(recipe);
        }
      });
      return result;
    }

    if (type === "appliances") {
      const result = [];
      recipes.forEach(recipe => {
        if (!recipe) return;

        const recipeAppliance = recipe.appliance;
        if (!recipeAppliance) return;

        const normalizedRecipeAppliance = canonicalizeTerm(recipeAppliance);
        const recipeApplianceArray = [normalizedRecipeAppliance];

        let allMatch = true;
        selectedArray.forEach(selectedAppliance => {
          if (!allMatch) return;

          const normalizedSelected = canonicalizeTerm(selectedAppliance);
          let found = false;
          recipeApplianceArray.forEach(appliance => {
            if (found) return;
            if (appliance === normalizedSelected) {
              found = true;
            }
          });

          if (!found) {
            allMatch = false;
          }
        });

        if (allMatch) {
          result.push(recipe);
        }
      });
      return result;
    }

    if (type === "utensils") {
      const result = [];
      recipes.forEach(recipe => {
        if (!recipe) return;

        let allMatch = true;
        selectedArray.forEach(selectedUstensil => {
          if (!allMatch) return;

          const normalizedSelected = canonicalizeTerm(selectedUstensil);
          let found = false;
          (recipe.utensils || []).forEach(ustensil => {
            if (found) return;
            if (canonicalizeTerm(ustensil) === normalizedSelected) {
              found = true;
            }
          });

          if (!found) {
            allMatch = false;
          }
        });

        if (allMatch) {
          result.push(recipe);
        }
      });
      return result;
    }

    return recipes;
  },

  filterDropdownItems(items, searchTerm) {
    const query = normalizeString(searchTerm);
    if (!query) return items;

    const result = [];
    items.forEach(item => {
      if (item == null) return;
      const text = normalizeString(item?.label ?? item?.value ?? item);
      if (text.includes(query)) {
        result.push(item);
      }
    });
    return result;
  },

  applyAll(recipes, filters, types = []) {
    let result = recipes;

    result = this.onSearch(result, filters.search);

    types.forEach(type => {
      const selected = filters[type];
      result = this.onFilter(result, selected, type);
    });

    return result;
  },
};
