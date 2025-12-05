// src/components/dropdowns/render.js
export const ingredientsDropdown = () => {
  return `
    <div 
      class="dropdown-container" 
      id="dropdown-ingredients-container" 
      data-type="ingredients">
      
      <button
        type="button"
        class="filter-dropdown"
        id="dropdown-ingredients-button"
        aria-expanded="false"
        aria-controls="menu-ingredients"
        aria-label="Ouvrir le menu ingredients">
        <span class="dropdown-count" id="dropdown-ingredients-count" aria-label="Nombre d'éléments"></span>
        <span class="filter-label">Ingrédients</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      
      <div
        class="dropdown-backdrop"
        id="dropdown-ingredients-backdrop"
        aria-hidden="true">
      </div>
      
      <div
        class="dropdown-menu"
        id="menu-ingredients"
        aria-hidden="true"
        role="listbox"
        aria-labelledby="dropdown-ingredients-button">
        ${renderDropdownSearch("ingredients")}
        <ul class="dropdown-list" id="dropdown-ingredients-list"></ul>
      </div>
    </div>
  `;
};

export const utensilsDropdown = () => {
  return `
    <div 
      class="dropdown-container" 
      id="dropdown-utensils-container"
      data-type="utensils">

      <button
        type="button"
        class="filter-dropdown"
        id="dropdown-utensils-button"
        aria-expanded="false"
        aria-controls="menu-utensils"
        aria-label="Ouvrir le menu utensils">
        <span class="dropdown-count" id="dropdown-utensils-count" aria-label="Nombre d'éléments"></span>
        <span class="filter-label">Ustensiles</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>

      <div
        class="dropdown-backdrop"
        id="dropdown-utensils-backdrop"
        aria-hidden="true">
      </div>

      <div
        class="dropdown-menu"
        id="menu-utensils"
        aria-hidden="true"
        role="listbox"
        aria-labelledby="dropdown-utensils-button">
        ${renderDropdownSearch("utensils")}
        <ul class="dropdown-list" id="dropdown-utensils-list"></ul>
      </div>
    </div>
  `;
};

export const appliancesDropdown = () => {
  return `
    <div 
      class="dropdown-container"
      id="dropdown-appliances-container"
      data-type="appliances">

      <button
        type="button"
        class="filter-dropdown"
        id="dropdown-appliances-button"
        aria-expanded="false"
        aria-controls="menu-appliances"
        aria-label="Ouvrir le menu appliances">
        <span class="dropdown-count" id="dropdown-appliances-count" aria-label="Nombre d'éléments"></span>
        <span class="filter-label">Appareils</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>

      <div
        class="dropdown-backdrop"
        id="dropdown-appliances-backdrop"
        aria-hidden="true"
        data-type="appliances">
      </div>
      
      <div
        class="dropdown-menu"
        id="menu-appliances"
        aria-hidden="true"
        role="listbox"
        aria-labelledby="dropdown-appliances-button"
        data-type="appliances">
        ${renderDropdownSearch("appliances")}
        <ul class="dropdown-list" id="dropdown-appliances-list" data-type="appliances"></ul>
      </div>
    </div>
  `;
};

export const renderEmptyStateItem = type => {
  return `
    <li 
      class="dropdown-empty-state" 
      id="dropdown-${type}-empty-state" 
      role="option" 
      aria-selected="false" 
      aria-disabled="true"
      data-type="${type}">
      <i 
        class="ri-error-warning-line" 
        aria-hidden="true"
        data-type="${type}">
      </i>

      <span 
        class="dropdown-empty-message" 
        id="dropdown-${type}-empty-message"
        data-type="${type}">
        Aucun résultat trouvé
      </span>
    </li>
  `;
};

export const renderDropdownItem = (type, item, itemId, itemBtnId, isSelected = false) => {
  return `
    <li 
      role="option" id="${itemId}"
      aria-selected="${isSelected}">
      
      <button
        type="button"
        class="dropdown-item item-btn${isSelected ? " selected" : ""}"
        id="${itemBtnId}"
        data-value="${item.value}"
        data-type="${type}"
        aria-pressed="${isSelected}"
        aria-label="${item.label}">
        <span class="dropdown-item-label">${item.label}</span>
        <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
      </button>
    </li>
  `;
};

const renderDropdownSearch = type => {
  const searchInputId = `search-${type}`;
  const labelId = `label-${type}`;
  return `
    <div 
      class="dropdown-search" 
      id="dropdown-${type}-search"
      data-type="${type}">
      
      <label 
        for="${searchInputId}" 
        id="${labelId}" 
        class="sr-only"
        data-type="${type}">
        Rechercher un ${type}
      </label>
      
      <input 
        type="text" 
        id="${searchInputId}"
        name="${searchInputId}"
        aria-labelledby="${labelId}"
        placeholder="Rechercher un ${type}...">

      <button 
        type="button" 
        id="dropdown-${type}-search-clear-button" 
        class="search-clear-btn hidden" 
        aria-label="Effacer la recherche"
        data-type="${type}">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>

      <button 
        type="button" 
        id="dropdown-${type}-search-submit-button" 
        aria-label="Lancer la recherche" 
        class="search-button"
        data-type="${type}">
        <i class="ri-search-line" aria-hidden="true"></i>
      </button>
    </div>
  `;
};
