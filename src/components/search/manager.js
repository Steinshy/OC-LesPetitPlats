// src/components/search/manager.js

import { searchElements } from "@components/search/elements.js";
import { searchSkeleton } from "@components/skeletons/manager.js";

// ---------------
// setup
// ---------------

export const setupSearchBar = () => {
  const { search, container, input, clear, submit } = searchElements();

  if (!search || !input) return;
  // Toggle loading state
  const toggleSearchState = isEnabled => {
    search.classList.toggle("disabled", !isEnabled);
    isEnabled ? searchSkeleton().hide() : searchSkeleton().show();
  };

  // Dispatch search event
  const runSearch = () => {
    const query = input.value || "";
    const hasText = query.trim().length > 0;

    document.dispatchEvent(
      new CustomEvent("filters:searchChanged", {
        detail: { query },
      }),
    );

    clear?.classList.toggle("hidden", !hasText);
    submit?.classList.toggle("hidden", hasText);
    container?.classList.toggle("has-clear-btn", hasText);
  };

  input.addEventListener("input", runSearch);
  clear?.addEventListener("click", event => {
    input.value = "";
    clear?.classList.add("hidden");
    submit?.classList.remove("hidden");
    container?.classList.remove("has-clear-btn");
    event.preventDefault();
    event.stopPropagation();
    input.focus();
    runSearch();
  });

  submit?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    input.focus();
    runSearch();
  });

  toggleSearchState(true);
};
