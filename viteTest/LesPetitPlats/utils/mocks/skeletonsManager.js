// Test wrapper for skeletonsManager - adds wrapper functions with dynamic element lookup
import {
  ingredientsDropdown,
  ustensilsDropdown,
  appliancesDropdown,
} from "@/components/dropdown/render.js";
import { cardSkeleton } from "@/components/renderSqueletons.js";

// Create a dynamic squeletonsElements object that re-evaluates elements on access
const getSqueletonsElements = () => ({
  header: document.getElementById("header"),
  searchBar: document.getElementById("search-bar"),
  cardsContainer: document.getElementById("recipes"),
  get cardSkeletons() {
    return document.querySelectorAll(".card");
  },
  get dropdownsElements() {
    return document.querySelectorAll(".dropdown-container");
  },
});

export const searchSkeleton = () => ({
  show: () => {
    const searchBar = getSqueletonsElements().searchBar;
    if (searchBar) {
      searchBar.classList.add("skeleton");
      const inputs = searchBar.querySelectorAll("input, button");
      inputs.forEach(element => {
        element.setAttribute("disabled", "");
      });
    }
  },
  hide: () => {
    const searchBar = getSqueletonsElements().searchBar;
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
    const header = getSqueletonsElements().header;
    if (header) {
      header.classList.add("skeleton");
    }
  },
  hide: () => {
    const header = getSqueletonsElements().header;
    if (header) {
      header.classList.remove("skeleton");
    }
  },
});

export const dropdownsContainerSkeleton = () => ({
  show: () => {
    const dropdownsContainer = document.getElementById("dropdowns-container");
    if (!dropdownsContainer) return;
    dropdownsContainer.innerHTML =
      ingredientsDropdown([]) + ustensilsDropdown([]) + appliancesDropdown([]);

    getSqueletonsElements().dropdownsElements.forEach(container => {
      container.classList.add("skeleton");
      container.querySelector("button")?.setAttribute("disabled", "");
    });
  },
  hide: () => {
    getSqueletonsElements().dropdownsElements.forEach(container =>
      container.classList.remove("skeleton"),
    );
  },
});

export const cardSkeletons = () => ({
  build: count => {
    if (!count) return;
    const container = getSqueletonsElements().cardsContainer;
    if (container) {
      container.innerHTML = cardSkeleton(count);
    }
  },
  hide: () => {
    getSqueletonsElements().cardSkeletons.forEach(skeleton => {
      skeleton.classList.remove("skeleton");
    });
  },
});

export const squeletonsElements = getSqueletonsElements();

// Export wrapper functions for test compatibility
export const showSearchSkeleton = () => {
  searchSkeleton().show();
};

export const hideSearchSkeleton = () => {
  searchSkeleton().hide();
};

export const showDropdownsSkeletons = () => {
  dropdownsContainerSkeleton().show();
};

export const hideDropdownsSkeletons = () => {
  dropdownsContainerSkeleton().hide();
};

export const buildCardSkeletons = (count, container = null) => {
  if (container) {
    // If container is provided, use it directly
    if (count) {
      container.innerHTML = cardSkeleton(count);
    }
  } else {
    cardSkeletons().build(count);
  }
};

export const hideCardSkeletons = () => {
  cardSkeletons().hide();
};
