import { lru } from "tiny-lru";

const loadedImages = lru(500, 0);

export const isImageLoaded = url => !!(url && loadedImages.has(url));

const handleImageLoading = (img, imageUrl) => {
  if (!img) return;

  if (isImageLoaded(imageUrl)) {
    if (imageUrl) loadedImages.set(imageUrl, true);
    return;
  }

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

export const setupImageTracking = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;
  const img = fragment.querySelector(".card-picture img");
  if (!img) return;
  handleImageLoading(img, jpgUrl);
};

setupImageTracking.isImageLoaded = isImageLoaded;
