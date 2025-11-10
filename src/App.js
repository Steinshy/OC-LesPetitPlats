import { renderRecipes, renderCardsSkeletons } from "./card.js";
import { initDropdowns } from "./components/dropdown.js";
import { renderHeader } from "./components/headerImage.js";
import { initScrollToTop } from "./components/scrollToTop.js";
import { initSearch, updateCount, addFilter, removeFilter } from "./components/search.js";
import { hideSearchSkeleton } from "./components/skeletons.js";
import { showError, initErrorTestButton } from "./errorHandler.js";
import { mobileMenuManager } from "./mobileMenu.js";

import { buildRecipesData } from "./utils/recipesBuilder.js";

import "../styles/global.css";

const getContainer = () => document.querySelector(".cards-container");

const initApp = async () => {
  updateCount(0);
  mobileMenuManager();
  initErrorTestButton();
  initScrollToTop();

  const container = getContainer();
  if (container) renderCardsSkeletons(50);

  try {
    const recipesData = await buildRecipesData();

    console.log("recipesData", recipesData);

    updateCount(recipesData.length);
    hideSearchSkeleton();
    await renderHeader(recipesData);
    renderRecipes(recipesData);
    initSearch(recipesData);
    initDropdowns(recipesData, (type, value, remove = false) => {
      remove ? removeFilter(type, value) : addFilter(type, value);
    });
  } catch (error) {
    console.error("Error loading recipes:", error);

    if (container) {
      container.innerHTML = "";
    }

    updateCount(0);
    hideSearchSkeleton();
    showError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
  }
};

initApp();
