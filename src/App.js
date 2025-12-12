// src/App.js
import { setupRecipesCards } from "@components/cards/manager.js";
import { setupDropdowns } from "@components/dropdowns/manager.js";
import { setupFilters } from "@components/filters/setupFilters.js";
import { setupHeader } from "@components/header.js";
import { updateResultsCounter } from "@components/resultsCounter.js";
import { setupScrollLock } from "@components/scrollLock.js";
import { setupScrollToTop } from "@components/scrollToTop.js";
import { setupSearchBar } from "@components/search/manager.js";
import { setupSkeletons } from "@components/skeletons/manager.js";
import { buildRecipes } from "@utils/recipesBuilder.js";
import { setupToast } from "@utils/toast.js";
import "remixicon/fonts/remixicon.css";
import "@styles/global.css";

const initApp = async () => {
  const cleanups = [];
  setupSkeletons();
  cleanups.push(setupScrollToTop());

  // Fetch + transform recipes
  const recipesData = await buildRecipes();

  recipesData.match(
    recipes => {
      updateResultsCounter(recipes.length);
      setupHeader(recipes);
      cleanups.push(setupFilters(recipes));
      cleanups.push(setupDropdowns(recipes));
      cleanups.push(setupRecipesCards(recipes));
      cleanups.push(setupSearchBar());
      cleanups.push(setupScrollLock());
    },
    async message => {
      setupToast(message, "default");
      updateResultsCounter(0);
    },
  );
  return () => {
    cleanups.forEach(cleanup => typeof cleanup === "function" && cleanup());
  };
};

initApp();
