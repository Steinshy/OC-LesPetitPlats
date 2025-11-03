import { renderRecipes } from "./card.js";
import { showError, hideError, initErrorTestButton } from "./errorHandler.js";
import { mobileMenuManager } from "./mobileMenu.js";
import { initSearch } from "./search.js";
import { buildRecipes } from "./utils/dataBuilders.js";

import "../styles/global.css";

const appInit = async () => {
  try {
    const recipes = await buildRecipes();
    renderRecipes(recipes);
    initSearch(renderRecipes);
  } catch (_error) {
    showError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
  }
  mobileMenuManager();
  initErrorTestButton();
  hideError();
};

appInit();
