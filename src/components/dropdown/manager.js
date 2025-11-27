// src/components/dropdown/manager.js

import { lockBodyScroll, unlockBodyScroll } from "@components/bodyScroll.js";
import { buildDropdownsData } from "@components/dropdown/data.js";

import {
  getDropdownElements,
  getDropdownSearchElements,
  getDropdownListElements,
  getDropdownsContainer,
} from "@components/dropdown/elements.js";

import {
  ingredientsDropdown,
  ustensilsDropdown,
  appliancesDropdown,
  renderEmptyStateItem,
  renderDropdownItem,
} from "@components/dropdown/render.js";

import { filterDropdownItems } from "@components/filters/recipeFilters.js";
import { updateVisibility } from "@components/scrollToTop.js";
import { dropdownsContainerSkeleton } from "@components/skeletonsManager.js";

export let currentDropdownsData = {};
let dropdownTypes = [];
const ARIA_HIDDEN = "aria-hidden";

// --------------------------------------------------
// SETUP MAIN DROPDOWNS
// --------------------------------------------------

export const setupDropdowns = recipesData => {
  if (!recipesData) return;

  const { container } = getDropdownsContainer();
  if (!container) return;

  const dropdownsData = buildDropdownsData(recipesData);
  currentDropdownsData = dropdownsData.dropdowns || {};
  dropdownTypes = Object.keys(currentDropdownsData) || [];

  container.innerHTML = ingredientsDropdown() + ustensilsDropdown() + appliancesDropdown();

  dropdownsContainerSkeleton().hide();

  setupDropdownListeners(dropdownTypes);

  dropdownTypes.forEach(type => {
    updateDropdownList(type);
  });
};

// --------------------------------------------------
// LISTENERS
// --------------------------------------------------

const setupDropdownListeners = dropdownTypes => {
  dropdownTypes.forEach(currentType => {
    const { searchInput, searchClear } = getDropdownSearchElements(currentType);
    const { backdrop, button } = getDropdownElements(currentType);
    const { itemsList } = getDropdownListElements(currentType);

    // Search input
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        updateDropdownContent(currentType);
      });
    }

    // Backdrop
    if (backdrop) {
      backdrop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        closeDropdown(currentType);
      });
    }

    // Click on item
    if (itemsList) {
      itemsList.addEventListener("click", event => {
        const clickedButton = event.target.closest(".item-btn");
        if (!clickedButton) return;

        event.preventDefault();
        event.stopPropagation();

        const isSelected = clickedButton.classList.toggle("selected");
        clickedButton.setAttribute("aria-pressed", String(isSelected));

        document.dispatchEvent(
          new CustomEvent("dropdown:itemToggled", {
            detail: {
              type: clickedButton.dataset.type,
              value: clickedButton.dataset.value,
              selected: isSelected,
            },
          }),
        );
      });
    }

    // Clear search
    if (searchClear) {
      searchClear.addEventListener("click", () => {
        if (!searchInput) return;
        searchInput.value = "";
        searchInput.focus();
        updateDropdownContent(currentType);
      });
    }

    // Dropdown button open/close
    if (button) {
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(currentType);
      });
    }
  });
};

// --------------------------------------------------
// DROPDOWN STATE CONTROL
// --------------------------------------------------

const closeAllDropdowns = () => {
  if (!dropdownTypes?.length) return;

  dropdownTypes.forEach(type => {
    const { container, button, backdrop, menu } = getDropdownElements(type);
    if (!container || !button) return;

    container.classList.remove("open");
    button.classList.remove("active");
    button.setAttribute("aria-expanded", "false");

    backdrop?.setAttribute(ARIA_HIDDEN, "true");
    menu?.setAttribute(ARIA_HIDDEN, "true");
  });

  unlockBodyScroll();
  updateVisibility();
};

const openDropdown = type => {
  const { container, button, backdrop, menu } = getDropdownElements(type);
  if (!container || !button) return;

  container.classList.add("open");
  button.classList.add("active");
  button.setAttribute("aria-expanded", "true");

  backdrop?.setAttribute(ARIA_HIDDEN, "false");
  menu?.setAttribute(ARIA_HIDDEN, "false");

  lockBodyScroll();

  const scrollToTopButton = document.getElementById("scroll-to-top");
  if (scrollToTopButton) {
    scrollToTopButton.classList.remove("show");
    scrollToTopButton.setAttribute("aria-hidden", "true");
  }
};

const closeDropdown = type => {
  const { container } = getDropdownElements(type);
  if (!container?.classList.contains("open")) return;

  closeAllDropdowns();
};

const toggleDropdown = type => {
  const { container } = getDropdownElements(type);
  const willOpen = !container?.classList.contains("open");

  if (willOpen) {
    closeAllDropdowns();
    openDropdown(type);
  } else {
    closeAllDropdowns();
  }
};

// --------------------------------------------------
// GLOBAL ESC / CLICK OUTSIDE
// --------------------------------------------------

const handleEscapeKey = event => {
  if (event.key === "Escape") closeAllDropdowns();
};

const handleDocumentClick = event => {
  const clickedElement = event.target;

  const isInside = dropdownTypes.some(type => {
    const { container } = getDropdownElements(type);
    return container && container.contains(clickedElement);
  });

  if (!isInside) {
    closeAllDropdowns();
  }
};

document.addEventListener("keydown", handleEscapeKey);
document.addEventListener("click", handleDocumentClick);

// --------------------------------------------------
// LIST RENDERING
// --------------------------------------------------

export const updateDropdownContent = type => {
  const { searchInput, searchClear } = getDropdownSearchElements(type);
  if (!searchInput) return;

  const hasQuery = !!searchInput.value.trim();
  searchClear?.classList.toggle("hidden", !hasQuery);

  updateDropdownList(type);
};

const updateDropdownList = type => {
  const { menu, itemsList } = getDropdownListElements(type);
  const { searchInput, searchWrapper } = getDropdownSearchElements(type) || {};

  if (!menu || !itemsList) return;

  const allItems = currentDropdownsData[type] || [];
  const query = searchInput?.value?.trim() ?? "";

  const filtered = filterDropdownItems(allItems, query);

  if (filtered.length > 0) {
    const html = filtered
      .map(item => {
        const label = item?.label ?? item;
        const value = item?.value ?? item;

        return renderDropdownItem(
          type,
          { label, value },
          `dropdown-item-${type}-${value}`,
          `item-btn-${type}-${value}`,
        );
      })
      .join("");

    itemsList.innerHTML = html;
  } else {
    itemsList.innerHTML = renderEmptyStateItem(type);
  }

  menu.setAttribute(ARIA_HIDDEN, "false");

  if (searchWrapper) {
    searchWrapper.classList.toggle("show", allItems.length > 0);
  }
};
