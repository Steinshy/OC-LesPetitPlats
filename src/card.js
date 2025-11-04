// Card component will have, card. card header, card chips, card recette, card ingredients.

import { getSkeletonList } from "./components/skeletons.js";

export const validateAndFormatIngredient = ingredient => {
  if (!ingredient?.name) return null;
  const hasQuantity = ingredient.quantity && ingredient.quantity !== 0;
  const hasUnit = ingredient.unitType && typeof ingredient.unitType === "string" && ingredient.unitType.trim() !== "";
  if (!hasQuantity && !hasUnit) return null;

  const qty = ingredient.quantity ? `${ingredient.quantity}` : "";
  const unit = ingredient.unitType ? ` ${ingredient.unitType}` : "";
  const quantity = `${qty}${unit}`.trim() || "";
  return `
    <div class="ingredient-items">
      <p class="ingredient-name">${ingredient.name}</p>
      <p class="ingredient-quantity">${quantity}</p>
    </div>
  `;
};

export const buildCardContents = (description, ingredients) => {
  let recipeSection = "";
  if (description) {
    recipeSection = `
      <div class="contents-recipe">
        <h3>RECETTE</h3>
        <p>${description}</p>
      </div>
    `;
  }

  let ingredientsSection = "";
  const ingredientsHTML = ingredients.map(validateAndFormatIngredient).filter(Boolean).join("");
  if (ingredientsHTML) {
    ingredientsSection = `
      <div class="contents-ingredients">
        <h3>INGRÉDIENTS</h3>
        <div class="ingredients-details">${ingredientsHTML}</div>
      </div>
    `;
  }

  return `
    <div class="contents-container">
      ${recipeSection}
      ${ingredientsSection}
    </div>
  `;
};

const buildCard = recipe => {
  const {
    image = { webpUrl: "", jpgUrl: "", alt: "" },
    name = "",
    time = 0,
    description = "",
    ingredients = [],
  } = recipe;

  const { webpUrl = "", jpgUrl = "", alt = "" } = image;

  const pictureHTML = `
    <div class="image-loading-placeholder"></div>
    <picture>
      ${webpUrl ? `<source srcset="${webpUrl}" type="image/webp" />` : ""}
      <img src="${jpgUrl}" alt="${alt || name}" loading="lazy" width="380" height="250" decoding="async" fetchpriority="high" />
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

  const range = document.createRange();
  const fragment = range.createContextualFragment(cardHTML);

  if (jpgUrl || webpUrl) {
    const img = fragment.querySelector(".card-picture img");
    const placeholder = fragment.querySelector(".image-loading-placeholder");
    const webpSource = fragment.querySelector(".card-picture source[type='image/webp']");
    if (!img || !placeholder) return fragment;

    const hidePlaceholder = () => placeholder.classList.add("hidden");
    if (webpSource) {
      const testImg = new Image();
      testImg.onerror = () => webpSource.remove();
      testImg.src = webpUrl;
    }
    if (img.complete) {
      hidePlaceholder();
    } else {
      img.addEventListener("load", hidePlaceholder, { once: true });
      img.addEventListener("error", hidePlaceholder, { once: true });
    }
  }

  return fragment;
};

const buildGlobalRenderer = (task) => {
  if ("scheduler" in window && "postTask" in window.scheduler) {
    return window.scheduler.postTask(task, { priority: "user-blocking" });
  }
  if ("requestIdleCallback" in window) {
    return new Promise((resolve) => {
      requestIdleCallback(
        () => {
          task();
          resolve();
        },
        { timeout: 100 }
      );
    });
  }
  return Promise.resolve().then(() => task());
};

export const renderRecipes = (recipes) => {
  const container = document.querySelector(".cards-container");
  if (!container) return;

  container.innerHTML = "";

  const CARDS_PER_BATCH = 15;
  let currentIndex = 0;

  const rendererRecipes = () => {
    const rendererRecipe = recipes.slice(currentIndex, currentIndex + CARDS_PER_BATCH);
    if (rendererRecipe.length === 0) return;

    const fragment = document.createDocumentFragment();
    rendererRecipe.forEach((recipe) => {
      const cardFragment = buildCard(recipe);
      fragment.appendChild(cardFragment);
    });
    container.appendChild(fragment);

    currentIndex += CARDS_PER_BATCH;
    if (currentIndex < recipes.length) {
      buildGlobalRenderer(rendererRecipes);
    }
  };

  rendererRecipes();
};

export const renderSkeletons = count => {
  const container = document.querySelector(".cards-container");
  if (!container) return;

  const fragment = document.createDocumentFragment();
  const skeletonCards = getSkeletonList(count);

  skeletonCards.forEach(skeletonCard => {
    const cardFragment = buildCard(skeletonCard);
    const cardElement = cardFragment.querySelector(".card");
    cardElement.classList.add("skeleton");
    fragment.appendChild(cardFragment);
  });

  container.innerHTML = "";
  container.appendChild(fragment);
};
