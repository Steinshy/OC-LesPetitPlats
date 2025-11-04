import { renderRecipes, renderSkeletons } from "./card.js";
import { showError, hideError, initErrorTestButton } from "./errorHandler.js";
import { mobileMenuManager } from "./mobileMenu.js";
import { initSearch, updateCount } from "./search.js";
import { buildRecipes } from "./utils/recipesBuilder.js";

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
    const recipes = await buildRecipes();
    renderRecipes(recipes);
    initSearch(recipes);
  } catch (error) {
    console.error(error);
    container.innerHTML = "";
    showError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
  }
};

appInit();
