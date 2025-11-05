import { renderRecipes, renderCardsSkeletons } from "./card.js";
import { renderHeaderImage } from "./components/renderHeaderImage.js";
import {
  showSearchSkeleton,
  hideSearchSkeleton,
  renderHeaderSkeleton,
  hideHeaderSkeleton,
} from "./components/skeletons.js";
import { showError, hideError, initErrorTestButton } from "./errorHandler.js";
import { mobileMenuManager } from "./mobileMenu.js";
import { initSearch, updateCount } from "./search.js";
import { buildRecipesData } from "./utils/recipesBuilder.js";

import "../styles/global.css";

const getContainer = () => document.querySelector(".cards-container");

const initApp = async () => {
  showSearchSkeleton();
  renderHeaderSkeleton();
  updateCount(0);
  mobileMenuManager();
  initErrorTestButton();
  hideError();

  const container = getContainer();
  if (container) renderCardsSkeletons(50);

  try {
    const recipesData = await buildRecipesData();

    console.log("recipesData", recipesData);

    updateCount(recipesData.length);
    hideSearchSkeleton();
    await renderHeaderImage(recipesData);
    hideHeaderSkeleton();
    renderRecipes(recipesData);
    initSearch(recipesData);
  } catch (error) {
    console.error(error);
    container && (container.innerHTML = "");
    showError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
    hideSearchSkeleton();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
