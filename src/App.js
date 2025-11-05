import { renderRecipes, renderSkeletons } from "./card.js";
import { showError, hideError, initErrorTestButton } from "./errorHandler.js";
import { mobileMenuManager } from "./mobileMenu.js";
import { initSearch, updateCount } from "./search.js";
import { fetchAndBuildRecipes } from "./utils/recipesBuilder.js";

import "../styles/global.css";

const getContainer = () => document.querySelector(".cards-container");

const initSearchWhenReady = recipes => {
  const init = () => initSearch(recipes);
  if ("requestIdleCallback" in window) {
    requestIdleCallback(init, { timeout: 2000 });
  } else {
    setTimeout(init, 0);
  }
};

const appInit = async () => {
  updateCount(0);
  mobileMenuManager();
  initErrorTestButton();
  hideError();

  const container = getContainer();
  if (container) renderSkeletons(6);

  try {
    const recipes = await fetchAndBuildRecipes();
    updateCount(recipes.length);
    renderRecipes(recipes);
    initSearchWhenReady(recipes);
  } catch (error) {
    console.error(error);
    container && (container.innerHTML = "");
    showError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", appInit);
} else {
  appInit();
}
