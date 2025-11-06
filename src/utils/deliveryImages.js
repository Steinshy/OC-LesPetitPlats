export const selectRandomImages = recipesData => {
  if (!recipesData || recipesData.length === 0) return null;
  const recipeImage = recipesData[Math.floor(Math.random() * recipesData.length)];
  return recipeImage?.images || null;
};

const loadedImages = new Set();
const webpTested = new Map();

export const isImageLoaded = url => {
  if (!url) return false;
  return loadedImages.has(url);
};

const checkWebpStatus = webpUrl => {
  if (!webpUrl) return false;
  if (webpTested.has(webpUrl)) return webpTested.get(webpUrl);
  if (loadedImages.has(webpUrl)) {
    webpTested.set(webpUrl, true);
    return true;
  }
  return null;
};

export const imagesTypes = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;

  const img = fragment.querySelector(".card-picture img");
  const placeholder = fragment.querySelector(".image-loading-placeholder");
  const webpSource = fragment.querySelector(".card-picture source[type='image/webp']");

  if (!img || !placeholder) return;

  const hidePlaceholder = () => placeholder.classList.add("hidden");
  const jpgWasLoaded = isImageLoaded(jpgUrl);
  const webpStatus = checkWebpStatus(webpUrl);

  if (webpSource && webpUrl) {
    if (webpStatus === null && !isImageLoaded(webpUrl)) {
      const testImg = new Image();
      testImg.onerror = () => {
        webpSource.remove();
        webpTested.set(webpUrl, false);
      };
      testImg.onload = () => {
        webpTested.set(webpUrl, true);
        loadedImages.add(webpUrl);
      };
      testImg.src = webpUrl;
    } else if (webpStatus === false) {
      webpSource.remove();
    }
  }

  if (jpgWasLoaded) {
    hidePlaceholder();
    return;
  }

  if (img.complete && img.naturalWidth > 0) {
    hidePlaceholder();
    loadedImages.add(jpgUrl);
  } else {
    const onLoad = () => {
      hidePlaceholder();
      loadedImages.add(jpgUrl);
    };
    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", hidePlaceholder, { once: true });

    if (img.complete) {
      setTimeout(onLoad, 0);
    }
  }
};

imagesTypes.isImageLoaded = isImageLoaded;
