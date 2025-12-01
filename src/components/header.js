// src/components/header.js

import { headerSkeleton } from "@components/skeletons/manager.js";

export const headerElement = () => ({
  header: document.getElementById("header"),
});

export const getHeaderHeight = () => headerElement().header?.offsetHeight ?? 0;

export const isScrolledPastHeader = () => window.scrollY > getHeaderHeight();

// Set random recipe image as header background
export const setupHeader = recipesData => {
  const { header } = headerElement();
  if (!recipesData) return;

  headerSkeleton().hide();

  const images = recipesData.map(recipe => recipe?.images).filter(Boolean);

  if (!images) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  const { webpUrl, jpgUrl } = images[randomIndex] || {};

  const imageUrl = webpUrl || jpgUrl || "";
  header.style.backgroundImage = `url(${imageUrl})`;
};
