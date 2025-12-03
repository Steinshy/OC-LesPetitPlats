// src/components/filters/render.js
export const renderFilterTag = ({ type, value, label, id }) => `
  <li id="${id}" role="option">
    <button type="button" class="filter-tag" id="tag-remove-button-${id}" data-type="${type}" data-value="${value}" aria-label="Retirer le tag ${label}">
      <span>${label}</span>
      <i aria-hidden="true">×</i>
    </button>
  </li>
`;
