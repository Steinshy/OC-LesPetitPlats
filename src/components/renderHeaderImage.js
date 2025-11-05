import { selectRandomImages } from "../utils/deliveryImages.js";

const selectors = {
  searchSection: ".search-section",
};

const getElement = key => document.querySelector(selectors[key]);

export const renderHeaderImage = async recipesData => {
  const searchSection = getElement("searchSection");
  if (!searchSection) return;

  if (!recipesData || recipesData.length === 0) return;
  const headerImage = selectRandomImages(recipesData);
  if (!headerImage || (!headerImage.jpgUrl && !headerImage.webpUrl)) return;

  searchSection.style.backgroundImage = `url("${headerImage.jpgUrl || headerImage.webpUrl}")`;
};
