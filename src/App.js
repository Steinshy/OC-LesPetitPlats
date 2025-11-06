import { renderRecipes, renderCardsSkeletons } from "./card.js";
import { initDropdowns } from "./components/dropdown.js";
import { renderHeader } from "./components/headerImage.js";
import { initSearch, updateCount, addFilter, removeFilter } from "./components/search.js";
import {
  showSearchSkeleton,
  hideSearchSkeleton,
  renderHeaderSkeleton,
  hideHeaderSkeleton,
} from "./components/skeletons.js";

import { showError, hideError, initErrorTestButton } from "./errorHandler.js";
import { mobileMenuManager } from "./mobileMenu.js";

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
    await renderHeader(recipesData);
    hideHeaderSkeleton();
    renderRecipes(recipesData);
    initSearch(recipesData);
    initDropdowns(recipesData, (type, value, remove = false) => {
      if (remove) {
        removeFilter(type, value);
      } else {
        addFilter(type, value);
      }
    });
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
