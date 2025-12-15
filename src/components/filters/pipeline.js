import { dropdownTypes } from "@components/dropdowns/setup.js";
import { filtersEngine } from "@components/filters/engine.js";
import { filtersState } from "@components/filters/state.js";
import { eventBus } from "@utils/eventBus.js";
import { updateURLState, clearURLState } from "@utils/urlState.js";

export const filtersPipeline = {
  recipes: [],

  init(recipes) {
    this.recipes = Array.isArray(recipes) ? recipes : [];
  },

  apply(skipURLUpdate = false) {
    const filtered = filtersEngine.applyAll(this.recipes, filtersState, dropdownTypes);
    filtersState.filtered = filtered;
    this.notifyUpdate(filtered, skipURLUpdate);
    return filtered;
  },

  notifyUpdate(filtered, skipURLUpdate = false) {
    if (!skipURLUpdate) {
      const hasFilters =
        filtersState.search ||
        filtersState.ingredients.size > 0 ||
        filtersState.appliances.size > 0 ||
        filtersState.utensils.size > 0;

      if (hasFilters) {
        updateURLState(filtersState);
      } else {
        clearURLState();
      }
    }

    eventBus.emit("filters:updated", { filtered });
  },
};
