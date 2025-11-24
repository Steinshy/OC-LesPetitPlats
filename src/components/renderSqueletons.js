export const renderMainSearchBarSkeleton = () => {
  return `
    <div class="main-search-bar skeleton-loading" id="main-search-bar">
      <div class="search-bar-container" id="search-bar-container">
        <label for="main-search-input" class="sr-only">Rechercher une recette, un ingrédient</label>

        <input 
          type="text" 
          id="main-search-input"
          name="main-search-input"
          placeholder="Rechercher une recette, un ingrédient..."
          disabled>

        <button type="button" id="main-clear-search-btn" class="search-clear-btn hidden" aria-label="Effacer la recherche" disabled>
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>

        <button type="button" id="main-search-btn" aria-label="Lancer la recherche" class="search-btn" disabled>
          <i class="ri-search-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;
};

export const renderMainHeaderSkeleton = () => {
  return `
    <section id="header-title" class="header-title skeleton-loading">
      <div class="header-image-placeholder"></div>
      <h2>
        Cherchez parmi plus de 1500 recettes <br>
        du quotidien, simples et délicieuses
      </h2>
      ${renderMainSearchBarSkeleton()}
    </section>
  `;
};

export const renderDropdownsSkeletons = () => {
  return `
    <div class="dropdown-container skeleton-loading" id="dropdown-ingredients-container" data-type="ingredients">
      <button type="button" class="filter-dropdown" id="dropdown-ingredients-button" disabled
        aria-expanded="false" aria-label="Chargement Ingredients">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    </div>
    <div class="dropdown-container skeleton-loading" id="dropdown-ustensils-container" data-type="ustensils">
      <button type="button" class="filter-dropdown" id="dropdown-ustensils-button" disabled
        aria-expanded="false" aria-label="Chargement Ustensiles">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    </div>
    <div class="dropdown-container skeleton-loading" id="dropdown-appliances-container" data-type="appliances">
      <button type="button" class="filter-dropdown" id="dropdown-appliances-button" disabled
        aria-expanded="false" aria-label="Chargement Appareils">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
    </div>
  `;
};

export const renderCardSkeletons = count => {
  if (!count || count <= 0) return "";
  const cardSkeleton = `
    <div class="card skeleton">
      <div class="card-picture">
        <div class="image-loading-placeholder"></div>
      </div>
    </div>
  `;
  return Array.from({ length: count }, () => cardSkeleton).join("");
};
