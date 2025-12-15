// src/App.js
import { setupCards } from "@components/cards/setup.js";
import { setupDropdowns } from "@components/dropdowns/setup.js";
import { setupFilters } from "@components/filters/setup.js";
import { setupHero } from "@components/hero.js";
import { updateResultsCounter } from "@components/resultsCounter.js";
import { setupScrollLock, setupScrollToTop } from "@components/scroll.js";
import { setupSearch } from "@components/search/setup.js";
import { setupSkeletons } from "@components/skeletons/setup.js";
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
      setupHero(recipes);
      cleanups.push(setupDropdowns(recipes));
      cleanups.push(setupCards(recipes));
      cleanups.push(setupFilters(recipes));
      cleanups.push(setupSearch());
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

const cleanup = await initApp();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (cleanup) cleanup();
  });
}
