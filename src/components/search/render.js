export const renderDropdownSearch = type => {
  const searchInputId = `search-${type}`;
  const labelId = `label-${type}`;
  return `
    <div class="dropdown-search" id="dropdown-${type}-search">
      <label for="${searchInputId}" id="${labelId}" class="sr-only">Rechercher un ${type}</label>
      <input 
        type="text" 
        id="${searchInputId}"
        name="${searchInputId}"
        aria-labelledby="${labelId}"
        placeholder="Rechercher un ${type}...">
      <button type="button" id="dropdown-${type}-search-clear-button" class="search-clear-btn hidden" aria-label="Effacer la recherche">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
      <button type="button" id="dropdown-${type}-search-submit-btn" aria-label="Lancer la recherche" class="search-btn">
        <i class="ri-search-line" aria-hidden="true"></i>
      </button>
    </div>
  `;
};
