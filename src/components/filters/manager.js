import { setupRecipesCards } from "../cards/manager.js";
import { setupDropdowns } from "../dropdown/manager.js";
import { renderFilters, renderFilterTag } from "./render.js";
import {
  SearchInput,
  IngredientsInput,
  AppliancesInput,
  UstensilsInput,
} from "@/components/filters/filtersBy.js";
import { updateCounter } from "@/utils/string.js";

let allRecipes = [];
let filteredRecipes = [];

const filtersState = {
  mainSearchText: "",
  tags: {
    ingredients: new Set(),
    ustensils: new Set(),
    appliances: new Set(),
  },
};

const getFiltersElements = () => {
  return {
    root: document.getElementById("filters"),
    container: document.getElementById("filters-container"),
    count: document.getElementById("filters-count"),
    clearButton: document.getElementById("clear-filters-btn"),
    listsContainer: document.getElementById("filters-tags"),
    tag: document.querySelectorAll("#filter-tag-btn"),
  };
};

export const setupFilters = recipesData => {
  allRecipes = recipesData;
  filteredRecipes = recipesData;

  const { root } = getFiltersElements();
  const filtersAside = root || document.querySelector(".filters");

  if (filtersAside) {
    // inserts the filters block (header + tags container)
    filtersAside.innerHTML = renderFilters();
  }

  // Now the elements created by renderFilters() exist
  const { clearButton } = getFiltersElements();

  document.addEventListener("dropdown:itemToggled", onDropdownItemToggled);
  document.addEventListener("filters:searchChanged", e => onSearchChanged(e.detail.query));

  if (clearButton) {
    clearButton.addEventListener("click", clearAllFilters);
  }

  syncUI();
};

const applyAllFilters = recipes => {
  let result = recipes;
  result = SearchInput(result, filtersState.mainSearchText);
  result = IngredientsInput(result, filtersState.tags.ingredients);
  result = AppliancesInput(result, filtersState.tags.appliances);
  result = UstensilsInput(result, filtersState.tags.ustensils);
  return result;
};

const onSearchChanged = query => {
  filtersState.mainSearchText = query ?? "";
  syncUI();
};

const syncUI = () => {
  filteredRecipes = applyAllFilters(allRecipes);

  // 1. update cards
  setupRecipesCards(filteredRecipes);

  // 2. update dropdown options based on filtered recipes
  setupDropdowns(filteredRecipes);

  // Re-apply selected state in dropdowns
  restoreDropdownSelections();

  // 3. update tag chips display (optional)
  updateFilterTagsUI();

  // 4. update UI
  updateFiltersCount();
  updateFiltersVisibility();

  updateCounter(filteredRecipes.length);
};

const updateFiltersCount = () => {
  const { count } = getFiltersElements();
  if (!count) return;

  const total =
    filtersState.tags.ingredients.size +
    filtersState.tags.appliances.size +
    filtersState.tags.ustensils.size;

  count.textContent = `(${total})`;
};

const updateFiltersVisibility = () => {
  const { container, clearButton } = getFiltersElements();
  if (!container) return;

  const total =
    filtersState.tags.ingredients.size +
    filtersState.tags.appliances.size +
    filtersState.tags.ustensils.size;

  // Hide the entire filters container if no filters are active
  if (total === 0) {
    container.style.display = "none";
    if (clearButton) {
      clearButton.classList.remove("visible");
    }
  } else {
    container.style.display = "";
    if (clearButton) {
      clearButton.classList.add("visible");
    }
  }
};

const updateFilterTagsUI = () => {
  const { listsContainer } = getFiltersElements();
  if (!listsContainer) return;

  const activeFiltersArray = [
    ...[...filtersState.tags.ingredients].map(value => ({ value, type: "ingredients" })),
    ...[...filtersState.tags.appliances].map(value => ({ value, type: "appliances" })),
    ...[...filtersState.tags.ustensils].map(value => ({ value, type: "ustensils" })),
  ];

  listsContainer.innerHTML = activeFiltersArray
    .map(tag => renderFilterTag(tag.value, tag.type))
    .join("");

  // clicking a tag removes that filter
  listsContainer.querySelectorAll(".filter-tag").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.type;
      const value = button.dataset.value;
      const set = filtersState.tags[type];
      if (!set) return;

      set.delete(value);

      // unselect in the dropdown UI too
      const selector = `.dropdown-item[data-type="${type}"][data-value="${CSS.escape(value)}"]`;
      const dropdownItem = document.querySelector(selector);
      if (dropdownItem) {
        dropdownItem.classList.remove("selected");
        dropdownItem.querySelector(".dropdown-item-check")?.remove();
      }

      syncUI();
    });
  });
};

const onDropdownItemToggled = event => {
  const { type, value, selected } = event.detail;
  const set = filtersState.tags[type];
  if (!set) return;

  if (selected) {
    set.add(value);
  } else {
    set.delete(value);
  }

  syncUI();
};

const restoreDropdownSelections = () => {
  Object.entries(filtersState.tags).forEach(([type, set]) => {
    set.forEach(value => {
      const selector = `.dropdown-item[data-type="${type}"][data-value="${CSS.escape(value)}"]`;
      const itemButton = document.querySelector(selector);
      if (!itemButton) return;

      if (!itemButton.classList.contains("selected")) {
        itemButton.classList.add("selected");
      }

      const checkIcon = itemButton.querySelector(".dropdown-item-check");
      if (!checkIcon) {
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-check dropdown-item-check";
        icon.setAttribute("aria-hidden", "true");
        itemButton.appendChild(icon);
      }
    });
  });
};

const clearAllFilters = () => {
  // 1. Reset internal state
  filtersState.mainSearchText = "";
  filtersState.tags.ingredients.clear();
  filtersState.tags.appliances.clear();
  filtersState.tags.ustensils.clear();

  // 2. Clear main search input
  const mainSearchInput = document.getElementById("recipe-search");
  const clearSearchBtn = document.getElementById("clear-recipe-search");
  if (mainSearchInput) mainSearchInput.value = "";
  if (clearSearchBtn) clearSearchBtn.classList.add("hidden");

  // 3. Clear dropdown visual state
  document.querySelectorAll(".dropdown-item.selected").forEach(item => {
    item.classList.remove("selected");
    item.querySelector(".dropdown-item-check")?.remove();
  });

  // 4. Re-sync UI
  syncUI();
};
