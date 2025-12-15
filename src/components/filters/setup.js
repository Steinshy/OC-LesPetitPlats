// src/components/filters/setupFilters.js
import { filtersInteractions, onPopState } from "@components/filters/interactions.js";
import { filtersPipeline } from "@components/filters/pipeline.js";
import { filtersState, updateFilterState } from "@components/filters/state.js";
import { filtersUi } from "@components/filters/ui.js";
import { searchUi } from "@components/search/manager.js";
import { eventBus } from "@utils/eventBus.js";
import { parseURLState } from "@utils/urlState.js";

// Setup Filters
export const setupFilters = recipes => {
  if (!recipes) return () => {};

  // Initialize filters pipeline
  filtersPipeline.init(recipes);

  restoreFiltersFromURL();

  // Sync search bar to restored search state
  searchUi.syncFromState();

  // Attach interactions (search + dropdown)
  filtersInteractions.init();

  // UI reaction to filter updates
  const onFiltersUpdated = () => {
    searchUi.syncFromState();
    filtersUi.updateTagList(filtersState);
    filtersUi.updateFiltersCounter(filtersState);
  };

  eventBus.on("filters:updated", onFiltersUpdated);

  window.addEventListener("popstate", onPopState);

  // Run initial filtering (skip URL update since we just restored from URL)
  filtersPipeline.apply(true);

  return () => {
    filtersInteractions.cleanup();
    eventBus.off("filters:updated", onFiltersUpdated);
    window.removeEventListener("popstate", onPopState);
  };
};

// Restore initial state from URL if present
const restoreFiltersFromURL = () => {
  const urlFilters = parseURLState();
  const hasURLFilters =
    (urlFilters.search && urlFilters.search.length > 0) ||
    urlFilters.ingredients.size > 0 ||
    urlFilters.appliances.size > 0 ||
    urlFilters.utensils.size > 0;

  if (hasURLFilters) {
    updateFilterState.setSearch(urlFilters.search ?? "");
    updateFilterState.clear("ingredients");
    updateFilterState.clear("appliances");
    updateFilterState.clear("utensils");

    urlFilters.ingredients?.forEach(value => updateFilterState.add("ingredients", value));
    urlFilters.appliances?.forEach(value => updateFilterState.add("appliances", value));
    urlFilters.utensils?.forEach(value => updateFilterState.add("utensils", value));
  }
};
