import { removeFilter } from "./search.js";

const typeLabels = { ingredients: "Ingrédient", appliances: "Appareil", ustensils: "Ustensile" };

const renderTag = (type, value) => `
  <button type="button" class="filter-tag selected" data-type="${type}" data-value="${value}"
    aria-label="Retirer le filtre ${typeLabels[type] || type}: ${value}">
    <span>${value}</span>
    <i class="fa-solid fa-xmark"></i>
  </button>
`;

export const updateFilterTags = activeFilters => {
  const container = document.querySelector(".ingredients-list");
  const filtersBox = document.querySelector(".filters-box");
  if (!container) return;

  const allFilters = Object.entries(activeFilters).flatMap(([type, values]) =>
    [...values].map(value => ({ type, value })),
  );

  if (allFilters.length === 0) {
    container.innerHTML = "";
    filtersBox?.classList.remove("has-filters");
    return;
  }

  filtersBox?.classList.add("has-filters");
  container.innerHTML = allFilters.map(({ type, value }) => renderTag(type, value)).join("");

  container.querySelectorAll(".filter-tag").forEach(tag => {
    tag.addEventListener("click", event => {
      event.preventDefault();
      removeFilter(tag.dataset.type, tag.dataset.value);
    });
  });
};
