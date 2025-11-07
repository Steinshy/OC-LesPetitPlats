import { removeFilter, clearAllFilters } from "./search.js";

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
  const filterBoxTitle = document.querySelector(".filter-box-title");
  const clearAllButton = document.querySelector("#clear-all-filters");
  const filterCount = document.querySelector("#filter-count");
  if (!container) return;

  const allFilters = Object.entries(activeFilters).flatMap(([type, values]) =>
    [...values].map(value => ({ type, value })),
  );

  if (filterCount) {
    filterCount.textContent = `(${allFilters.length})`;
  }

  if (allFilters.length === 0) {
    container.innerHTML = "";
    filtersBox?.classList.remove("has-filters");
    if (clearAllButton) clearAllButton.classList.remove("visible");
    if (filterCount) filterCount.textContent = "(0)";
    return;
  }

  filtersBox?.classList.add("has-filters");
  filterBoxTitle?.classList.remove("skeleton-loading");
  if (clearAllButton) clearAllButton.classList.add("visible");
  container.innerHTML = allFilters.map(({ type, value }) => renderTag(type, value)).join("");

  container.querySelectorAll(".filter-tag").forEach(tag => {
    tag.addEventListener("click", event => {
      event.preventDefault();
      removeFilter(tag.dataset.type, tag.dataset.value);
    });
  });

  if (clearAllButton) {
    clearAllButton.onclick = event => {
      event.preventDefault();
      clearAllFilters();
    };
  }
};
