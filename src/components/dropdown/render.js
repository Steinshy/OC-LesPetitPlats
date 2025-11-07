export const renderItem = (item, type, isSelected) => `
  <li role="option">
    <button type="button" class="dropdown-item ${isSelected ? "selected" : ""}" 
      data-value="${item}" data-type="${type}">${item}</button>
  </li>
`;

export const renderDropdown = (name, type, data) => `
  <div class="dropdown-container" data-type="${type}">
    <button type="button" class="filter-dropdown" id="dropdown-${type}-button" 
      aria-expanded="false" aria-controls="menu-${type}" aria-label="Ouvrir le menu ${name}">
      <span class="filter-label">${name}</span>
      <i class="fa-solid fa-chevron-down"></i>
    </button>
    <div class="dropdown-backdrop" aria-hidden="true"></div>
    <div class="dropdown-menu" id="menu-${type}" aria-hidden="true" role="menu">
      <div class="dropdown-search">
        <input type="text" id="search-${type}" class="dropdown-search-input" 
          placeholder="Rechercher un ${name.toLowerCase()}..." aria-label="Rechercher dans ${name}">
        <i class="fa-solid fa-magnifying-glass dropdown-search-icon"></i>
        <button type="button" class="dropdown-search-clear hidden" id="clear-search-${type}" aria-label="Effacer la recherche">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
      <ul class="dropdown-list" id="dropdown-${type}-list" role="listbox">
        ${data.map(item => renderItem(item, type, false)).join("")}
      </ul>
    </div>
  </div>
`;
