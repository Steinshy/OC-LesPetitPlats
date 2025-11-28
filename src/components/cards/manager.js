// src/components/cards/manager.js

import {
  renderNoResults,
  renderCardPicture,
  renderCardHeader,
  renderCardContents,
} from "@components/cards/render.js";
import { cardSkeletons } from "@components/skeletonsManager.js";
import { imagesTypes } from "@utils/deliveryImages.js";

// ---------------
// dom elements
// ---------------

const getCardsElements = () => {
  return {
    container: document.getElementById("recipes"),
    noResults: document.getElementById("no-results"),
  };
};

// ---------------
// recipe toggle
// ---------------

// Expand/collapse recipe description
const setupRecipeToggle = container => {
  if (!container || container.dataset.toggleInitialized) return;

  container.addEventListener("click", event => {
    const toggleButton = event.target.closest(".card-recipe-toggle");
    if (!toggleButton) return;

    const recipeSection = toggleButton.closest(".card-recipe");
    if (!recipeSection) return;

    const isExpanded = recipeSection.classList.toggle("expanded");
    toggleButton.setAttribute("aria-expanded", isExpanded);

    const toggleText = toggleButton.querySelector(".toggle-text");
    if (toggleText) {
      toggleText.textContent = isExpanded ? "Voir moins" : "Voir plus";
    }
  });

  container.dataset.toggleInitialized = "true";
};

// ---------------
// dom diffing
// ---------------

// Efficiently update cards (add/remove/reorder)
const updateCardContainer = (container, items, createElement) => {
  if (!container || !Array.isArray(items)) return [];

  // Remove orphan skeletons
  container.querySelectorAll(".card.skeleton:not([id])").forEach(skeleton => {
    skeleton.remove();
  });

  // Build map of existing cards
  const existing = new Map();
  container.querySelectorAll("[id]").forEach(element => {
    if (element.id) existing.set(element.id, element);
  });

  // Remove cards not in new data
  const needed = new Set(items.map(item => String(item.id)));
  existing.forEach((element, id) => {
    if (!needed.has(id)) {
      element.remove();
      existing.delete(id);
    }
  });

  // Create new cards or reorder existing
  const newCards = [];
  items.forEach((item, index) => {
    const id = String(item.id);
    let card = existing.get(id);
    if (!card) {
      card = createElement(item, index);
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

// ---------------
// setup cards
// ---------------

export const setupRecipesCards = recipesData => {
  const { container, noResults } = getCardsElements();
  if (!container) return;

  setupRecipeToggle(container);

  // Handle empty state
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

  const newCards = updateCardContainer(container, recipesData, (recipe, index) => {
    const template = document.createElement("template");
    template.innerHTML = `
      <article class="card" id="${recipe.id}">
        ${renderCardPicture(recipe.images, recipe.time, index)}
        ${renderCardHeader(recipe.name, recipe.servings)}
        ${renderCardContents(recipe.description, recipe.ingredients)}
      </article>`;
    return template.content.firstElementChild;
  });

  cardSkeletons().hide();

  // Setup image loading for new cards
  newCards.forEach(card => {
    const recipe = recipesData.find(r => String(r.id) === card.id);
    if (recipe?.images) {
      imagesTypes(card, recipe.images);
    }
  });
};
