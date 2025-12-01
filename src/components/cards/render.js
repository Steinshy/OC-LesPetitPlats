// src/components/cards/render.js

// ---------------
// no results
// ---------------

export const renderNoResults = () => {
  return `
    <div class="no-results-icon">
      <i class="ri-error-warning-line" aria-hidden="true"></i>
    </div>
    <h2>Aucune recette trouvée</h2>
    <p>
      Essayez de modifier vos critères de recherche ou vos filtres pour trouver des recettes.
    </p>
  `;
};

// ---------------
// card picture
// ---------------

export const renderCardPicture = (imageData = null, time = null, index = 0) => {
  const { webpUrl, jpgUrl, alt } = imageData || {};
  // First 6 cards: eager load
  const isAboveFold = index < 6;
  const loading = isAboveFold ? "eager" : "lazy";
  const fetchPriority = isAboveFold ? 'fetchpriority="high"' : "";

  return `
    <div class="card-picture">
      <picture>
        ${webpUrl ? `<source srcset="${webpUrl}" type="image/webp" ${fetchPriority} />` : ""}
        <img src="${jpgUrl}" alt="${alt}" loading="${loading}" width="380" height="253" decoding="async" ${fetchPriority} />
      </picture>
      <div class="card-picture-overlay"></div>
      ${time ? `<span class="card-time"><i class="ri-timer-line" aria-hidden="true"></i>${time} min</span>` : ""}
    </div>
  `;
};

// ---------------
// card header
// ---------------

export const renderCardHeader = (name, servings = null) => {
  return `
    <div class="card-header">
      <h2>${name}</h2>
      ${servings ? `<span class="card-servings"><i class="ri-group-line" aria-hidden="true"></i>${servings}</span>` : ""}
    </div>
  `;
};

// ---------------
// card contents
// ---------------

export const renderCardContents = (description, ingredients) => {
  const ingredientsHTML = (ingredients || [])
    .map(ingredient => {
      const { quantity, unit } = ingredient;
      const hasQuantity = quantity != null && quantity !== "";
      const hasUnit = unit != null && unit !== "";

      const quantityText =
        hasQuantity || hasUnit
          ? [hasQuantity ? quantity : null, hasUnit ? unit : null]
              .filter(value => value != null)
              .join(" ")
          : "au goût";

      return `
        <div class="ingredient-chip">
          <span class="ingredient-name">${ingredient.ingredient}</span>
          <span class="ingredient-quantity">${quantityText}</span>
        </div>
      `;
    })
    .join("");

  return `
    <div class="card-content">
      <div class="card-section card-recipe">
        <h3><i class="ri-book-open-line" aria-hidden="true"></i>Recette</h3>
        <p>${description}</p>
        <button type="button" class="card-recipe-toggle" aria-expanded="false">
          <span class="toggle-text">Voir plus</span>
          <i class="ri-arrow-down-s-line" aria-hidden="true"></i>
        </button>
      </div>
      <div class="card-section card-ingredients">
        <h3><i class="ri-restaurant-line" aria-hidden="true"></i>Ingrédients <span class="ingredient-count">${ingredients.length}</span></h3>
        <div class="ingredients-grid">
          ${ingredientsHTML}
        </div>
      </div>
    </div>
  `;
};
