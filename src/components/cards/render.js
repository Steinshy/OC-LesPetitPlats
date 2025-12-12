// src/components/cards/render.js

// ---------------
// no results
// ---------------

export const emptyCards = () => {
  return `
    <div class="empty-cards" id="empty-cards">
      <div class="empty-cards-icon">
        <i class="ri-error-warning-line" aria-hidden="true"></i>
      </div>
      <h2 class="empty-cards-title" id="empty-cards-title">Aucune recette trouvée</h2>
      <p class="empty-cards-message" id="empty-cards-message">
        Essayez de modifier vos critères de recherche ou vos filtres pour trouver des recettes.
      </p>
    </div>
  `;
};

export const renderCard = (
  id,
  name,
  time,
  description,
  webpUrl,
  jpgUrl,
  alt,
  ingredientsCount,
  ingredientsList,
) => {
  return `
      <div class="card" id="card-${id}">
        <div class="card-picture skeleton">
          <picture>
            <source srcset="${webpUrl}" type="image/webp" />
            <img 
              src="${jpgUrl}" 
              alt="${alt}" 
              type="image/jpeg"
              loading="lazy" 
              width="400" 
              height="300" 
              decoding="async" 
              fetchpriority="low" 
            />
          </picture>
        </div>
        <div class="tag-time" id="tag-time-${id}" aria-label="Temps de préparation">
          <span class="time-text" id="time-text-${id}"><i class="ri-timer-line"></i>${time} min</span>
        </div>
        <div class="card-header">
          <h2>${name}</h2>
        </div>
        <div class="card-recipe">
          <div class="recipe-container">
            <h3><i class="ri-book-open-line"></i>Recette</h3>
            <p>${description}</p>
            <button type="button" class="recipe-toggle" aria-expanded="false">
              <span class="toggle-text">Voir plus</span>
              <i class="ri-arrow-down-s-line" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="card-ingredients">
          <div class="ingredients-container">
            <span class="ingredients-header">
              <i class="ri-restaurant-line"></i>
              <span class="ingredient-count">${ingredientsCount}</span>
              Ingrédients
            </span>
            <div class="ingredients-lists">
              ${ingredientsList}
            </div>
          </div>
        </div>
      </div>
  `;
};

export const renderIngredient = (ingredient, quantityText) => {
  return `
    <div class="ingredient-chip">
      <span class="ingredient-name">${ingredient}</span>
      <span class="ingredient-quantity">${quantityText}</span>
    </div>
  `;
};
