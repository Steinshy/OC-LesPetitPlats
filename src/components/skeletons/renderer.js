// src/components/skeletonsRenderer.js

export const dropdownsSkeleton = () => {
  return `
    <div class="dropdown-container" id="dropdown-ingredients-container" data-type="ingredients">
      <button type="button" class="filter-dropdown" id="dropdown-ingredients-button" disabled
        aria-expanded="false" aria-label="Chargement Ingredients">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    </div>
    <div class="dropdown-container" id="dropdown-utensils-container" data-type="utensils">
      <button type="button" class="filter-dropdown" id="dropdown-utensils-button" disabled
        aria-expanded="false" aria-label="Chargement Ustensiles">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    </div>
    <div class="dropdown-container" id="dropdown-appliances-container" data-type="appliances">
      <button type="button" class="filter-dropdown" id="dropdown-appliances-button" disabled
        aria-expanded="false" aria-label="Chargement Appareils">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    </div>
  `;
};

export const cardSkeleton = count => {
  if (!count || count <= 0) return "";
  const skeleton = `
    <div class="card skeleton">
      <div class="card-picture">
      </div>
    </div>
  `;
  return Array.from({ length: count }, () => skeleton).join("");
};
