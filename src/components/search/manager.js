import { showSearchSkeleton, hideSearchSkeleton } from "../skeletons.js";
import { mainHeader } from "./render.js";

const getSearchSectionElements = () => ({
  root: document.getElementById("header"),
  headerTitle: document.getElementById("header-title"),
});

const getSearchElements = () => ({
  root: document.getElementById("main-search-bar"),
  container: document.getElementById("search-bar-container"),
  searchInput: document.getElementById("main-search-input"),
  clearButton: document.getElementById("main-clear-search-btn"),
  searchButton: document.getElementById("main-search-btn"),
});

export const setupMainHeader = recipesData => {
  const { root } = getSearchSectionElements();
  if (!root || !recipesData) return;

  const images = recipesData.map(recipe => recipe?.images).filter(Boolean);

  if (!images) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  const imageData = images[randomIndex];

  root.insertAdjacentHTML("beforeend", mainHeader(imageData));
};

export const setupSearchSection = () => {
  const { root, container, searchInput, clearButton, searchButton } = getSearchElements();

  if (!root || !container || !searchInput) {
    return;
  }

  const toggleSearchState = isEnabled => {
    root.classList.toggle("disabled", !isEnabled);
    container.classList.toggle("disabled", !isEnabled);
    isEnabled ? hideSearchSkeleton() : showSearchSkeleton();
  };

  const runSearch = () => {
    const query = searchInput.value || "";
    const hasText = query.trim().length > 0;

    if (hasText) {
      document.dispatchEvent(
        new CustomEvent("main-search:searchChanged", {
          detail: { query },
        }),
      );
    }

    clearButton?.classList.toggle("hidden", !hasText);
    searchButton?.classList.toggle("hidden", hasText);
  };

  searchInput.addEventListener("input", runSearch);
  clearButton?.addEventListener("click", event => {
    searchInput.value = "";
    clearButton?.classList.add("hidden");
    searchButton?.classList.remove("hidden");
    event.preventDefault();
    event.stopPropagation();
    searchInput.focus();
    runSearch();
  });

  searchButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    searchInput.focus();
    runSearch();
  });

  toggleSearchState(true);
};
