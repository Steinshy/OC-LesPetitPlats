import {
  renderCardSkeletons,
  renderMainHeaderSkeleton,
  renderDropdownsSkeletons,
} from "./renderSqueletons.js";

export const squeletonsElements = {
  header: document.getElementById("header"),
  mainSearchBar: document.getElementById("main-search-bar"),
  headerTitle: document.getElementById("header-title"),
  dropdownsContainer: document.getElementById("dropdowns-container"),
  dropdownIngredients: document.getElementById("dropdown-ingredients-container"),
  dropdownUstensils: document.getElementById("dropdown-ustensils-container"),
  dropdownAppliances: document.getElementById("dropdown-appliances-container"),
  cardsContainer: document.getElementById("cards-container"),
  cards: document.querySelectorAll(".card.skeleton"),
};

export const showSearchSkeleton = () => {
  squeletonsElements.mainSearchBar?.classList.add("skeleton-loading");
};

export const hideSearchSkeleton = () => {
  squeletonsElements.mainSearchBar?.classList.remove("skeleton-loading");
};

export const showDropdownsSkeletons = () => {
  const skeletonElements = [
    squeletonsElements.dropdownIngredients,
    squeletonsElements.dropdownUstensils,
    squeletonsElements.dropdownAppliances,
  ];

  skeletonElements.forEach(element => {
    if (element) {
      element.classList.add("skeleton-loading");
    }
  });
};

export const hideDropdownsSkeletons = () => {
  const skeletonElements = [
    squeletonsElements.dropdownIngredients,
    squeletonsElements.dropdownUstensils,
    squeletonsElements.dropdownAppliances,
  ];

  skeletonElements.forEach(element => {
    if (element) {
      element.classList.remove("skeleton-loading");
    }
  });
};

export const buildCardSkeletons = length => {
  if (!length) return;

  squeletonsElements.cardsContainer.innerHTML = renderCardSkeletons(length);
};

export const hideCardSkeletons = () => {
  squeletonsElements.cards?.forEach(skeleton => {
    if (skeleton) {
      skeleton.classList.remove("skeleton");
    }
  });
};

export const initSkeletons = () => {
  squeletonsElements.header.insertAdjacentHTML("beforeend", renderMainHeaderSkeleton());
  showSearchSkeleton();
  squeletonsElements.dropdownsContainer.innerHTML = renderDropdownsSkeletons();
  showDropdownsSkeletons();

  // Render card skeletons
  buildCardSkeletons(12);
};
