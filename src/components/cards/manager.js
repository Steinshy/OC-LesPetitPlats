// src/components/cards/manager.js
import { cardsElements } from "@components/cards/elements.js";
import {
  renderNoResults,
  renderCardPicture,
  renderCardHeader,
  renderCardContents,
} from "@components/cards/render.js";
import { cardsSkeletons } from "@components/skeletons/manager.js";
import { setupImageTracking } from "@utils/imageTracker.js";

const setupRecipeToggle = container => {
  if (!container || container.dataset.toggleInitialized) return;

  container.addEventListener("click", event => {
    const toggleButton = event.target.closest(".card-recipe-toggle");
    const recipeSection = toggleButton?.closest(".card-recipe");
    if (!recipeSection) return;

    const isExpanded = recipeSection.classList.toggle("expanded");
    toggleButton.setAttribute("aria-expanded", isExpanded);
    const toggleText = toggleButton.querySelector(".toggle-text");
    if (toggleText) toggleText.textContent = isExpanded ? "Voir moins" : "Voir plus";
  });

  container.dataset.toggleInitialized = "true";
};

const createCard = (recipe, index) => {
  const template = document.createElement("template");
  template.innerHTML = `
    <article class="card" id="${recipe.id}">
      ${renderCardPicture(recipe.images, recipe.time, index)}
      ${renderCardHeader(recipe.name, recipe.servings)}
      ${renderCardContents(recipe.description, recipe.ingredients)}
    </article>`;
  return template.content.firstElementChild;
};

const updateCardContainer = (container, items, createElement) => {
  if (!container || !Array.isArray(items)) return [];

  const existing = new Map();
  const children = [...container.children];

  children.forEach(element => {
    if (element.id) {
      existing.set(element.id, element);
    } else if (element.classList.contains("card") && element.classList.contains("skeleton")) {
      element.remove();
    }
  });

  const needed = new Set(items.map(item => String(item.id)));
  existing.forEach((element, id) => {
    if (!needed.has(id)) element.remove();
  });

  const newCards = [];
  const fragment = document.createDocumentFragment();
  const currentChildren = [...container.children];
  const currentOrder = new Map(currentChildren.map((element, index) => [element.id, index]));

  items.forEach((item, index) => {
    const id = String(item.id);
    let card = existing.get(id);

    if (!card) {
      card = createElement(item, index);
      newCards.push(card);
      fragment.appendChild(card);
    } else {
      const currentIndex = currentOrder.get(id);
      if (currentIndex !== undefined && currentIndex !== index) {
        const referenceNode = currentChildren[index];
        if (referenceNode && referenceNode !== card) {
          container.insertBefore(card, referenceNode);
        } else if (!referenceNode) {
          container.appendChild(card);
        }
      }
    }
  });

  if (fragment.hasChildNodes()) container.appendChild(fragment);
  return newCards;
};

export const setupRecipesCards = recipesData => {
  const { container, emptyState, noResults } = cardsElements();
  if (!container) return;

  setupRecipeToggle(container);

  const isEmpty = !recipesData?.length;
  cardsSkeletons()[isEmpty ? "hide" : "show"](recipesData?.length || 0);

  if (isEmpty) {
    const noResultsHTML = `<div class="no-results" id="no-results" aria-label="Aucune recette trouvée">${renderNoResults()}</div>`;
    noResults
      ? ((noResults.innerHTML = renderNoResults()), noResults.classList.remove("hidden"))
      : (container.innerHTML = noResultsHTML);
    emptyState?.classList.add("hidden");
    return;
  }

  noResults?.classList.add("hidden");
  emptyState?.classList.add("hidden");

  requestAnimationFrame(() => {
    const newCards = updateCardContainer(container, recipesData, createCard);
    cardsSkeletons().hide();

    if (newCards.length > 0) {
      const recipeMap = new Map(recipesData.map(r => [String(r.id), r]));
      requestIdleCallback(
        () => {
          newCards.forEach(card => {
            const recipe = recipeMap.get(card.id);
            if (recipe?.images) setupImageTracking(card, recipe.images);
          });
        },
        { timeout: 1000 },
      );
    }
  });
};
