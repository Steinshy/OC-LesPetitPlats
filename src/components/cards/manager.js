// src/components/cards/manager.js
import { renderCard, renderIngredient } from "@components/cards/render.js";

export const expendDescription = cardElement => {
  const button = cardElement.querySelector(".description-button");
  if (!button) return;

  const seeMore = button.querySelector(".card-see-more");
  if (!seeMore) return;

  button.addEventListener("click", () => {
    const recipeElement = button.closest(".card-recipe");
    if (!recipeElement) return;

    const isExpanded = recipeElement.classList.toggle("expanded");
    seeMore.textContent = isExpanded ? "Voir moins" : "Voir plus";
    button.setAttribute("aria-expanded", isExpanded);
  });
};

export const createCards = recipes => {
  return recipes.map(recipe => {
    const { id, name, time, images, description, ingredients } = recipe;
    const { webpUrl, jpgUrl, alt } = images || {};
    const ingredientsCount = ingredients?.length || 0;
    const ingredientsList = createIngredientsList(ingredients ?? []);
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
    const cardElement = template.content.firstElementChild;
    expendDescription(cardElement);
    return cardElement;
  });
};

export const createIngredientsList = ingredients => {
  return ingredients
    .map(({ ingredient, quantity, unit }) => {
      const parts = [quantity, unit].filter(
        value => value !== null && value !== undefined && value !== "",
      );
      const quantityText = parts.length > 0 ? parts.join(" ") : "au goût";
      return renderIngredient(ingredient, quantityText);
    })
    .join("");
};
