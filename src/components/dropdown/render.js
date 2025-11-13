import { capitalizeFirstLetter } from "@/helper/helper.js";

export const renderItem = (item, type, isSelected) => {
  // Display capitalized, but store normalized value for filtering
  const displayText = capitalizeFirstLetter(item);
  return `
  <li role="option">
    <button type="button" class="dropdown-item ${isSelected ? "selected" : ""}"
      data-value="${item}" data-type="${type}">
      <span>${displayText}</span>
      ${isSelected ? '<i class="fa-solid fa-check dropdown-item-check" aria-hidden="true"></i>' : ""}
    </button>
  </li>
`;
};

export const renderEmptyState = () => `
  <li class="dropdown-empty-state">
    <span class="dropdown-empty-message">Aucun résultat</span>
  </li>
`;

export const renderDropdown = (name, type, placeholderName, itemsHTML) => `
  <div class="dropdown-container" id="dropdown-${type}-container" data-type="${type}">
    <button type="button" class="filter-dropdown" id="dropdown-${type}-button"
      aria-expanded="false" aria-controls="menu-${type}" aria-label="Ouvrir le menu ${name}">
      <span class="filter-label">${name}</span>
      <i class="fa-solid fa-chevron-down"></i>
    </button>
    <div class="dropdown-backdrop" id="dropdown-${type}-backdrop" aria-hidden="true"></div>
    <div class="dropdown-menu" id="menu-${type}" aria-hidden="true" role="menu">
      <div class="dropdown-search">
        <input type="text" id="search-${type}" class="dropdown-search-input"
          placeholder="Rechercher un ${placeholderName}..." aria-label="Rechercher dans ${name}">
        <i class="fa-solid fa-magnifying-glass dropdown-search-icon" id="search-icon-${type}" aria-hidden="true" aria-label="Rechercher"></i>
        <button type="button" class="dropdown-search-clear hidden" id="clear-search-${type}" aria-label="Effacer la recherche">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
      <ul class="dropdown-list" id="dropdown-${type}-list" role="listbox">
        ${itemsHTML}
      </ul>
    </div>
  </div>
`;
