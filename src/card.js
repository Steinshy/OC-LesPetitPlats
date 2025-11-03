// Card component will have, card. card header, card chips, card recette, card ingredients.

import { updateSearchResultsCount } from "./search.js";

export const createCardHeader = (name, time) => {
  return `
    <div class="card-header">
      <h2>${name}</h2>
      <span class="card-time">${time}min</span>
    </div>
  `;
};

export const createPicture = (image) => {
  const webp = image?.webpUrl || image?.webp || "";
  const jpg = image?.jpgUrl || image?.jpg || image?.imageJpg || "";
  const alt = image?.alt || "Recette";
  if (!jpg) return "";
  const hasWebp = webp && webp.trim() !== "";
  return `
    <div class="card-picture">
      <picture>
        ${hasWebp ? `<source srcset="/recipes/${webp}" type="image/webp" />` : ""}
        <source srcset="/recipes/${jpg}" type="image/jpeg" />
        <img src="/recipes/${jpg}" alt="${alt}" />
      </picture>
    </div>
  `;
};

export const validateAndFormatIngredient = (ingredient) => {
  if (!ingredient?.name) return null;
  const hasQuantity = ingredient.quantity && ingredient.quantity !== 0;
  const hasUnit = ingredient.unitType && ingredient.unitType.trim() !== "";
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

export const createCardContents = (description, ingredients) => {
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

export const createCard = (recipe) => {
  return `
    <div class="card">
      ${createPicture(recipe.image)}
      ${createCardHeader(recipe.name, recipe.time)}
      ${createCardContents(recipe.description, recipe.ingredients)}
    </div>
  `;
};

export const renderRecipes = (recipes) => {
  const container = document.querySelector(".cards-container");
  if (!container) return;

  const cardsHTML = recipes?.length > 0 ? recipes.map(createCard).join("") : "";

  container.innerHTML = cardsHTML;
  updateSearchResultsCount(recipes?.length);
};
