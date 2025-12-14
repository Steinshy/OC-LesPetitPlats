import { cardsElements } from "@components/cards/elements.js";
import { createCards } from "@components/cards/manager.js";
import { emptyCards } from "@components/cards/render.js";
import { cardsSkeletons } from "@components/skeletons/manager.js";

export const cardsUi = {
  render(recipes) {
    if (!recipes) return;

    const { container } = cardsElements();
    if (!container) return;

    cardsSkeletons().show(recipes?.length || 0);

    container.innerHTML = recipes.length ? "" : emptyCards();
    if (recipes.length) {
      container.append(...createCards(recipes));
    }

    cardsSkeletons().hide();
  },
};
