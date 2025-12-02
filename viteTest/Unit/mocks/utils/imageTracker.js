// Test wrapper for imageTracker with webp support
export * from "@/utils/imageTracker.js";
import { setupImageTracking as originalSetupImageTracking, isImageLoaded } from "@/utils/imageTracker.js";

// Add selectRandomImages (handles both recipe.images object and recipe.image string)
export const selectRandomImages = recipes => {
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return null;
  }

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
  if (!webpUrl || isImageLoaded(webpUrl)) return;

  const webpSource = fragment.querySelector(".card-picture source[type='image/webp']");
  if (!webpSource) return;

  const testImg = new Image();
  testImg.onerror = () => {
    webpSource.remove();
  };
  testImg.onload = () => {
    // Mark webp as loaded using original cache
    const tempFragment = document.createRange().createContextualFragment(`
      <div class="card-picture">
        <img src="${webpUrl}" />
      </div>
    `);
    const tempImg = tempFragment.querySelector("img");
    if (tempImg) {
      Object.defineProperty(tempImg, "complete", { value: true, writable: true });
      Object.defineProperty(tempImg, "naturalWidth", { value: 100, writable: true });
      originalSetupImageTracking(tempFragment, { jpgUrl: webpUrl, webpUrl: "" });
    }
  };
  testImg.src = webpUrl;
};

export const setupImageTracking = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;
  const img = fragment.querySelector(".card-picture img");
  if (!img) return;

  handleWebpSupport(fragment, webpUrl);
  originalSetupImageTracking(fragment, { webpUrl, jpgUrl });
};
