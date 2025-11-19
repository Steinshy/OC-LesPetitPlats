import { normalizeString } from "@/utils/string.js";

const canonicalizeTerm = value => normalizeString(value);

export const SearchInput = (recipes, searchTerm) => {
  const query = normalizeString(searchTerm);
  if (!query) return recipes;

  return recipes.filter(recipe => {
    const haystack = [
      recipe.name,
      recipe.description,
      ...(recipe.ingredients || []).map(i => i?.ingredient),
      recipe.appliance,
      ...(recipe.ustensils || []),
    ]
      .filter(Boolean)
      .map(normalizeString)
      .join(" ");

    return haystack.includes(query);
  });
};

export const IngredientsInput = (recipes, ingredients) => {
  if (
    !ingredients ||
    (Array.isArray(ingredients) && ingredients.length === 0) ||
    (ingredients instanceof Set && ingredients.size === 0)
  ) {
    return recipes;
  }

  const ingredientsArray = Array.isArray(ingredients) ? ingredients : [...ingredients];

  return recipes.filter(recipe =>
    ingredientsArray.every(selectedIngredient => {
      const normalizedSelected = canonicalizeTerm(selectedIngredient);
      return recipe.ingredients?.some(ingredient => {
        const ingredientName = ingredient.ingredient ?? ingredient.name ?? "";
        return canonicalizeTerm(ingredientName) === normalizedSelected;
      });
    }),
  );
};

export const AppliancesInput = (recipes, appliances) => {
  if (
    !appliances ||
    (Array.isArray(appliances) && appliances.length === 0) ||
    (appliances instanceof Set && appliances.size === 0)
  ) {
    return recipes;
  }

  const appliancesArray = Array.isArray(appliances) ? appliances : [...appliances];

  return recipes.filter(recipe => {
    const normalizedAppliance = canonicalizeTerm(recipe.appliance);
    return appliancesArray.some(
      selectedAppliance => canonicalizeTerm(selectedAppliance) === normalizedAppliance,
    );
  });
};

export const UstensilsInput = (recipes, ustensils) => {
  if (
    !ustensils ||
    (Array.isArray(ustensils) && ustensils.length === 0) ||
    (ustensils instanceof Set && ustensils.size === 0)
  ) {
    return recipes;
  }

  const ustensilsArray = Array.isArray(ustensils) ? ustensils : [...ustensils];

  return recipes.filter(recipe =>
    ustensilsArray.every(selectedUstensil => {
      const normalizedSelected = canonicalizeTerm(selectedUstensil);
      return recipe.ustensils?.some(ustensil => canonicalizeTerm(ustensil) === normalizedSelected);
    }),
  );
};
