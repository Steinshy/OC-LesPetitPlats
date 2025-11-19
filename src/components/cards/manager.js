import { buildCardSkeletons, hideCardSkeletons } from "../skeletons.js";
import {
  renderNoResults,
  renderCardPicture,
  renderCardHeader,
  renderCardContents,
} from "./render.js";
import { imagesTypes } from "@/utils/deliveryImages.js";

const getCardsElements = () => {
  return {
    container: document.getElementById("cards-container"),
    noResults: document.getElementById("no-results"),
  };
};

export const setupRecipesCards = recipesData => {
  const { container, noResults } = getCardsElements();
  if (!container) return;

  if (!recipesData || !Array.isArray(recipesData) || recipesData.length === 0) {
    hideCardSkeletons();
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

  buildCardSkeletons(recipesData.length, container);
  if (noResults) {
    noResults.classList.add("hidden");
  }

  const fragment = document.createDocumentFragment();
  const loadImages = [];
  recipesData.forEach(recipe => {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="card" id="${recipe.id}">
        ${renderCardPicture(recipe.images)}
        ${renderCardHeader(recipe.name, recipe.time)}
        ${renderCardContents(recipe.description, recipe.ingredients)}
      </div>`;
    // Build the element, append to fragment, defer image init until in DOM
    const cardElement = template.content.firstElementChild;
    fragment.appendChild(cardElement);
    loadImages.push({ element: cardElement, images: recipe.images });
  });

  container.innerHTML = "";
  hideCardSkeletons();
  container.appendChild(fragment);

  // Initialize images after elements are connected to the DOM
  for (const { element, images } of loadImages) {
    imagesTypes(element, images);
  }
};
