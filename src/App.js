import { renderRecipes, renderCardsSkeletons } from "./card.js";
import { initDropdowns } from "./components/dropdown.js";
import { renderHeader } from "./components/headerImage.js";
import { initScrollToTop } from "./components/scrollToTop.js";
import { initSearch, updateCount, addFilter, removeFilter } from "./components/search.js";
import { hideSearchSkeleton } from "./components/skeletons.js";
import { showError } from "./errorHandler.js";

import { buildRecipesData } from "./utils/recipesBuilder.js";

import "../styles/global.css";

const initApp = async () => {
  updateCount(0);
  initScrollToTop();

  const container = document.querySelector(".cards-container");
  if (container) renderCardsSkeletons(50);

  try {
    const { recipes, dropdownData } = await buildRecipesData();

    console.log("recipesData", recipes);

    updateCount(recipes.length);
    hideSearchSkeleton();
    await renderHeader(recipes);
    renderRecipes(recipes);
    initSearch(recipes);
    initDropdowns(dropdownData, (type, value, remove = false) => {
      remove ? removeFilter(type, value) : addFilter(type, value);
    }, recipes);
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
