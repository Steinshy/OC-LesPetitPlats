export const renderFilters = () => {
  return `
      <div class="filters-container" id="filters-container">
        <div class="filters-header">
          <h3 class="filters-title">
            Filtres sélectionnés
            <span class="filters-count" id="filters-count">(0)</span>
          </h3>
          <button type="button" id="clear-filters-btn" class="clear-filters-btn" aria-label="Retirer tous les filtres">
            Tout effacer
          </button>
        </div>

        <div class="lists-container" id="filters-tags">
          <!-- Filter tags -->
        </div>
      </div>
  `;
};

export const renderFilterTag = (value, type) => {
  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return `
  <button type="button" class="filter-tag selected" id="filter-tag-btn" data-value="${value}" data-type="${type}"
    aria-label="Retirer le filtre ${value}">
    <span>${capitalizedValue}</span>
    <i class="fa-solid fa-xmark"></i>
  </button>
`;
};
