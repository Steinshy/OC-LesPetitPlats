// src/components/cards/manager.js
import { cardsElements } from "@components/cards/elements.js";
import { renderCard, renderIngredient, emptyCards } from "@components/cards/render.js";
import { cardsSkeletons } from "@components/skeletons/manager.js";

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

export const setupRecipesCards = recipesData => {
  if (!recipesData) return;

  const { container } = cardsElements();
  if (!container) return;

  cardsSkeletons().show(recipesData?.length || 0);

  if (!recipesData.length) {
    container.innerHTML = emptyCards();
  } else {
    container.innerHTML = "";
    container.append(...createCards(recipesData));
    setupRecipeToggle(container);
  }

  cardsSkeletons().hide();
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

const createCards = recipesData => {
  return recipesData.map(recipe => {
    const { id, name, time, images, description, ingredients } = recipe;
    const { webpUrl, jpgUrl, alt } = images || {};
    const ingredientsCount = ingredients?.length || 0;
    const items = (ingredients || []).map(buildIngredient);
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
