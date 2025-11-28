// src/components/search/manager.js

import { searchElements } from "@components/search/elements.js";
import { searchSkeleton } from "@components/skeletonsManager.js";

// ---------------
// setup
// ---------------

export const setupSearchBar = () => {
  const { searchBar, searchInput, clearButton, submitSearch } = searchElements;

  if (!searchBar || !searchInput) return;

  searchSkeleton().hide();

  // Toggle loading state
  const toggleSearchState = isEnabled => {
    searchBar.classList.toggle("disabled", !isEnabled);
    isEnabled ? searchSkeleton().hide() : searchSkeleton().show();
  };

  // Dispatch search event
  const runSearch = () => {
    const query = searchInput.value || "";
    const hasText = query.trim().length > 0;

    document.dispatchEvent(
      new CustomEvent("filters:searchChanged", {
        detail: { query },
      }),
    );

    clearButton?.classList.toggle("hidden", !hasText);
    submitSearch?.classList.toggle("hidden", hasText);
  };

  searchInput.addEventListener("input", runSearch);
  clearButton?.addEventListener("click", event => {
    searchInput.value = "";
    clearButton?.classList.add("hidden");
    submitSearch?.classList.remove("hidden");
    event.preventDefault();
    event.stopPropagation();
    searchInput.focus();
    runSearch();
  });

  submitSearch?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    searchInput.focus();
    runSearch();
  });

  toggleSearchState(true);
};
