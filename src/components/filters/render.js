// src/components/filters/render.js

export const renderFiltersContainer = () => `
  <div class="filters-header">
    <h3 class="filters-title">
      Filtres sélectionnés
      <span class="filters-count" id="filters-count"></span>
    </h3>
    <button 
      type="button" 
      id="clear-filters-btn" 
      class="clear-filters-btn" 
      aria-hidden="true"
      aria-label="Retirer tous les filtres">
      Tout effacer
    </button>
  </div>
  <ul class="lists-container" id="filters-tags" role="list"></ul>
`;

export const renderFilterTag = ({ label, value, type, id }) => `
  <li>
    <button 
      type="button" 
      class="filter-tag" 
      id="${id}" 
      data-value="${value}" 
      data-type="${type}"
      aria-label="Retirer le filtre ${label}">
      <span>${label}</span>
      <i class="ri-close-line" aria-hidden="true"></i>
    </button>
  </li>
`;
