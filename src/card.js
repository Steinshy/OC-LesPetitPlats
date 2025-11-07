import { getSkeletonList } from "./components/skeletons.js";
import { imagesTypes } from "./utils/deliveryImages.js";

const getContainer = () => document.querySelector(".cards-container");

const createEmptyState = () => {
  const emptyState = document.createElement("div");
  emptyState.id = "empty-state";
  emptyState.className = "empty-state";
  emptyState.innerHTML = `
    <div class="empty-state-icon">
      <i class="fa-solid fa-utensils" aria-hidden="true"></i>
    </div>
    <h2 class="empty-state-title">Aucune recette trouvée</h2>
    <p class="empty-state-message">
      Essayez de modifier vos critères de recherche ou vos filtres pour trouver des recettes.
    </p>
  `;
  return emptyState;
};

const validateAndFormatIngredient = ingredient => {
  if (!ingredient?.name) return null;
  const hasQuantity = ingredient.quantity && ingredient.quantity !== 0;
  const hasUnit = ingredient.unitType?.trim();
  if (!hasQuantity && !hasUnit) return null;

  const quantity = [ingredient.quantity, ingredient.unitType].filter(Boolean).join(" ").trim();
  return `
    <div class="ingredient-items">
      <p class="ingredient-name">${ingredient.name}</p>
      <p class="ingredient-quantity">${quantity}</p>
    </div>
  `;
};

const buildSection = (title, content, className) => {
  if (!content) return "";
  return `
    <div class="${className}">
      <h3>${title}</h3>
      ${content}
    </div>
  `;
};

export const buildCardContents = (description, ingredients) => {
  const ingredientsHTML = ingredients.map(validateAndFormatIngredient).filter(Boolean).join("");
  const recipeSection = description ? `<p>${description}</p>` : "";
  const ingredientsSection = ingredientsHTML
    ? `<div class="ingredients-details">${ingredientsHTML}</div>`
    : "";

  return `
    <div class="contents-container">
      ${buildSection("RECETTE", recipeSection, "contents-recipe")}
      ${buildSection("INGRÉDIENTS", ingredientsSection, "contents-ingredients")}
    </div>
  `;
};

const buildCard = recipe => {
  const {
    images: { webpUrl = "", jpgUrl = "", alt = "" } = {},
    name = "",
    time = 0,
    description = "",
    ingredients = [],
  } = recipe;

  const pictureHTML = `
    <div class="image-loading-placeholder"></div>
    <picture>
      ${webpUrl ? `<source srcset="${webpUrl}" type="image/webp" />` : ""}
      <img src="${jpgUrl}" alt="${alt || name}" loading="lazy" width="380" height="250" decoding="async" fetchpriority="low" />
    </picture>
  `;

  const cardHTML = `
    <div class="card">
      <div class="card-picture">${pictureHTML}</div>
      <div class="card-header">
        <h2>${name}</h2>
        <span class="card-time">${time}min</span>
      </div>
      ${buildCardContents(description, ingredients)}
    </div>
  `;

  const fragment = document.createRange().createContextualFragment(cardHTML);
  if (jpgUrl || webpUrl) {
    imagesTypes(fragment, { webpUrl, jpgUrl });
  }
  return fragment;
};

export const renderRecipes = recipes => {
  const container = getContainer();
  if (!container) return;

  let emptyState = container.querySelector("#empty-state");
  
  if (recipes.length === 0) {
    // Remove all cards but keep empty state
    const cards = container.querySelectorAll(".card");
    cards.forEach(card => card.remove());
    
    if (!emptyState) {
      emptyState = createEmptyState();
      container.appendChild(emptyState);
    } else {
      emptyState.classList.remove("hidden");
    }
    return;
  }
  
  // Hide empty state if it exists
  if (emptyState) {
    emptyState.classList.add("hidden");
  }
  
  // Remove all cards
  const cards = container.querySelectorAll(".card");
  cards.forEach(card => card.remove());
  
  // Render new cards
  const fragment = document.createDocumentFragment();
  recipes.forEach(recipe => fragment.appendChild(buildCard(recipe)));
  container.appendChild(fragment);
};

export const renderCardsSkeletons = count => {
  const container = getContainer();
  if (!container) return;

  const emptyState = container.querySelector("#empty-state");
  if (emptyState) {
    emptyState.classList.add("hidden");
  }

  // Remove all cards
  const cards = container.querySelectorAll(".card");
  cards.forEach(card => card.remove());

  const fragment = document.createDocumentFragment();
  getSkeletonList(count).forEach(skeletonCard => {
    const cardFragment = buildCard(skeletonCard);
    cardFragment.querySelector(".card")?.classList.add("skeleton");
    fragment.appendChild(cardFragment);
  });

  container.appendChild(fragment);
};
