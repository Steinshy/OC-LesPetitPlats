export const renderDropdownSearch = dropdownType => {
  return `
    <div class="dropdown-search" id="dropdown-${dropdownType}-search">
      <div class="search-bar-container" id="dropdown-${dropdownType}-search-bar-container">
        <input 
          type="text" 
          id="search-${dropdownType}"
          name="search-${dropdownType}"
          placeholder="Rechercher un ${dropdownType}...">
        <button type="button" id="dropdown-${dropdownType}-search-clear-button" class="search-clear-btn hidden" aria-label="Effacer la recherche">
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>

        <button type="button" id="dropdown-${dropdownType}-search-submit-btn" aria-label="Lancer la recherche" class="search-btn">
          <i class="ri-search-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;
};
