// src/components/header.js
import { headerSkeleton } from "@components/skeletons/manager.js";
import { isMobile } from "@utils/config.js";

export const headerElement = () => ({
  header: document.getElementById("header"),
});

export const getHeaderHeight = () => headerElement().header?.offsetHeight ?? 0;

export const isScrolledPastHeader = () => {
  const { header } = headerElement();
  if (!header) return false;

  const headerHeight = header.offsetHeight || 0;

  // Mobile: trigger earlier so sticky kicks in quickly
  const threshold = isMobile() ? headerHeight * 0.35 : headerHeight;

  return window.scrollY > threshold;
};

// Set random recipe image as header background
export const setupHeader = recipes => {
  const { header } = headerElement();
  if (!recipes || !header || !Array.isArray(recipes)) return;

  headerSkeleton().hide();

  const images = recipes.map(recipe => recipe?.images).filter(Boolean);

  if (!images.length) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  const { webpUrl, jpgUrl } = images[randomIndex] || {};
  const imageUrl = webpUrl || jpgUrl || "";

  if (!imageUrl) return;

  header.style.backgroundImage = `url(${imageUrl})`;
};
