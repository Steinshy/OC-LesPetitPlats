export const selectRandomImages = recipesData => {
  if (!recipesData?.length) return null;
  return recipesData[Math.floor(Math.random() * recipesData.length)]?.image || null;
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

const handleWebpSupport = (webpSource, webpUrl) => {
  if (!webpSource || !webpUrl) return;

  const webpStatus = checkWebpStatus(webpUrl);
  if (webpStatus === false) {
    webpSource.remove();
    return;
  }

  if (webpStatus === null) {
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
  }
};

const handleJpegLoading = (img, placeholder, jpgUrl) => {
  if (!img || !placeholder) return;

  const hidePlaceholder = () => placeholder.classList.add("hidden");
  const jpgWasLoaded = isImageLoaded(jpgUrl);

  if (jpgWasLoaded) {
    hidePlaceholder();
    return;
  }

  if (img.complete && img.naturalWidth > 0) {
    hidePlaceholder();
    if (jpgUrl) loadedImages.add(jpgUrl);
    return;
  }

  const onLoad = () => {
    hidePlaceholder();
    if (jpgUrl) loadedImages.add(jpgUrl);
  };

  const onError = () => hidePlaceholder();

  img.addEventListener("load", onLoad, { once: true });
  img.addEventListener("error", onError, { once: true });

  if (img.complete) {
    setTimeout(onError, 0);
  }
};

export const imagesTypes = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;

  const img = fragment.querySelector(".card-picture img");
  const placeholder = fragment.querySelector(".image-loading-placeholder");
  const webpSource = fragment.querySelector(".card-picture source[type='image/webp']");

  if (!img || !placeholder) return;

  handleWebpSupport(webpSource, webpUrl);
  handleJpegLoading(img, placeholder, jpgUrl);
};

imagesTypes.isImageLoaded = isImageLoaded;
