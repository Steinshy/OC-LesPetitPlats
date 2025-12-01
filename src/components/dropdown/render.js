// src/components/dropdown/render.js

import { renderDropdownSearch } from "@components/search/render.js";

export const ingredientsDropdown = () => {
  return `
    <div class="dropdown-container" id="dropdown-ingredients-container" data-type="ingredients">
      <button
        type="button"
        class="filter-dropdown"
        id="dropdown-ingredients-button"
        aria-expanded="false"
        aria-controls="menu-ingredients"
        aria-label="Ouvrir le menu ingredients"
      >
        <span class="dropdown-count" id="dropdown-ingredients-count" aria-label="Nombre d'éléments"></span>
        <span class="filter-label">Ingrédients</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <div
        class="dropdown-backdrop"
        id="dropdown-ingredients-backdrop"
        aria-hidden="true"
      ></div>
      <div
        class="dropdown-menu"
        id="menu-ingredients"
        aria-hidden="true"
        role="listbox"
        aria-labelledby="dropdown-ingredients-button"
      >
        ${renderDropdownSearch("ingredients")}
        <ul class="dropdown-list" id="dropdown-ingredients-list"></ul>
      </div>
    </div>
  `;
};

export const utensilsDropdown = () => {
  return `
    <div class="dropdown-container" id="dropdown-utensils-container" data-type="utensils">
      <button
        type="button"
        class="filter-dropdown"
        id="dropdown-utensils-button"
        aria-expanded="false"
        aria-controls="menu-utensils"
        aria-label="Ouvrir le menu utensils"
      >
        <span class="dropdown-count" id="dropdown-utensils-count" aria-label="Nombre d'éléments"></span>
        <span class="filter-label">Ustensiles</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <div
        class="dropdown-backdrop"
        id="dropdown-utensils-backdrop"
        aria-hidden="true"
      ></div>
      <div
        class="dropdown-menu"
        id="menu-utensils"
        aria-hidden="true"
        role="listbox"
        aria-labelledby="dropdown-utensils-button"
      >
        ${renderDropdownSearch("utensils")}
        <ul class="dropdown-list" id="dropdown-utensils-list"></ul>
      </div>
    </div>
  `;
};

export const appliancesDropdown = () => {
  return `
    <div class="dropdown-container" id="dropdown-appliances-container" data-type="appliances">
      <button
        type="button"
        class="filter-dropdown"
        id="dropdown-appliances-button"
        aria-expanded="false"
        aria-controls="menu-appliances"
        aria-label="Ouvrir le menu appliances"
      >
        <span class="dropdown-count" id="dropdown-appliances-count" aria-label="Nombre d'éléments"></span>
        <span class="filter-label">Appareils</span>
        <i class="ri-arrow-down-s-line"></i>
      </button>
      <div
        class="dropdown-backdrop"
        id="dropdown-appliances-backdrop"
        aria-hidden="true"
      ></div>
      <div
        class="dropdown-menu"
        id="menu-appliances"
        aria-hidden="true"
        role="listbox"
        aria-labelledby="dropdown-appliances-button"
      >
        ${renderDropdownSearch("appliances")}
        <ul class="dropdown-list" id="dropdown-appliances-list"></ul>
      </div>
    </div>
  `;
};

export const renderEmptyStateItem = type => {
  return `
    <li class="dropdown-empty-state" id="dropdown-${type}-empty-state" role="option" aria-selected="false" aria-disabled="true">
      <i class="ri-error-warning-line" aria-hidden="true"></i>
      <span class="dropdown-empty-message" id="dropdown-${type}-empty-message">
        Aucun résultat trouvé
      </span>
    </li>
  `;
};

export const renderDropdownItem = (type, item, itemId, itemBtnId) => {
  return `
    <li role="option" id="${itemId}" aria-selected="false">
      <button
        type="button"
        class="dropdown-item item-btn"
        id="${itemBtnId}"
        data-value="${item.value}"
        data-type="${type}"
        aria-pressed="false"
        aria-label="${item.label}"
      >
        <span class="dropdown-item-label">${item.label}</span>
        <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
      </button>
    </li>
  `;
};
