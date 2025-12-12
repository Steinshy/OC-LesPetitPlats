import { dropdownTypes } from "@components/dropdowns/manager.js";
import { eventBus } from "@utils/eventBus.js";
import { filtersEngine } from "./filtersEngine.js";
import { filtersState } from "./filtersState.js";
export const filtersPipeline = {
  recipes: [],

  init(recipes) {
    this.recipes = Array.isArray(recipes) ? recipes : [];
  },

  apply() {
    const filtered = filtersEngine.applyAll(this.recipes, filtersState, dropdownTypes);
    filtersState.filtered = filtered;
    this.notifyUpdate(filtered);
    return filtered;
  },
  notifyUpdate(filtered) {
    eventBus.emit("filters:updated", { filtered });
  },
};
