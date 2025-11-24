import { setupDropdowns } from "./components/dropdown/manager.js";
import { setupFilters } from "./components/filters/manager.js";
import { initScrollToTop } from "./components/scrollToTop.js";
import { setupMainHeader, setupSearchSection } from "./components/search/manager.js";
import { initSkeletons } from "./components/skeletons.js";
import { showError, hideError } from "./utils/errorHandler.js";
import { buildRecipesData } from "./utils/recipesBuilder.js";
import { updateCounter } from "./utils/string.js";
import "remixicon/fonts/remixicon.css";
import "../styles/global.css";

const initApp = async () => {
  hideError(); // Need rework
  initSkeletons();

  const recipesResult = await buildRecipesData();

  recipesResult.match(
    recipesData => {
      updateCounter(recipesData.length);
      setupMainHeader(recipesData);
      setupSearchSection();
      setupDropdowns(recipesData);
      setupFilters(recipesData);
    },
    error => {
      console.error("Error loading recipes:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors du chargement des recettes.";
      showError(errorMessage);

      setupSearchSection();
      updateCounter(0);
    },
  );

  initScrollToTop();
};

initApp();
