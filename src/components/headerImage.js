import { selectRandomImages } from "../utils/deliveryImages.js";

export const renderHeader = async recipesData => {
  const searchSection = document.getElementById("search-section");
  if (!searchSection) return;

  if (!recipesData || recipesData.length === 0) return;
  const headerImage = selectRandomImages(recipesData);
  if (!headerImage || (!headerImage.jpgUrl && !headerImage.webpUrl)) return;

  searchSection.style.backgroundImage = `url("${headerImage.jpgUrl || headerImage.webpUrl}")`;
};
