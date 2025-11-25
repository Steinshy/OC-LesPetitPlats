import { cardSkeletons } from "../skeletonsManager.js";
import {
  renderNoResults,
  renderCardPicture,
  renderCardHeader,
  renderCardContents,
} from "./render.js";
import { imagesTypes } from "@/utils/deliveryImages.js";

const getCardsElements = () => {
  return {
    container: document.getElementById("recipes"),
    noResults: document.getElementById("no-results"),
  };
};

const updateCardContainer = (container, items, createElement) => {
  if (!container || !Array.isArray(items)) return [];

  // Remove skeleton cards that don't have IDs
  container.querySelectorAll(".card.skeleton:not([id])").forEach(skeleton => {
    skeleton.remove();
  });

  const existing = new Map();
  container.querySelectorAll("[id]").forEach(element => {
    if (element.id) existing.set(element.id, element);
  });

  const needed = new Set(items.map(item => String(item.id)));
  existing.forEach((element, id) => {
    if (!needed.has(id)) {
      element.remove();
      existing.delete(id);
    }
  });

  const newCards = [];
  items.forEach((item, index) => {
    const id = String(item.id);
    let card = existing.get(id);
    if (!card) {
      card = createElement(item);
      newCards.push(card);
      existing.set(id, card);
    }

    const currentIndex = [...container.children].indexOf(card);
    if (currentIndex === -1) {
      container.appendChild(card);
    } else if (currentIndex !== index) {
      const referenceNode = container.children[index] || null;
      if (referenceNode !== card) {
        container.insertBefore(card, referenceNode);
      }
    }
  });

  return newCards;
};

export const setupRecipesCards = recipesData => {
  const { container, noResults } = getCardsElements();
  if (!container) return;

  if (!recipesData || !Array.isArray(recipesData) || recipesData.length === 0) {
    cardSkeletons().hide();
    if (noResults) {
      noResults.innerHTML = renderNoResults();
      noResults.classList.remove("hidden");
    } else {
      container.innerHTML = `
        <div class="no-results" id="no-results" aria-label="Aucune recette trouvée">
          ${renderNoResults()}
        </div>
      `;
    }
    return;
  }

  cardSkeletons().build(recipesData.length);
  if (noResults) {
    noResults.classList.add("hidden");
  }

  const newCards = updateCardContainer(container, recipesData, recipe => {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="card" id="${recipe.id}">
        ${renderCardPicture(recipe.images, recipe.time)}
        ${renderCardHeader(recipe.name)}
        ${renderCardContents(recipe.description, recipe.ingredients)}
      </div>`;
    return template.content.firstElementChild;
  });

  cardSkeletons().hide();

  newCards.forEach(card => {
    const recipe = recipesData.find(r => String(r.id) === card.id);
    if (recipe?.images) {
      imagesTypes(card, recipe.images);
    }
  });
};
