import { renderRecipes, renderSkeletons } from "./card.js";
import { showError, hideError, initErrorTestButton } from "./errorHandler.js";
import { mobileMenuManager } from "./mobileMenu.js";
import { initSearch, updateCount } from "./search.js";
import { fetchAndBuildRecipes } from "./utils/recipesBuilder.js";

import "../styles/global.css";

const appInit = async () => {
  updateCount(0);
  mobileMenuManager();
  initErrorTestButton();
  hideError();
  const container = document.querySelector(".cards-container");
  if (container) {
    renderSkeletons(6);
  }
  try {
    const recipes = await fetchAndBuildRecipes();
    renderRecipes(recipes);
    const initializeSearchWhenReady = () => initSearch(recipes);
    if ("requestIdleCallback" in window) {
      requestIdleCallback(initializeSearchWhenReady, { timeout: 2000 });
    } else {
      setTimeout(initializeSearchWhenReady, 0);
    }
  } catch (error) {
    console.error(error);
    if (container) {
      container.innerHTML = "";
    }
    showError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", appInit);
} else {
  appInit();
}
