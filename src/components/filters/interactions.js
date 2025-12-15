// src/components/filters/filtersInteraction.js
import { filtersElements } from "@components/filters/elements.js";
import { filtersPipeline } from "@components/filters/pipeline.js";
import { filtersState, updateFilterState } from "@components/filters/state.js";
import { eventBus } from "@utils/eventBus.js";
import { parseURLState } from "@utils/urlState.js";

const onClearAll = () => {
  updateFilterState.setSearch("");
  updateFilterState.clear("ingredients");
  updateFilterState.clear("appliances");
  updateFilterState.clear("utensils");

  filtersPipeline.apply();
};

const onRemoveItem = (type, value) => {
  updateFilterState.remove(type, value);
  filtersPipeline.apply();
};

const onSelectItem = (type, value) => {
  updateFilterState.add(type, value);
  filtersPipeline.apply();
};

const onSearchInput = query => {
  updateFilterState.setSearch(query);
  filtersPipeline.apply();
};

export const onPopState = () => {
  const urlFilters = parseURLState();

  updateFilterState.setSearch(urlFilters.search ?? "");
  updateFilterState.clear("ingredients");
  updateFilterState.clear("appliances");
  updateFilterState.clear("utensils");

  urlFilters.ingredients?.forEach(value => updateFilterState.add("ingredients", value));
  urlFilters.appliances?.forEach(value => updateFilterState.add("appliances", value));
  urlFilters.utensils?.forEach(value => updateFilterState.add("utensils", value));

  filtersPipeline.apply(true);
};

const onDropdownItemToggled = ({ type, value }) => {
  if (filtersState[type]?.has(value)) {
    onRemoveItem(type, value);
  } else {
    onSelectItem(type, value);
  }
};

const onTagClick = event => {
  const button = event.target.closest(".filter-tag");
  if (!button) return;

  const { type, value } = button.dataset;
  if (type && value) {
    onRemoveItem(type, value);
  }
};

export const filtersInteractions = {
  init() {
    const elements = filtersElements();

    elements.clearBtn?.addEventListener("click", onClearAll);

    if (elements.tagsList) {
      elements.tagsList.addEventListener("click", onTagClick);
    }

    eventBus.on("dropdown:itemToggled", onDropdownItemToggled);
    eventBus.on("filters:searchChanged", ({ query }) => onSearchInput(query));
  },

  cleanup() {
    const elements = filtersElements();

    elements.clearBtn?.removeEventListener("click", onClearAll);

    if (elements.tagsList) {
      elements.tagsList.removeEventListener("click", onTagClick);
    }

    eventBus.off("dropdown:itemToggled", onDropdownItemToggled);
    eventBus.off("filters:searchChanged", ({ query }) => onSearchInput(query));
  },
};
