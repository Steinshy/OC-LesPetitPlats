export const buildSkeletonRecipes = (count = 6) => {
  const placeholderIngredient = { name: "-", quantity: 1 };
  const placeholderRecipe = {
    ingredients: [
      placeholderIngredient,
      placeholderIngredient,
      placeholderIngredient,
      placeholderIngredient,
    ],
  };
  return Array.from({ length: count }, () => ({ ...placeholderRecipe }));
};

export const getSkeletonList = count => buildSkeletonRecipes(count);
