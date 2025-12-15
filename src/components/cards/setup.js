import { cardsUi } from "@components/cards/ui.js";
import { updateResultsCounter } from "@components/resultsCounter.js";
import { eventBus } from "@utils/eventBus.js";

export const setupCards = recipes => {
  if (!recipes) return () => {};

  cardsUi.render(recipes);
  updateResultsCounter(recipes?.length || 0);

  const onFiltersUpdated = ({ filtered }) => {
    cardsUi.render(filtered);
    updateResultsCounter(filtered?.length || 0);
  };

  eventBus.on("filters:updated", onFiltersUpdated);

  return () => {
    eventBus.off("filters:updated", onFiltersUpdated);
  };
};
