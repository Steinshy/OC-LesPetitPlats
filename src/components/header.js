// src/components/header.js
import { headerSkeleton } from "@components/skeletons/manager.js";

export const headerElement = () => ({
  header: document.getElementById("header"),
});

// Set random recipe image as header background
export const setupHeader = recipes => {
  const header = document.getElementById("header");
  if (!header || !recipes || !Array.isArray(recipes)) return;

  headerSkeleton().hide();

  const images = recipes.map(recipe => recipe?.images).filter(Boolean);

  if (!images.length) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  const { webpUrl, jpgUrl } = images[randomIndex] || {};
  const imageUrl = webpUrl || jpgUrl || "";

  if (!imageUrl) return;

  header.style.backgroundImage = `url(${imageUrl})`;
};
