// src/components/filters/setupFilters.js
import { filtersUi } from "@components/filters/filtersUi.js";
import { searchUi } from "@components/search/manager.js";
import { eventBus } from "@utils/eventBus.js";
import { filtersInteractions } from "./filtersInteraction.js";
import { filtersPipeline } from "./filtersPipeline.js";
import { filtersState } from "./filtersState.js";

// Setup Filters
export const setupFilters = recipes => {
  if (!recipes) return () => {};

  filtersState.allRecipes = Array.isArray(recipes) ? recipes : [];

  // Initialize filters pipeline
  filtersPipeline.init(recipes);

  // Sync search bar to restored search state
  searchUi.syncFromState();

  // Attach interactions (search + dropdown)
  filtersInteractions.init();

  // UI reaction to filter updates
  const onFiltersUpdated = () => {
    filtersUi.updateTagList(filtersState);
    filtersUi.updateFiltersCounter(filtersState);
  };

  eventBus.on("filters:updated", onFiltersUpdated);

  // Run initial filtering
  filtersPipeline.apply();

  return () => {
    eventBus.off("filters:updated", onFiltersUpdated);
  };
};
