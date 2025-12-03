// src/components/filters/manager.js
import {
  getDropdownItemSelector,
  getSelectedDropdownItems,
} from "@components/dropdowns/elements.js";
import { dropdownTypes } from "@components/dropdowns/manager.js";
import { buildActiveFilters, getFilterCount } from "@components/filters/data.js";
import { filtersElements } from "@components/filters/elements.js";
import { renderFilterTag } from "@components/filters/render.js";
import { filtersState } from "@components/filters/state.js";
import { searchElements } from "@components/search/elements.js";
import { applyAllFilters } from "@utils/filterEngine.js";
import { normalizeString } from "@utils/normalize.js";
import { parseURLState, clearURLState } from "@utils/urlState.js";

const ARIA_HIDDEN = "aria-hidden";

const updateDropdownItem = (item, selected) => {
  item.classList.toggle("selected", selected);
  item.setAttribute("aria-pressed", String(selected));
  item.closest("li[role='option']")?.setAttribute("aria-selected", String(selected));
};

const searchFromState = () => {
  const { input, clear, submit } = searchElements();
  if (!input || !filtersState.filters.search) return;

  input.value = filtersState.filters.search;
  clear?.classList.toggle("hidden", !filtersState.filters.search);
  submit?.classList.toggle("hidden", !!filtersState.filters.search);
};

const onItemToggled = event => {
  const { type, value, selected } = event.detail;
  const set = filtersState.filters[type];
  if (!set) return;

  selected ? set.add(value) : set.delete(value);
  syncUI();
};

const onSearchChanged = query => {
  filtersState.filters.search = query ?? "";
  syncUI();
};

const onPopState = () => {
  const urlFilters = parseURLState();
  filtersState.filters.search = urlFilters.search ?? "";
  filtersState.filters.ingredients = new Set(urlFilters.ingredients || []);
  filtersState.filters.appliances = new Set(urlFilters.appliances || []);
  filtersState.filters.utensils = new Set(urlFilters.utensils || []);
  searchFromState();
  syncUI();
};

const updateContainer = () => {
  const { section, count, clearBtn } = filtersElements();
  if (!count || !clearBtn) return;

  const total = getFilterCount(filtersState.filters);
  const hasFilters = total > 0;
  section?.classList.toggle("has-filters", hasFilters);
  clearBtn.classList.toggle("visible", hasFilters);
  clearBtn.setAttribute(ARIA_HIDDEN, String(!hasFilters));
  const text =
    total === 0
      ? "Aucun filtre sélectionné"
      : total > 1
        ? `${total} filtres sélectionnés`
        : `${total} filtre sélectionné`;
  count.textContent = text;
  count.setAttribute(ARIA_HIDDEN, String(!hasFilters));
};

const updateTags = () => {
  const { tagsList } = filtersElements();
  if (!tagsList) return;

  const activeFilters = buildActiveFilters(filtersState.filters);
  const template = document.createElement("template");
  template.innerHTML = activeFilters.map(renderFilterTag).join("");

  const fragment = document.createDocumentFragment();
  [...template.content.children].forEach(li => {
    const button = li.querySelector(".filter-tag");
    if (button) {
      button.addEventListener("click", () => removeTag(button.dataset.type, button.dataset.value));
      fragment.appendChild(li);
    }
  });

  tagsList.innerHTML = "";
  tagsList.appendChild(fragment);
};

const removeTag = (type, value) => {
  const { tagsList } = filtersElements();
  const tagId = `filter-tag-${type}-${normalizeString(value)}`;
  const tagElement = tagsList?.querySelector(`#${tagId}`)?.closest("li");

  if (tagElement) {
    tagElement.classList.add("removing");
    setTimeout(() => {
      filtersState.filters[type]?.delete(value);
      const item = document.querySelector(getDropdownItemSelector(type, value));
      if (item) updateDropdownItem(item, false);
      syncUI();
    }, 250);
  } else {
    filtersState.filters[type]?.delete(value);
    const item = document.querySelector(getDropdownItemSelector(type, value));
    if (item) updateDropdownItem(item, false);
    syncUI();
  }
};

const syncDropdownSelections = () => {
  dropdownTypes.forEach(type => {
    const set = filtersState.filters[type];
    if (!(set instanceof Set)) return;

    set.forEach(value => {
      const item = document.querySelector(getDropdownItemSelector(type, value));
      if (item && !item.classList.contains("selected")) {
        updateDropdownItem(item, true);
      }
    });
  });
};

const syncUI = () => {
  requestAnimationFrame(() => {
    filtersState.filteredRecipes = applyAllFilters(filtersState.allRecipes, filtersState.filters);
    updateContainer();
    updateTags();
    syncDropdownSelections();

    requestAnimationFrame(() => {
      document.dispatchEvent(
        new CustomEvent("filters:stateChanged", {
          detail: { filteredRecipes: filtersState.filteredRecipes, filters: filtersState.filters },
        }),
      );
    });
  });
};

const clearAll = () => {
  const { allTags } = filtersElements();

  if (allTags && allTags.length > 0) {
    allTags.forEach(li => li.classList.add("removing"));
    setTimeout(() => {
      filtersState.filters.search = "";
      filtersState.filters.ingredients.clear();
      filtersState.filters.appliances.clear();
      filtersState.filters.utensils.clear();

      const { input, clear, submit } = searchElements();
      if (input) {
        input.value = "";
        clear?.classList.add("hidden");
        submit?.classList.remove("hidden");
      }

      getSelectedDropdownItems().forEach(item => updateDropdownItem(item, false));
      clearURLState();
      syncUI();
    }, 250);
  } else {
    filtersState.filters.search = "";
    filtersState.filters.ingredients.clear();
    filtersState.filters.appliances.clear();
    filtersState.filters.utensils.clear();

    const { input, clear, submit } = searchElements();
    if (!input) {
      input.value = "";
      clear.classList.add("hidden");
      submit.classList.remove("hidden");
    }
    getSelectedDropdownItems().forEach(item => updateDropdownItem(item, false));
    clearURLState();
    syncUI();
  }
};

const setupListeners = () => {
  filtersElements().clearBtn?.addEventListener("click", clearAll);
  document.addEventListener("dropdown:itemToggled", onItemToggled);
  document.addEventListener("filters:searchChanged", event => onSearchChanged(event.detail.query));
  window.addEventListener("popstate", onPopState);
};

export const setupFilters = recipesData => {
  if (!recipesData) return;

  filtersState.allRecipes = Array.isArray(recipesData) ? recipesData : [];
  const { container } = filtersElements();
  if (!container) return;

  searchFromState();
  setupListeners();
  syncUI();
  filtersState.isInitialLoad = false;
};
