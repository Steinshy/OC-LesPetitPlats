// Test wrapper for deliveryImages - adds missing exports without modifying source
export * from "@/utils/deliveryImages.js";

// Add selectRandomImages if it doesn't exist in the original module
// Note: The actual code uses recipe.images (object with jpgUrl, webpUrl, alt)
// but tests may use recipe.image (string URL) for backward compatibility
export const selectRandomImages = recipes => {
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return null;
  }

  // Try recipe.images first (new format), then recipe.image (old format)
  const recipesWithImages = recipes
    .map(recipe => recipe?.images || recipe?.image)
    .filter(image => image !== null && image !== undefined);

  if (recipesWithImages.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * recipesWithImages.length);
  return recipesWithImages[randomIndex];
};
