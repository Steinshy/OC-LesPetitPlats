const PLACEHOLDER_INGREDIENT = { name: "-", quantity: 1 };
const PLACEHOLDER_RECIPE = {
  ingredients: Array(4).fill(PLACEHOLDER_INGREDIENT),
};

export const buildSkeletonRecipes = (count = 6) =>
  Array.from({ length: count }, () => ({ ...PLACEHOLDER_RECIPE }));

export const getSkeletonList = buildSkeletonRecipes;
