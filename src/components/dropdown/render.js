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
        <ul class="dropdown-list" id="dropdown-ingredients-list" role="listbox">
          ${buildDropdownItemsHtml("ingredients", ingredientsItems)}
        </ul>
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
        <ul class="dropdown-list" id="dropdown-ustensils-list" role="listbox">
          ${buildDropdownItemsHtml("ustensils", ustensilsItems)}
        </ul>
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
        <ul class="dropdown-list" id="dropdown-appliances-list" role="listbox">
          ${buildDropdownItemsHtml("appliances", appliancesItems)}
        </ul>
      </div>
    </div>
  `;
};

export const renderEmptyStateItem = dropdownType => {
  return `
    <li class="dropdown-empty-state" id="dropdown-empty-state-${dropdownType}" role="option">
      <span class="dropdown-empty-message">Aucun résultat trouvé</span>
    </li>
  `;
};

const buildDropdownItemsHtml = (type, items = []) => {
  return items
    .map(item => {
      const label = item?.label ?? item;
      const value = item?.value ?? item;

      return `
        <li role="option" id="dropdown-item-${type}-${value}">
          <button
            type="button"
            class="dropdown-item item-btn"
            id="item-btn-${type}-${value}"
            data-value="${value}"
            data-type="${type}"
            aria-pressed="false"
          >
            <span class="dropdown-item-label">${label}</span>
            <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
          </button>
        </li>
      `;
    })
    .join("");
};
