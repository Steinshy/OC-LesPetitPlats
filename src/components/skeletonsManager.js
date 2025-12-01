// src/components/skeletonsManager.js

import {
  ingredientsDropdown,
  utensilsDropdown,
  appliancesDropdown,
} from "@components/dropdown/render.js";
import { cardSkeleton } from "@components/skeletonsRenderer.js";

// ---------------
// dom elements
// ---------------

export const skeletonsElements = {
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

// ---------------
// search skeleton
// ---------------

export const searchSkeleton = () => ({
  show: () => {
    const searchBar = skeletonsElements.searchBar;
    if (searchBar) {
      searchBar.classList.add("skeleton");
      const inputs = searchBar.querySelectorAll("input, button");
      inputs.forEach(element => {
        element.setAttribute("disabled", "");
      });
    }
  },

  hide: () => {
    const searchBar = skeletonsElements.searchBar;
    if (searchBar) {
      searchBar.classList.remove("skeleton");
      const inputs = searchBar.querySelectorAll("input, button");
      inputs.forEach(element => {
        element.removeAttribute("disabled");
      });
    }
  },
});

// ---------------
// header skeleton
// ---------------

export const headerSkeleton = () => ({
  show: () => {
    if (skeletonsElements.header) {
      skeletonsElements.header.classList.add("skeleton");
    }
  },

  hide: () => {
    if (skeletonsElements.header) {
      skeletonsElements.header.classList.remove("skeleton");
    }
  },
});

// ---------------
// dropdowns skeleton
// ---------------

export const dropdownsContainerSkeleton = () => ({
  show: () => {
    const dropdownsContainer = document.getElementById("dropdowns-container");
    if (!dropdownsContainer) return;
    dropdownsContainer.innerHTML =
      ingredientsDropdown([]) + utensilsDropdown([]) + appliancesDropdown([]);

    skeletonsElements.dropdownsElements.forEach(container => {
      container.classList.add("skeleton");
      container.querySelector("button")?.setAttribute("disabled", "");
    });
  },

  hide: () => {
    skeletonsElements.dropdownsElements.forEach(container =>
      container.classList.remove("skeleton"),
    );
  },
});

// ---------------
// card skeletons
// ---------------

export const cardSkeletons = () => ({
  build: count => {
    if (!count) return;
    skeletonsElements.cardsContainer.innerHTML = cardSkeleton(count);
  },

  hide: () => {
    skeletonsElements.cardSkeletons.forEach(skeleton => {
      skeleton.classList.remove("skeleton");
    });
  },
});

// ---------------
// init all skeletons
// ---------------

export const setupSkeletons = () => {
  headerSkeleton().show();
  searchSkeleton().show();
  dropdownsContainerSkeleton().show();
  cardSkeletons().build(12);
};
