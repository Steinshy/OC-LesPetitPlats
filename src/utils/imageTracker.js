// src/utils/imageTracker.js

import { lru } from "tiny-lru";

// Track loaded images
const loadedImages = lru(500, 0);

export const isImageLoaded = url => !!(url && loadedImages.has(url));

// Handle image load tracking
const handleImageLoading = (img, imageUrl) => {
  if (!img) return;

  // Already loaded
  if (isImageLoaded(imageUrl)) {
    if (imageUrl) loadedImages.set(imageUrl, true);
    return;
  }

  // Browser already loaded
  if (img.complete && img.naturalWidth > 0) {
    if (imageUrl) loadedImages.set(imageUrl, true);
    return;
  }

  const onLoad = () => {
    if (imageUrl) loadedImages.set(imageUrl, true);
  };

  img.addEventListener("load", onLoad, { once: true });

  if (img.complete) {
    setTimeout(() => {
      if (imageUrl) loadedImages.set(imageUrl, true);
    }, 0);
  }
};

// Setup image tracking for card
export const setupImageTracking = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;
  const img = fragment.querySelector(".card-picture img");
  if (!img) return;
  handleImageLoading(img, jpgUrl);
};

setupImageTracking.isImageLoaded = isImageLoaded;
