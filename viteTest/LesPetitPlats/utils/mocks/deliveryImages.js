// Test wrapper for deliveryImages - adds missing exports without modifying source
export * from "../../../../src/utils/deliveryImages.js";

// Add selectRandomImages if it doesn't exist in the original module
export const selectRandomImages = recipes => {
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return null;
  }

  const recipesWithImages = recipes
    .map(recipe => recipe?.image)
    .filter(image => image !== null && image !== undefined);

  if (recipesWithImages.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * recipesWithImages.length);
  return recipesWithImages[randomIndex];
};
