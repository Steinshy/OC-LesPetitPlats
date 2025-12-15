// src/components/hero.js
import { heroSkeleton } from "@components/skeletons/manager.js";
import { baseUrl } from "@utils/config.js";

export const setupHero = recipes => {
  const hero = document.getElementById("hero");
  if (!hero || !recipes || !Array.isArray(recipes)) return;

  heroSkeleton().hide();

  const recipesWithImage = recipes.filter(
    recipe => typeof recipe?.image === "string" && recipe.image.trim() !== "",
  );

  if (!recipesWithImage.length) return;

  const index = Math.floor(Math.random() * recipesWithImage.length);
  const imageName = recipesWithImage[index].image;
  const base = imageName.replace(/\.[^./]+$/, "");

  const webpUrl = `${baseUrl}pictures/hero/${base}-hero.webp`;
  const jpgUrl = `${baseUrl}pictures/hero/${base}-hero.jpg`;

  const img = new Image();
  img.onload = () => (hero.style.backgroundImage = `url(${webpUrl})`);
  img.onerror = () => (hero.style.backgroundImage = `url(${jpgUrl})`);
  img.src = webpUrl;
};
