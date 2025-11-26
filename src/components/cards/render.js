export const renderNoResults = () => {
  const baseUrl = import.meta.env.BASE_URL;
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

export const renderCardPicture = (imageData = null, time = null, index = 0) => {
  const { webpUrl, jpgUrl, alt } = imageData || {};
  const isAboveFold = index < 6;
  const loading = isAboveFold ? "eager" : "lazy";
  const fetchPriority = isAboveFold ? 'fetchpriority="high"' : "";

  return `
    <div class="card-picture">
      <picture>
        ${webpUrl ? `<source srcset="${webpUrl}" type="image/webp" ${fetchPriority} />` : ""}
        <img src="${jpgUrl}" alt="${alt}" loading="${loading}" width="380" height="250" decoding="async" ${fetchPriority} />
      </picture>
      ${time ? `<span class="card-time">${time}min</span>` : ""}
    </div>
  `;
};

export const renderCardHeader = name => {
  return `
    <div class="card-header">
      <h2>${name}</h2>
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
