import { showDropdownsSkeletons, hideDropdownsSkeletons } from "../skeletons.js";
import { renderDropdownsSkeletons } from "../renderSqueletons.js";
import {
  ingredientsDropdown,
  ustensilsDropdown,
  appliancesDropdown,
  renderEmptyStateItem,
} from "./render.js";
import { cleanupDuplicatedItems, normalizeString } from "@/utils/string.js";

export let currentDropdownsData = {};
let dropdownTypes = [];
let isDropdownHandlersInitialized = false;
const ARIA_HIDDEN = "aria-hidden";

const getDropdownsElements = () => ({
  root: document.getElementById("dropdowns-container"),
});

// Get dropdown (single-type) elements
const getDropdownElements = dropdownType => ({
  button: document.getElementById(`dropdown-${dropdownType}-button`),
  searchInput: document.getElementById(`search-${dropdownType}`),
  searchIcon: document.getElementById(`search-icon-${dropdownType}`),
  clearButton: document.getElementById(`clear-search-${dropdownType}`),
  menu: document.getElementById(`menu-${dropdownType}`),
  container: document.getElementById(`dropdown-${dropdownType}-container`),
  backdrop: document.getElementById(`dropdown-${dropdownType}-backdrop`),
  itemsList: document.getElementById(`dropdown-${dropdownType}-list`),
});

const getDropdownListElements = dropdownType => {
  const { itemsList } = getDropdownElements(dropdownType);
  if (!itemsList) return null;
  const itemsElements = [...itemsList.querySelectorAll(".dropdown-item")];
  const emptyStateElement = document.getElementById("dropdown-empty-state");
  const searchWrapperElement = document.getElementById(`dropdown-${dropdownType}-search`);
  return { itemsElements, emptyStateElement, searchWrapperElement };
};

// Collect all ingredients from all recipes for dropdowns data
export const buildDropdownsData = recipesData => {
  let dropdownsData = {};

  const allIngredients = recipesData
    .flatMap(recipe => recipe?.ingredients?.map(ingredient => ingredient?.ingredient) || [])
    .filter(Boolean);

  const allUstensils = recipesData.flatMap(recipe => recipe?.ustensils || []).filter(Boolean);
  const allAppliances = recipesData.map(recipe => recipe?.appliance).filter(Boolean);

  dropdownsData = {
    ingredients: cleanupDuplicatedItems(allIngredients),
    ustensils: cleanupDuplicatedItems(allUstensils),
    appliances: cleanupDuplicatedItems(allAppliances),
  };

  return dropdownsData;
};

export const setupDropdowns = recipesData => {
  if (!recipesData) return;

  const { root } = getDropdownsElements();
  if (!root) return;

  if (root.querySelector(".dropdown-container")) {
    showDropdownsSkeletons();
  } else {
    root.innerHTML = renderDropdownsSkeletons();
  }

  currentDropdownsData = buildDropdownsData(recipesData);
  dropdownTypes = Object.keys(currentDropdownsData);

  root.innerHTML =
    // Render dropdowns content
    ingredientsDropdown(currentDropdownsData.ingredients || []) +
    ustensilsDropdown(currentDropdownsData.ustensils || []) +
    appliancesDropdown(currentDropdownsData.appliances || []);

  hideDropdownsSkeletons();
  setupGlobalListeners(dropdownTypes);
  dropdownTypes.forEach(dropdownType => {
    // Initialize dropdown lists content
    updateDropdownList(dropdownType);
  });
};

const setupGlobalListeners = dropdownTypes => {
  const { root } = getDropdownsElements();
  if (!root) return;

  dropdownTypes.forEach(dropdownType => {
    const { searchInput, backdrop, itemsList, button, clearButton } =
      getDropdownElements(dropdownType);

    if (searchInput) {
      searchInput.addEventListener("input", () => updateDropdownContent(dropdownType));
    }

    if (backdrop) {
      backdrop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(dropdownType, false);
      });
    }

    if (itemsList) {
      itemsList.addEventListener("click", event => {
        const clickedButton = event.target.closest(".item-btn");
        if (!clickedButton) return;

        event.preventDefault();
        event.stopPropagation();
        manageItemsClicks(clickedButton);
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", event => {
        searchInput.value = "";
        event.preventDefault();
        event.stopPropagation();
        updateDropdownContent(dropdownType);
      });
    }

    if (button) {
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(dropdownType);
      });
    }
  });
  // Setup global handlers
  setupDropdownHandlers();
};

export const setupDropdownHandlers = () => {
  if (isDropdownHandlersInitialized) return;
  isDropdownHandlersInitialized = true;

  // Escape key closes all dropdowns
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

  // Click outside any dropdown closes them
  document.addEventListener("click", event => {
    const clickedElement = event.target;

    const isClickInsideDropdown = dropdownTypes.some(type => {
      const { container } = getDropdownElements(type);
      return container && container.contains(clickedElement);
    });

    if (!isClickInsideDropdown) {
      closeAllDropdowns();
    }
  });
};

// Helper for Filters Manager too
const closeAllDropdowns = () => {
  dropdownTypes.forEach(type => toggleDropdown(type, false));
};

export const getOpenDropdownType = () => {
  return (
    dropdownTypes.find(type => {
      const { container } = getDropdownElements(type);
      return container && container.classList.contains("open");
    }) || null
  );
};

// Toggle a specific dropdown to handle open/close state
export const toggleDropdown = (targetType, desiredOpen = null) => {
  dropdownTypes.forEach(type => {
    const { container, button } = getDropdownElements(type);
    if (!container || !button) return;

    const isTargetedType = type === targetType;
    const isCurrentlyOpen = getOpenDropdownType() === type;
    const shouldOpen = desiredOpen === null ? !isCurrentlyOpen : desiredOpen;
    const needsToOpen = isTargetedType ? shouldOpen : false;

    applyDropdownState(type, needsToOpen);
  });
};

const applyDropdownState = (type, needsToOpen) => {
  const { container, button, backdrop, menu } = getDropdownElements(type);

  container.classList.toggle("open", needsToOpen);
  button.classList.toggle("active", needsToOpen);
  button.setAttribute("aria-expanded", String(needsToOpen));

  backdrop?.setAttribute(ARIA_HIDDEN, String(!needsToOpen));
  menu?.setAttribute(ARIA_HIDDEN, String(!needsToOpen));
};

// Update dropdown content based on search
export const updateDropdownContent = type => {
  const { searchInput, searchIcon, clearButton } = getDropdownElements(type);
  if (!searchInput) return;

  const hasQuery = !!searchInput.value.trim();
  searchIcon?.classList.toggle("hidden", hasQuery);
  clearButton?.classList.toggle("hidden", !hasQuery);
  updateDropdownList(type);
};

export const manageItemsClicks = itemButton => {
  if (!itemButton) return;

  const isSelected = itemButton.classList.toggle("selected");
  itemButton.setAttribute("aria-pressed", String(isSelected));

  document.dispatchEvent(
    new CustomEvent("dropdown:itemToggled", {
      detail: {
        type: itemButton.dataset.type,
        value: itemButton.dataset.value,
        selected: isSelected,
      },
    }),
  );
};

// Update dropdown list content
const updateDropdownList = type => {
  const { searchInput, itemsList } = getDropdownElements(type);
  const listEls = getDropdownListElements(type);

  if (!searchInput || !itemsList || !listEls) return;

  const { itemsElements, emptyStateElement, searchWrapperElement } = listEls;
  const query = normalizeString(searchInput.value || "");

  // Filter + show/hide items
  const visibleItems = itemsElements.filter(item => {
    const labelEl = item.querySelector(".dropdown-item-label, span");
    const label = labelEl?.textContent || "";
    const matches = !query || normalizeString(label).includes(query);
    const listItem = item.closest("li");

    if (listItem) {
      listItem.style.display = matches ? "" : "none";
    }

    return matches;
  });

  // Empty state
  let emptyElement = emptyStateElement;
  const shouldShowEmpty = visibleItems.length === 0;

  if (shouldShowEmpty && !emptyElement) {
    itemsList.insertAdjacentHTML("beforeend", renderEmptyStateItem());
    emptyElement = itemsList.querySelector(".dropdown-empty-state");
  }

  if (emptyElement) {
    emptyElement.style.display = shouldShowEmpty ? "" : "none";
  }

  // Show/hide the search bar depending on whether there are any items at all
  if (searchWrapperElement) {
    searchWrapperElement.classList.toggle("show", itemsElements.length > 0);
  }
};
