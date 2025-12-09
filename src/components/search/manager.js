// src/components/search/manager.js

import { searchElements } from "@components/search/elements.js";
import { searchSkeleton } from "@components/skeletons/manager.js";
import { eventBus } from "@utils/eventBus.js";

export const setupSearchBar = () => {
  const { search, container, input, clear, submit } = searchElements();

  if (!search || !input) return;

  const setSearchEnabled = isEnabled => {
    search.classList.toggle("disabled", !isEnabled);
    isEnabled ? searchSkeleton().hide() : searchSkeleton().show();
  };

  const handleSearch = () => {
    const query = input.value || "";
    const hasText = query.trim().length > 0;

    eventBus.emit("filters:searchChanged", { query });

    clear?.classList.toggle("hidden", !hasText);
    submit?.classList.toggle("hidden", hasText);
    container?.classList.toggle("has-clear-btn", hasText);
  };

  input.addEventListener("input", handleSearch);

  clear?.addEventListener("click", event => {
    input.value = "";
    clear?.classList.add("hidden");
    submit?.classList.remove("hidden");
    container?.classList.remove("has-clear-btn");

    event.preventDefault();
    event.stopPropagation();

    input.focus();
    handleSearch();
  });

  submit?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    input.focus();
    handleSearch();
  });

  setSearchEnabled(true);
};
