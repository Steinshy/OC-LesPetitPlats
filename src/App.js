// src/App.js
import { setupCoordinator } from "@/coordinator.js";
import { setupRecipesCards } from "@components/cards/manager.js";
import { setupDropdowns } from "@components/dropdowns/manager.js";
import { setupFilters } from "@components/filters/manager.js";
import { setupHeader } from "@components/header.js";
import { setupResultsCounter } from "@components/resultsCounter.js";
import { setupScrollLock } from "@components/scrollLock.js";
import { setupScrollToTop } from "@components/scrollToTop.js";
import { setupSearchBar } from "@components/search/manager.js";
import { setupSkeletons } from "@components/skeletons/manager.js";
import { buildRecipesData } from "@utils/recipesBuilder.js";
import { setupToast } from "@utils/toast.js";
import "remixicon/fonts/remixicon.css";
import "@styles/global.css";

const initApp = async () => {
  setupSkeletons();
  setupScrollToTop();
  setupCoordinator();

  // Fetch + transform recipes
  const recipesResult = await buildRecipesData();

  recipesResult.match(
    recipesData => {
      setupResultsCounter(recipesData.length);
      setupHeader(recipesData);
      setupSearchBar();
      setupDropdowns(recipesData);
      setupScrollLock();
      setupFilters(recipesData);
      setupRecipesCards(recipesData);
    },
    async message => {
      setupToast(message, "default");
      setupSearchBar();
      setupResultsCounter(0);
    },
  );
};

initApp();
