import { setupDropdowns } from "@components/dropdown/manager.js";
import { setupFilters } from "@components/filters/manager.js";
import { setupHeader } from "@components/renderHeaderImg.js";
import { setupResultsCounter } from "@components/resultsCounter.js";
import { initScrollToTop } from "@components/scrollToTop.js";
import { setupSearchBar } from "@components/search/manager.js";

import { initSkeletons } from "@components/skeletonsManager.js";
import { setupAppError } from "@utils/errorHandler.js";
import { buildRecipesData } from "@utils/recipesBuilder.js";
import "remixicon/fonts/remixicon.css";
import "@styles/global.css";

const initApp = async () => {
  initSkeletons();

  const recipesResult = await buildRecipesData();

  recipesResult.match(
    recipesData => {
      setupResultsCounter(recipesData.length);
      setupHeader(recipesData);
      setupSearchBar();
      setupDropdowns(recipesData);
      setupFilters(recipesData);
    },
    async error => {
      await setupAppError(error, "default");
      setupSearchBar();
      setupResultsCounter(0);
    },
  );

  initScrollToTop();
};

initApp();
