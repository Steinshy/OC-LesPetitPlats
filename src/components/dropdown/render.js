import { renderDropdownSearch } from "../search/render";
export const ingredientsDropdown = (ingredientsItems = []) => {
  return `
    <div class="dropdown-container" id="dropdown-ingredients-container" data-type="ingredients">
      <button type="button" class="filter-dropdown" id="dropdown-ingredients-button"
        aria-expanded="false" aria-controls="menu-ingredients" aria-label="Ouvrir le menu ingredients">
        <span class="filter-label">Ingrédients</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <div class="dropdown-backdrop" id="dropdown-ingredients-backdrop" aria-hidden="true"></div>
      <div class="dropdown-menu" id="menu-ingredients" aria-hidden="true" role="menu">
        ${renderDropdownSearch("ingredients")}
        ${renderDropdownList(ingredientsItems, "ingredients")}
      </div>
    </div>
  `;
};

export const ustensilsDropdown = (ustensilsItems = []) => {
  return `
    <div class="dropdown-container" id="dropdown-ustensils-container" data-type="ustensils">
      <button type="button" class="filter-dropdown" id="dropdown-ustensils-button"
        aria-expanded="false" aria-controls="menu-ustensils" aria-label="Ouvrir le menu ustensils">
        <span class="filter-label">Ustensiles</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <div class="dropdown-backdrop" id="dropdown-ustensils-backdrop" aria-hidden="true"></div>
      <div class="dropdown-menu" id="menu-ustensils" aria-hidden="true" role="menu">
        ${renderDropdownSearch("ustensils")}
        ${renderDropdownList(ustensilsItems, "ustensils")}
      </div>
    </div>
  `;
};

export const appliancesDropdown = (appliancesItems = []) => {
  return `
    <div class="dropdown-container" id="dropdown-appliances-container" data-type="appliances">
      <button type="button" class="filter-dropdown" id="dropdown-appliances-button"
        aria-expanded="false" aria-controls="menu-appliances" aria-label="Ouvrir le menu appliances">
        <span class="filter-label">Appareils</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <div class="dropdown-backdrop" id="dropdown-appliances-backdrop" aria-hidden="true"></div>
      <div class="dropdown-menu" id="menu-appliances" aria-hidden="true" role="menu">
        ${renderDropdownSearch("appliances")}
        ${renderDropdownList(appliancesItems, "appliances")}
      </div>
    </div>
  `;
};

export const renderEmptyStateItem = () => {
  return `
    <li class="dropdown-empty-state" id="dropdown-empty-state" role="option">
      <span class="dropdown-empty-message">Aucun résultat trouvé</span>
    </li>
  `;
};

export const renderDropdownList = (items, type) => `
  <ul class="dropdown-list" id="dropdown-${type}-list" role="listbox">
    ${items
      .map(
        item => `
        <li role="option" id="dropdown-item-${type}-${item}">
          <button
            type="button"
            class="dropdown-item item-btn"
            id="item-btn-${type}-${item}"
            data-value="${item}"
            data-type="${type}"
            aria-pressed="false"
          >
            <span class="dropdown-item-label">${item}</span>
            <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
          </button>
        </li>
      `,
      )
      .join("")}
  </ul>
`;

export const renderDropdownSkeleton = (type, label) => {
  return `
    <div class="dropdown-container skeleton-loading" id="dropdown-${type}-container" data-type="${type}">
      <button type="button" class="filter-dropdown" id="dropdown-${type}-button" disabled
        aria-expanded="false" aria-label="Chargement ${label}">
        <span class="filter-label"></span>
        <i class="ri-arrow-down-s-line"></i>
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
