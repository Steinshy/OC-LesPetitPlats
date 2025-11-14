import { renderRecipes, renderCardsSkeletons } from "./card.js";
import { enableDropdowns, renderDropdowns } from "./components/dropdown.js";
import { renderHeader } from "./components/headerImage.js";
import { initScrollToTop } from "./components/scrollToTop.js";
import {
  enableSearch,
  renderSearch,
  updateCount,
  addFilter,
  removeFilter,
} from "./components/search.js";
import { showError } from "./errorHandler.js";

import { buildRecipesData } from "./utils/recipesBuilder.js";

import "../styles/global.css";

const initApp = async () => {
  initScrollToTop();
  renderCardsSkeletons(50);
  renderDropdowns();
  renderSearch();

  try {
    const { recipes, dropdownData } = await buildRecipesData();
    updateCount(recipes.length);
    await renderHeader(recipes);
    renderRecipes(recipes);
    enableSearch(recipes);

    // Create filter change callback for dropdowns
    const onFilterChange = (type, value, wasSelected) => {
      if (wasSelected) {
        removeFilter(type, value);
      } else {
        addFilter(type, value);
      }
    };

    enableDropdowns(dropdownData, onFilterChange, recipes);
  } catch (error) {
    console.error("Error loading recipes:", error);

    const container = document.getElementById("recipes");
    if (container) {
      container.innerHTML = "";
    }

    updateCount(0);
    showError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
  }
};

initApp();
