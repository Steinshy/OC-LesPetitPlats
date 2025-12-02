// src/components/skeletons/manager.js
import { cardsElements } from "@components/cards/elements.js";
import { dropdownsElements } from "@components/dropdowns/elements.js";
import { headerElement } from "@components/header.js";
import { searchElements } from "@components/search/elements.js";
import { cardSkeleton, dropdownsSkeleton } from "@components/skeletons/renderer.js";

// ---------------
// search skeleton
// ---------------

export const searchSkeleton = () => ({
  show: () => {
    const { search, input, clear, submit } = searchElements();
    search.classList.add("skeleton");
    input?.classList.add("skeleton");
    clear?.classList.add("skeleton");
    submit?.classList.add("skeleton");
  },

  hide: () => {
    const { search, input, clear, submit } = searchElements();
    search.classList.remove("skeleton");
    input?.classList.remove("skeleton");
    clear?.classList.remove("skeleton");
    submit?.classList.remove("skeleton");
  },
});

// ---------------
// header skeleton
// ---------------

export const headerSkeleton = () => ({
  show: () => {
    const { header } = headerElement();
    if (header) {
      header.classList.add("skeleton");
    }
  },

  hide: () => {
    const { header } = headerElement();
    if (header) {
      header.classList.remove("skeleton");
    }
  },
});

// ---------------
// dropdowns skeleton
// ---------------

export const dropdownsSkeletons = () => ({
  show: () => {
    const { containers } = dropdownsElements(); // Root container
    if (!containers) return;
    containers.classList.add("skeleton");
    containers.innerHTML = dropdownsSkeleton();
  },

  hide: () => {
    const { containers } = dropdownsElements(); // Root container
    if (!containers) return;
    containers.classList.remove("skeleton");
  },
});

// ---------------
// card skeletons
// ---------------

export const cardsSkeletons = () => ({
  show: (count = 12) => {
    const { container } = cardsElements();
    if (!count || !container) return;

    container.classList.add("skeleton");
    container.innerHTML = cardSkeleton(count);
  },

  hide: () => {
    const { container } = cardsElements();
    if (!container) return;
    container.classList.remove("skeleton");
    // Remove only skeleton cards, keep actual content
    container.querySelectorAll(".card.skeleton:not([id])").forEach(skeleton => {
      skeleton.remove();
    });
  },
});

// ---------------
// init all skeletons
// ---------------

export const setupSkeletons = () => {
  headerSkeleton().show();
  searchSkeleton().show();
  dropdownsSkeletons().show();
  cardsSkeletons().show();
};
