import { cardsUi } from "@components/cards/ui.js";
import { resultsCounter } from "@components/resultsCounter.js";
import { eventBus } from "@utils/eventBus.js";

export const setupCards = recipes => {
  if (!recipes) return () => {};

  cardsUi.render(recipes);
  resultsCounter.update(recipes?.length || 0);

  const onFiltersUpdated = ({ filtered }) => {
    cardsUi.render(filtered);
    resultsCounter.update(filtered?.length || 0);
  };

  eventBus.on("filters:updated", onFiltersUpdated);

  return () => {
    eventBus.off("filters:updated", onFiltersUpdated);
  };
};
