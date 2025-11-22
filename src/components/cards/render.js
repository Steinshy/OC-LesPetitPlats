export const renderNoResults = () => {
  return `
    <div class="no-results-icon">
      <i class="ri-knife-line" aria-hidden="true"></i>
    </div>
    <h2>Aucune recette trouvée</h2>
    <p>
      Essayez de modifier vos critères de recherche ou vos filtres pour trouver des recettes.
    </p>
  `;
};

export const renderCardPicture = (imageData = null) => {
  const { webpUrl, jpgUrl, alt } = imageData || {};
  return `
    <div class="card-picture">
      <div class="image-loading-placeholder"></div>
      <picture>
        ${webpUrl ? `<source srcset="${webpUrl}" type="image/webp" />` : ""}
        <img src="${jpgUrl}" alt="${alt}" loading="eager" width="380" height="250" decoding="async" fetchpriority="high" />
      </picture>
    </div>
  `;
};

export const renderCardHeader = (name, time) => {
  return `
    <div class="card-header">
      <h2>${name}</h2>
      <span class="card-time">${time}min</span>
    </div>
  `;
};

export const renderCardContents = (description, ingredients) => {
  const ingredientsHTML = (ingredients || [])
    .map(
      ingredient => `
    <div class="ingredient-items">
      <p class="ingredient-name">${ingredient.ingredient}</p>
      <p class="ingredient-quantity">${[ingredient.quantity, ingredient.unit]
        .filter(Boolean)
        .join(" ")}</p>
    </div>
  `,
    )
    .join("");

  return `
    <div class="contents-container">
      <div class="contents-recipe">
        <h3>RECETTE</h3>
        <p>${description}</p>
      </div>
      <div class="contents-ingredients">
        <h3>INGRÉDIENTS (${ingredients.length})</h3>
        <div class="ingredients-details">
          ${ingredientsHTML}
        </div>
      </div>
    </div>
  `;
};
