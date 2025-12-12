import { dropdownTypes } from "@components/dropdowns/manager.js";
import { capitalize } from "@utils/normalize.js";

const renderFilterTag = ({ type, value, label, id }) => `
  <li id="${id}" role="option">
    <button type="button" class="filter-tag" id="tag-remove-button-${id}" data-type="${type}" data-value="${value}" aria-label="Retirer le tag ${label}">
      <span>${label}</span>
      <i aria-hidden="true">×</i>
    </button>
  </li>
`;

export const filtersElements = () => ({
  section: document.getElementById("filters"),
  container: document.getElementById("tags-container"),
  count: document.getElementById("tags-count-text"),
  clearBtn: document.getElementById("clear-tags-button"),
  tagsList: document.getElementById("tags-list"),
});

const getActiveFilterSets = filtersState => {
  const result = {};
  if (Array.isArray(dropdownTypes)) {
    dropdownTypes.forEach(type => {
      const set = filtersState[type];
      if (set instanceof Set) result[type] = set;
    });
  }
  return result;
};

export const filtersUi = {
  updateTagList(filtersState) {
    const { tagsList } = filtersElements();
    if (!tagsList) return;
    const activeSets = getActiveFilterSets(filtersState);
    const fragment = document.createDocumentFragment();

    Object.entries(activeSets).forEach(([type, set]) => {
      set.forEach(value => {
        const label = capitalize(value);
        const id = `filter-tag-${type}-${value}`;
        const li = document.createElement("li");

        li.innerHTML = renderFilterTag({ type, value, label, id });
        fragment.appendChild(li);
      });
    });

    tagsList.innerHTML = "";
    tagsList.appendChild(fragment);
  },

  updateFiltersCounter(filtersState) {
    const { section, count, clearBtn } = filtersElements();
    if (!count || !clearBtn) return;

    const activeSets = getActiveFilterSets(filtersState);
    const total = Object.values(activeSets).reduce((sum, set) => sum + set.size, 0);

    const hasFilters = total > 0;

    section?.classList.toggle("has-filters", hasFilters);
    clearBtn?.classList.toggle("visible", hasFilters);
    clearBtn?.setAttribute("aria-hidden", String(!hasFilters));

    if (total === 0) {
      count.textContent = "Aucun filtre sélectionné";
    } else if (total === 1) {
      count.textContent = "1 filtre sélectionné";
    } else {
      count.textContent = `${total} filtres sélectionnés`;
    }

    count.setAttribute("aria-hidden", String(!hasFilters));
  },
};
