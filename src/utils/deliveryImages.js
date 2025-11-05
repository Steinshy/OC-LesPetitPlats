export const selectRandomImages = recipesData => {
  if (!recipesData || recipesData.length === 0) return null;
  const recipeImage = recipesData[Math.floor(Math.random() * recipesData.length)];
  return recipeImage?.images || null;
};
export const imagesTypes = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;

  const img = fragment.querySelector(".card-picture img");
  const placeholder = fragment.querySelector(".image-loading-placeholder");
  const webpSource = fragment.querySelector(".card-picture source[type='image/webp']");

  if (!img || !placeholder) return;

  const hidePlaceholder = () => placeholder.classList.add("hidden");
  if (webpSource && webpUrl) {
    const testImg = new Image();
    testImg.onerror = () => webpSource.remove();
    testImg.src = webpUrl;
  }

  if (img.complete) {
    hidePlaceholder();
  } else {
    img.addEventListener("load", hidePlaceholder, { once: true });
    img.addEventListener("error", hidePlaceholder, { once: true });
  }
};
