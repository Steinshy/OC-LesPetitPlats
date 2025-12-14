// src/components/search/manager.js
import { filtersState } from "@components/filters/state.js";
import { searchElements } from "@components/search/elements.js";

export const searchUi = {
  syncFromState() {
    const { input, clear, submit, container } = searchElements();
    if (!input) return;

    const query = filtersState.search.trim();
    input.value = query;

    const hasText = query.length > 0;

    clear?.classList.toggle("hidden", !hasText);
    submit?.classList.toggle("hidden", hasText);
    container?.classList.toggle("has-clear-btn", hasText);
  },
};
