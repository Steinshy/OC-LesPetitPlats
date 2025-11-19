export const ingredientsDropdown = (ingredientsItems = [], type = "ingredients") => {
  return `
    <div class="dropdown-container" id="dropdown-${type}-container" data-type="${type}">
      <button type="button" class="filter-dropdown" id="dropdown-${type}-button"
        aria-expanded="false" aria-controls="menu-${type}" aria-label="Ouvrir le menu ${type}">
        <span class="filter-label">${type}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="dropdown-backdrop" id="dropdown-${type}-backdrop" aria-hidden="true"></div>
      <div class="dropdown-menu" id="menu-${type}" aria-hidden="true" role="menu">
        <div class="dropdown-search">
          <input type="text" id="search-${type}" class="dropdown-search-input"
            placeholder="Rechercher un ${type}..." aria-label="Rechercher dans ${type}">
          <i class="fa-solid fa-magnifying-glass dropdown-search-icon" id="search-icon-${type}" aria-hidden="true" aria-label="Rechercher"></i>
          <button type="button" class="dropdown-search-clear hidden" id="clear-search-${type}" aria-label="Effacer la recherche">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        ${renderDropdownList(ingredientsItems, type)}
      </div>
    </div>
  `;
};

export const ustensilsDropdown = (ustensilsItems = [], type = "ustensils") => {
  return `
    <div class="dropdown-container" id="dropdown-${type}-container" data-type="${type}">
      <button type="button" class="filter-dropdown" id="dropdown-${type}-button"
        aria-expanded="false" aria-controls="menu-${type}" aria-label="Ouvrir le menu ${type}">
        <span class="filter-label">${type}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="dropdown-backdrop" id="dropdown-${type}-backdrop" aria-hidden="true"></div>
      <div class="dropdown-menu" id="menu-${type}" aria-hidden="true" role="menu">
        <div class="dropdown-search">
          <input type="text" id="search-${type}" class="dropdown-search-input"
            placeholder="Rechercher un ${type}..." aria-label="Rechercher dans ${type}">
          <i class="fa-solid fa-magnifying-glass dropdown-search-icon" id="search-icon-${type}" aria-hidden="true" aria-label="Rechercher"></i>
          <button type="button" class="dropdown-search-clear hidden" id="clear-search-${type}" aria-label="Effacer la recherche">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <ul class="dropdown-list" id="dropdown-${type}-list" role="listbox">
          ${renderDropdownList(ustensilsItems, type)}
        </ul>
      </div>
    </div>
  `;
};

export const appliancesDropdown = (appliancesItems = [], type = "appliances") => {
  return `
    <div class="dropdown-container" id="dropdown-${type}-container" data-type="${type}">
      <button type="button" class="filter-dropdown" id="dropdown-${type}-button"
        aria-expanded="false" aria-controls="menu-${type}" aria-label="Ouvrir le menu ${type}">
        <span class="filter-label">${type}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="dropdown-backdrop" id="dropdown-${type}-backdrop" aria-hidden="true"></div>
      <div class="dropdown-menu" id="menu-${type}" aria-hidden="true" role="menu">
        <div class="dropdown-search">
          <input type="text" id="search-${type}" class="dropdown-search-input"
            placeholder="Rechercher un ${type}..." aria-label="Rechercher dans ${type}">
          <i class="fa-solid fa-magnifying-glass dropdown-search-icon" id="search-icon-${type}" aria-hidden="true" aria-label="Rechercher"></i>
          <button type="button" class="dropdown-search-clear hidden" id="clear-search-${type}" aria-label="Effacer la recherche">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <ul class="dropdown-list" id="dropdown-${type}-list" role="listbox">
          ${renderDropdownList(appliancesItems, type)}
        </ul>
      </div>
    </div>
  `;
};

export const renderEmptyStateItem = () => {
  return `
    <li class="dropdown-empty-state" role="option">
      <span class="dropdown-empty-message">Aucun résultat trouvé</span>
    </li>
  `;
};

export const renderDropdownList = (items, type) => {
  return `
    <ul class="dropdown-list" id="dropdown-${type}-list" role="listbox">
      ${items
        .map(item => {
          return `<li role="option">
            <button type="button" class="dropdown-item" id="dropdown-item-${type}-${item}"
              data-value="${item}" data-type="${type}">
            <span>${item}</span>
          </button>
        </li>`;
        })
        .join("")}
    </ul>
  `;
};

export const renderDropdownSkeleton = (type, label) => {
  return `
    <div class="dropdown-container skeleton-loading" id="dropdown-${type}-container" data-type="${type}">
      <button type="button" class="filter-dropdown" id="dropdown-${type}-button" disabled
        aria-expanded="false" aria-label="Chargement ${label}">
        <span class="filter-label"></span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
    </div>
  `;
};

export const renderDropdownsSkeletons = () => {
  return (
    renderDropdownSkeleton("ingredients", "Ingrédients") +
    renderDropdownSkeleton("ustensils", "Ustensiles") +
    renderDropdownSkeleton("appliances", "Appareils")
  );
};
