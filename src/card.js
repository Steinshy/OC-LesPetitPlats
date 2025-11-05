import { getSkeletonList } from "./components/skeletons.js";

const CARDS_PER_BATCH = 15;

const getContainer = () => document.querySelector(".cards-container");

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

const setupImageLoading = (fragment, { webpUrl, jpgUrl }) => {
  if (!jpgUrl && !webpUrl) return;

  const img = fragment.querySelector(".card-picture img");
  const placeholder = fragment.querySelector(".image-loading-placeholder");
  const webpSource = fragment.querySelector(".card-picture source[type='image/webp']");

  if (!img || !placeholder) return;

  const hidePlaceholder = () => placeholder.classList.add("hidden");

  if (webpSource && webpUrl) {
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
};

const buildCard = recipe => {
  const {
    image: { webpUrl = "", jpgUrl = "", alt = "" } = {},
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
  setupImageLoading(fragment, { webpUrl, jpgUrl });
  return fragment;
};

const buildGlobalRenderer = task => {
  if ("scheduler" in window && "postTask" in window.scheduler) {
    return window.scheduler.postTask(task, { priority: "user-blocking" });
  }
  if ("requestIdleCallback" in window) {
    return new Promise(resolve => {
      requestIdleCallback(() => {
        task();
        resolve();
      });
    });
  }
  return Promise.resolve().then(task);
};

export const renderRecipes = recipes => {
  const container = getContainer();
  if (!container) return;

  container.innerHTML = "";
  let currentIndex = 0;

  const rendererRecipes = () => {
    const recipeBatch = recipes.slice(currentIndex, currentIndex + CARDS_PER_BATCH);
    if (recipeBatch.length === 0) return;

    const fragment = document.createDocumentFragment();
    recipeBatch.forEach(recipe => fragment.appendChild(buildCard(recipe)));
    container.appendChild(fragment);

    currentIndex += CARDS_PER_BATCH;
    if (currentIndex < recipes.length) {
      buildGlobalRenderer(rendererRecipes);
    }
  };

  rendererRecipes();
};

export const renderSkeletons = count => {
  const container = getContainer();
  if (!container) return;

  const fragment = document.createDocumentFragment();
  getSkeletonList(count).forEach(skeletonCard => {
    const cardFragment = buildCard(skeletonCard);
    cardFragment.querySelector(".card")?.classList.add("skeleton");
    fragment.appendChild(cardFragment);
  });

  container.innerHTML = "";
  container.appendChild(fragment);
};
