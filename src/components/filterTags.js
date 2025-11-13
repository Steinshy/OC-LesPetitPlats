import { removeFilter, clearAllFilters } from "./search.js";
import { capitalizeFirstLetter } from "@/helper/helper.js";

const TYPE_LABELS = {
  ingredients: "Ingrédient",
  appliances: "Appareil",
  ustensils: "Ustensile",
};

const renderTag = (type, value) => {
  const displayValue = capitalizeFirstLetter(value);
  const typeLabel = TYPE_LABELS[type] || type;
  return `
  <button type="button" class="filter-tag selected" data-type="${type}" data-value="${value}"
    aria-label="Retirer le filtre ${typeLabel}: ${displayValue}">
    <span>${displayValue}</span>
    <i class="fa-solid fa-xmark"></i>
  </button>
`;
};

const getElements = () => ({
  container: document.querySelector(".ingredients-list"),
  filtersBox: document.querySelector(".filters-box"),
  filterBoxTitle: document.querySelector(".filter-box-title"),
  clearAllButton: document.querySelector("#clear-all-filters"),
  filterCount: document.querySelector("#filter-count"),
});

const buildFiltersList = activeFilters =>
  Object.entries(activeFilters).flatMap(([type, values]) =>
    [...values].map(value => ({ type, value })),
  );

const attachTagListeners = container => {
  container.querySelectorAll(".filter-tag").forEach(tag => {
    tag.addEventListener("click", event => {
      event.preventDefault();
      removeFilter(tag.dataset.type, tag.dataset.value);
    });
  });
};

const updateFilterCount = (filterCount, count) => {
  if (filterCount) {
    filterCount.textContent = `(${count})`;
  }
};

const clearFiltersUI = (filtersBox, clearAllButton, filterCount, container) => {
  container.innerHTML = "";
  filtersBox?.classList.remove("has-filters");
  clearAllButton?.classList.remove("visible");
  updateFilterCount(filterCount, 0);
};

const showFiltersUI = (filtersBox, filterBoxTitle, clearAllButton, allFilters, container) => {
  filtersBox?.classList.add("has-filters");
  filterBoxTitle?.classList.remove("skeleton-loading");
  clearAllButton?.classList.add("visible");
  container.innerHTML = allFilters.map(({ type, value }) => renderTag(type, value)).join("");
  attachTagListeners(container);
};

export const updateFilterTags = activeFilters => {
  const { container, filtersBox, filterBoxTitle, clearAllButton, filterCount } = getElements();
  if (!container) return;

  const allFilters = buildFiltersList(activeFilters);
  updateFilterCount(filterCount, allFilters.length);

  if (allFilters.length === 0) {
    clearFiltersUI(filtersBox, clearAllButton, filterCount, container);
    return;
  }

  showFiltersUI(filtersBox, filterBoxTitle, clearAllButton, allFilters, container);

  if (clearAllButton) {
    clearAllButton.onclick = event => {
      event.preventDefault();
      clearAllFilters();
    };
  }
};
