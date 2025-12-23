import { cardsElements } from "@components/cards/elements.js";
import { createCards } from "@components/cards/manager.js";
import { emptyCards } from "@components/cards/render.js";
import { cardsSkeletons } from "@components/skeletons/manager.js";

export const cardsUi = {
  render(recipes) {
    if (!recipes) return;

    const { container } = cardsElements();
    if (!container) return;

    cardsSkeletons().hide();
    container.innerHTML = recipes.length ? "" : emptyCards();
    if (recipes.length) {
      container.append(...createCards(recipes));
    }
  },
};
