// src/coordinator.js

import { setupRecipesCards } from "@components/cards/manager.js";
import { setupDropdowns } from "@components/dropdowns/manager.js";
import { setupResultsCounter } from "@components/resultsCounter.js";
import { updateURLState } from "@utils/urlState.js";

let isInitialSync = true;

/**
 * Synchronizes all UI components when filters change.
 * Listens to `filters:stateChanged` events dispatched by the filters manager.
 */
const syncUI = event => {
  const { filteredRecipes, filters } = event.detail;

  setupRecipesCards(filteredRecipes);
  setupDropdowns(filteredRecipes);
  setupResultsCounter(filteredRecipes.length);

  if (!isInitialSync) {
    updateURLState(filters);
  }

  isInitialSync = false;
};

/**
 * Initializes the coordinator by listening to filter state changes.
 */
export const setupCoordinator = () => {
  document.addEventListener("filters:stateChanged", syncUI);
};

/**
 * Marks initial sync as complete (called after first render).
 */
export const markInitialSyncComplete = () => {
  isInitialSync = false;
};

