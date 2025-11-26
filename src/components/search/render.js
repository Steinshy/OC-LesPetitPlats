export const renderDropdownSearch = type => {
  return `
    <div class="dropdown-search" id="dropdown-${type}-search">
      <div class="search-bar-container" id="dropdown-${type}-search-bar-container">
        <input 
          type="text" 
          id="search-${type}"
          name="search-${type}"
          placeholder="Rechercher un ${type}...">
        <button type="button" id="dropdown-${type}-search-clear-button" class="search-clear-btn hidden" aria-label="Effacer la recherche">
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>

        <button type="button" id="dropdown-${type}-search-submit-btn" aria-label="Lancer la recherche" class="search-btn">
          <i class="ri-search-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;
};
