import { setupDropdowns } from "./components/dropdown/manager.js";
import { setupFilters } from "./components/filters/manager.js";
import { setupResultsCounter } from "./components/resultsCounter.js";
import { initScrollToTop } from "./components/scrollToTop.js";
import { setupHeaderTitle, setupSearchBar } from "./components/search/manager.js";
import { initSkeletons } from "./components/skeletons.js";
import { showError, hideError } from "./utils/errorHandler.js";
import { buildRecipesData } from "./utils/recipesBuilder.js";
import "remixicon/fonts/remixicon.css";
import "../styles/global.css";

const initApp = async () => {
  hideError();
  initSkeletons();

  const recipesResult = await buildRecipesData();

  recipesResult.match(
    recipesData => {
      setupResultsCounter(recipesData.length);
      setupHeaderTitle(recipesData);
      setupSearchBar();
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

      setupSearchBar();
      setupResultsCounter(0);
    },
  );

  initScrollToTop();
};

initApp();
