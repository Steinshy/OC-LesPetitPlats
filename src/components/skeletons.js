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
  get cardSkeletons() {
    return document.querySelectorAll(".card.skeleton");
  },
};

export const showSearchSkeleton = () => {
  const searchBar = document.querySelector(".main-search-bar");
  searchBar?.classList.add("skeleton");
};

export const hideSearchSkeleton = () => {
  const searchBar = document.querySelector(".main-search-bar");
  searchBar?.classList.remove("skeleton");
};

export const showDropdownsSkeletons = () => {
  const skeletonElements = [
    squeletonsElements.dropdownIngredients,
    squeletonsElements.dropdownUstensils,
    squeletonsElements.dropdownAppliances,
  ];

  skeletonElements.forEach(element => {
    if (element) {
      element.classList.add("skeleton");
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
      element.classList.remove("skeleton");
    }
  });
};

export const buildCardSkeletons = (length, container) => {
  if (!length) return;

  const targetContainer = container || squeletonsElements.cardsContainer;
  if (!targetContainer) return;

  targetContainer.innerHTML = renderCardSkeletons(length);
};

export const hideCardSkeletons = () => {
  squeletonsElements.cardSkeletons.forEach(skeleton => {
    skeleton.classList.remove("skeleton");
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
