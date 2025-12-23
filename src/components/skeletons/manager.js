// src/components/skeletons/manager.js
import { cardsElements } from "@components/cards/elements.js";
import { dropdownsElements } from "@components/dropdowns/elements.js";
import { searchElements } from "@components/search/elements.js";
import { cardSkeleton, dropdownSkeleton } from "@components/skeletons/renderer.js";

// Search skeleton
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
    const elements = [search, input, clear, submit].filter(Boolean);
    elements.forEach(element => {
      element.classList.remove("skeleton");
    });
    if (elements.length > 0) {
      elements[0].offsetHeight;
    }
  },
});

// Hero skeleton

export const heroSkeleton = () => ({
  show: () => {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.classList.add("skeleton");
    }
  },

  hide: () => {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.classList.remove("skeleton");
      hero.offsetHeight;
    }
  },
});

// Dropdowns skeleton
export const dropdownsSkeleton = () => ({
  show: () => {
    const { containers } = dropdownsElements();
    if (!containers) return;

    containers.innerHTML = Array.from({ length: 3 }, () => dropdownSkeleton()).join("");
  },

  hide: () => {
    const { containers } = dropdownsElements();
    if (!containers) return;
    containers.innerHTML = "";
  },
});

// Cards skeleton
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
    const skeletonCards = container.querySelectorAll(".card.skeleton:not([id])");
    skeletonCards.forEach(skeleton => {
      skeleton.remove();
    });
    if (container.offsetHeight !== undefined) {
      container.offsetHeight;
    }
  },
});
