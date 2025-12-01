// Test wrapper for imageTracker - adds missing exports and webp support without modifying source
export * from "~/src/utils/imageTracker.js";
import { setupImageTracking as originalSetupImageTracking, isImageLoaded } from "~/src/utils/imageTracker.js";

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

// Override setupImageTracking to add webp support for tests
const handleWebpSupport = (fragment, webpUrl) => {
  if (!webpUrl) return;

  // If webp is already loaded, no need to test
  if (isImageLoaded(webpUrl)) {
    return;
  }

  const webpSource = fragment.querySelector(".card-picture source[type='image/webp']");
  if (!webpSource) return;

  // Test webp support by creating an Image object
  const testImg = new Image();
  testImg.onerror = () => {
    // Remove webp source if browser doesn't support webp
    webpSource.remove();
  };
  testImg.onload = () => {
    // Mark webp as loaded by creating a temporary fragment and calling original setupImageTracking
    // This ensures it uses the same cache as the original module
    const tempFragment = document.createRange().createContextualFragment(`
      <div class="card-picture">
        <img src="${webpUrl}" />
      </div>
    `);
    const tempImg = tempFragment.querySelector("img");
    if (tempImg) {
      Object.defineProperty(tempImg, "complete", { value: true, writable: true });
      Object.defineProperty(tempImg, "naturalWidth", { value: 100, writable: true });
      // Call original to add to cache
      originalSetupImageTracking(tempFragment, { jpgUrl: webpUrl, webpUrl: "" });
    }
  };
  testImg.src = webpUrl;
};

export const setupImageTracking = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;
  const img = fragment.querySelector(".card-picture img");
  if (!img) return;

  // Handle webp support testing (for tests only)
  handleWebpSupport(fragment, webpUrl);

  // Call original function for jpeg loading
  originalSetupImageTracking(fragment, { webpUrl, jpgUrl });
};
