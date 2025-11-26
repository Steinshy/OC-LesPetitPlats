import { ingredientsDropdown, ustensilsDropdown, appliancesDropdown } from "./dropdown/render.js";
import { cardSkeleton } from "./renderSqueletons.js";

export const squeletonsElements = {
  header: document.getElementById("header"),
  searchBar: document.getElementById("search-bar"),
  cardsContainer: document.getElementById("recipes"),
  get cardSkeletons() {
    return document.querySelectorAll(".card");
  },
  get dropdownsElements() {
    return document.querySelectorAll(".dropdown-container");
  },
};

export const searchSkeleton = () => ({
  show: () => {
    const searchBar = squeletonsElements.searchBar;
    if (searchBar) {
      searchBar.classList.add("skeleton");
      const inputs = searchBar.querySelectorAll("input, button");
      inputs.forEach(element => {
        element.setAttribute("disabled", "");
      });
    }
  },
  hide: () => {
    const searchBar = squeletonsElements.searchBar;
    if (searchBar) {
      searchBar.classList.remove("skeleton");
      const inputs = searchBar.querySelectorAll("input, button");
      inputs.forEach(element => {
        element.removeAttribute("disabled");
      });
    }
  },
});

export const headerSkeleton = () => ({
  show: () => {
    if (squeletonsElements.header) {
      squeletonsElements.header.classList.add("skeleton");
    }
  },
  hide: () => {
    if (squeletonsElements.header) {
      squeletonsElements.header.classList.remove("skeleton");
    }
  },
});

export const dropdownsContainerSkeleton = () => ({
  show: () => {
    const dropdownsContainer = document.getElementById("dropdowns-container");
    if (!dropdownsContainer) return;
    dropdownsContainer.innerHTML =
      ingredientsDropdown([]) + ustensilsDropdown([]) + appliancesDropdown([]);

    squeletonsElements.dropdownsElements.forEach(container => {
      container.classList.add("skeleton");
      container.querySelector("button")?.setAttribute("disabled", "");
    });
  },
  hide: () => {
    squeletonsElements.dropdownsElements.forEach(container =>
      container.classList.remove("skeleton"),
    );
  },
});

export const cardSkeletons = () => ({
  build: count => {
    if (!count) return;
    squeletonsElements.cardsContainer.innerHTML = cardSkeleton(count);
  },
  hide: () => {
    squeletonsElements.cardSkeletons.forEach(skeleton => {
      skeleton.classList.remove("skeleton");
    });
  },
});

export const initSkeletons = () => {
  headerSkeleton().show();
  searchSkeleton().show();
  dropdownsContainerSkeleton().show();
  cardSkeletons().build(12);
};
