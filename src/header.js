// src/components/renderHeaderImage.js

import { headerSkeleton } from "@components/skeletonsManager.js";

// Set random recipe image as header background
export const setupHeader = recipesData => {
  const headerElement = document.getElementById("header");
  if (!headerElement || !recipesData) return;

  headerSkeleton().hide();

  const images = recipesData.map(recipe => recipe?.images).filter(Boolean);

  if (!images) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  const { webpUrl, jpgUrl } = images[randomIndex] || {};

  const imageUrl = webpUrl || jpgUrl || "";
  headerElement.style.backgroundImage = `url(${imageUrl})`;
};
