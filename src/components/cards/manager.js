// src/components/cards/manager.js
import { cardsElements } from "@components/cards/elements.js";
import { renderCard, renderIngredient, emptyCards } from "@components/cards/render.js";
import { updateResultsCounter } from "@components/resultsCounter.js";
import { cardsSkeletons } from "@components/skeletons/manager.js";
import { eventBus } from "@utils/eventBus.js";

export const cardsManager = {
  render(recipes) {
    if (!recipes) return;

    const { container } = cardsElements();
    if (!container) return;

    cardsSkeletons().show(recipes.length || 0);

    if (recipes.length) {
      container.innerHTML = "";
      container.append(...createCards(recipes));
      setupRecipeToggle(container);
    } else {
      container.innerHTML = emptyCards();
    }

    cardsSkeletons().hide();
  },
};

export const setupRecipesCards = recipes => {
  cardsManager.render(recipes);
  updateResultsCounter(recipes?.length || 0);

  const onFiltersUpdated = ({ filtered }) => {
    cardsManager.render(filtered);
    updateResultsCounter(filtered.length || 0);
  };

  eventBus.on("filters:updated", onFiltersUpdated);

  return () => {
    eventBus.off("filters:updated", onFiltersUpdated);
  };
};

const setupRecipeToggle = container => {
  container.querySelectorAll(".recipe-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const recipe = button.closest(".card-recipe");
      const isExpanded = recipe.classList.toggle("expanded");
      const toggleText = button.querySelector(".toggle-text");

      button.setAttribute("aria-expanded", isExpanded);
      toggleText.textContent = isExpanded ? "Voir moins" : "Voir plus";
    });
  });
};

const createCards = recipes => {
  return recipes.map(recipe => {
    const { id, name, time, images, description, ingredients } = recipe;
    const { webpUrl, jpgUrl, alt } = images || {};
    const ingredientsCount = ingredients?.length || 0;
    const items = ingredients?.map(buildIngredient) ?? [];
    const ingredientsList = createIngredientsList(items);

    const template = document.createElement("template");
    template.innerHTML = renderCard(
      id,
      name,
      time,
      description,
      webpUrl,
      jpgUrl,
      alt,
      ingredientsCount,
      ingredientsList,
    );
    return template.content.firstElementChild;
  });
};

const createIngredientsList = items => {
  return items
    .map(item => {
      const { ingredient, quantityText } = item;
      return renderIngredient(ingredient, quantityText);
    })
    .join("");
};

const buildIngredient = ({ ingredient, quantity, unit }) => {
  const hasQuantity = quantity != null && quantity !== "";
  const hasUnit = unit != null && unit !== "";

  const quantityText =
    hasQuantity || hasUnit
      ? [hasQuantity ? quantity : null, hasUnit ? unit : null].filter(Boolean).join(" ")
      : "au goût";

  return {
    ingredient,
    quantity,
    unit,
    quantityText,
  };
};
