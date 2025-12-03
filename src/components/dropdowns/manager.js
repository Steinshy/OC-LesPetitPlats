// src/components/dropdowns/manager.js

import { buildDropdownsData } from "@components/dropdowns/data.js";
import {
  dropdownElements,
  dropdownSearchElements,
  dropdownListElements,
  dropdownsElements,
} from "@components/dropdowns/elements.js";
import {
  ingredientsDropdown,
  utensilsDropdown,
  appliancesDropdown,
  renderEmptyStateItem,
  renderDropdownItem,
} from "@components/dropdowns/render.js";
import { filtersState } from "@components/filters/state.js";
import { isScrolledPastHeader } from "@components/header.js";
import { lockScroll, unlockScroll } from "@components/scrollLock.js";
import { updateVisibility as scrollToTopVisibility } from "@components/scrollToTop.js";
import { dropdownsSkeletons } from "@components/skeletons/manager.js";
import { isMobile } from "@utils/device.js";
import { filterDropdownItems } from "@utils/filterEngine.js";

export let currentDropdownsData = {};
export let dropdownTypes = [];
const ARIA_HIDDEN = "aria-hidden";

export const setupDropdowns = recipesData => {
  if (!recipesData) return;

  const { container } = dropdownsElements();
  if (!container) return;

  unlockScroll();

  const dropdownsData = buildDropdownsData(recipesData);
  currentDropdownsData = dropdownsData.dropdowns || {};
  dropdownTypes = Object.keys(currentDropdownsData) || [];

  dropdownsSkeletons().show();
  container.innerHTML = ingredientsDropdown([]) + utensilsDropdown([]) + appliancesDropdown([]);
  dropdownsSkeletons().hide();
  setupDropdownListeners(dropdownTypes);

  dropdownTypes.forEach(type => {
    updateDropdownList(type);
  });
};

const setupDropdownListeners = dropdownTypes => {
  dropdownTypes.forEach(currentType => {
    const { searchInput, searchClear } = dropdownSearchElements(currentType);
    const { backdrop, button } = dropdownElements(currentType);
    const { itemsList } = dropdownListElements(currentType);

    // Search
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        updateDropdownContent(currentType);
      });
    }

    // Backdrop click
    if (backdrop) {
      backdrop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        closeDropdown(currentType);
      });
    }

    // Item click
    if (itemsList) {
      itemsList.addEventListener("click", event => {
        const clickedButton = event.target.closest(".item-btn");
        if (!clickedButton) return;

        event.preventDefault();
        event.stopPropagation();

        const isSelected = clickedButton.classList.toggle("selected");
        clickedButton.setAttribute("aria-pressed", String(isSelected));
        const listItem = clickedButton.closest("li[role='option']");
        if (listItem) {
          listItem.setAttribute("aria-selected", String(isSelected));
        }

        document.dispatchEvent(
          new CustomEvent("dropdown:itemToggled", {
            detail: {
              type: clickedButton.dataset.type,
              value: clickedButton.dataset.value,
              selected: isSelected,
            },
          }),
        );

        if (isMobile()) {
          closeDropdown(currentType);
        }
      });
    }

    // Clear
    if (searchClear) {
      searchClear.addEventListener("click", () => {
        if (!searchInput) return;
        searchInput.value = "";
        searchInput.focus();
        updateDropdownContent(currentType);
      });
    }

    // Toggle button
    if (button) {
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(currentType);
      });
    }
  });
};

const openDropdown = type => {
  const { container, button, backdrop, menu } = dropdownElements(type);
  if (!container || !button) return;

  container.classList.add("open");
  button.classList.add("active");
  button.setAttribute("aria-expanded", "true");

  backdrop?.setAttribute(ARIA_HIDDEN, "false");
  menu?.setAttribute(ARIA_HIDDEN, "false");

  document.body.classList.add("dropdown-open");

  lockScroll();
  scrollToTopVisibility();
  document.dispatchEvent(new CustomEvent("dropdown:opened"));
};

const closeAllDropdowns = () => {
  if (dropdownTypes?.length) {
    dropdownTypes.forEach(type => {
      const { container, button, backdrop, menu } = dropdownElements(type);
      if (!container || !button) return;

      container.classList.remove("open");
      button.classList.remove("active");
      button.setAttribute("aria-expanded", "false");

      backdrop?.setAttribute(ARIA_HIDDEN, "true");
      menu?.setAttribute(ARIA_HIDDEN, "true");
    });
  }

  document.body.classList.remove("dropdown-open");

  unlockScroll();
  scrollToTopVisibility();
  document.dispatchEvent(new CustomEvent("dropdown:closed"));
};

const closeDropdown = type => {
  const { container } = dropdownElements(type);
  if (!container?.classList.contains("open")) return;

  closeAllDropdowns();
};

const toggleDropdown = type => {
  const { container } = dropdownElements(type);
  const willOpen = !container?.classList.contains("open");

  if (willOpen) {
    closeAllDropdowns();
    openDropdown(type);
  } else {
    closeAllDropdowns();
  }
};

export const stickyDropdowns = () => {
  const { section } = dropdownsElements();
  if (!section) return;
  section.classList.toggle("is-sticky", isScrolledPastHeader());
};

const handlerInteraction = {
  escapeKey: event => {
    if (event.key === "Escape") closeAllDropdowns();
  },

  click: event => {
    const clickedElement = event.target;

    const isInside = dropdownTypes.some(type => {
      const { container } = dropdownElements(type);
      return container && container.contains(clickedElement);
    });

    if (!isInside) {
      closeAllDropdowns();
    }
  },
};

document.addEventListener("keydown", handlerInteraction.escapeKey);
document.addEventListener("click", handlerInteraction.click);

export const updateDropdownContent = type => {
  const { searchWrapper, searchInput, searchClear, searchSubmit } = dropdownSearchElements(type);
  if (!searchInput) return;

  const hasQuery = !!searchInput.value.trim();
  searchClear?.classList.toggle("hidden", !hasQuery);
  searchSubmit?.classList.toggle("hidden", hasQuery);
  searchWrapper?.classList.toggle("has-clear-btn", hasQuery);

  updateDropdownList(type);
};

const updateDropdownCount = (type, count) => {
  const countElement = document.getElementById(`dropdown-${type}-count`);
  if (countElement) {
    countElement.textContent = count > 0 ? count : "";
    countElement.classList.toggle("visible", count > 0);
  }
};

const updateDropdownList = type => {
  const { menu, itemsList } = dropdownListElements(type);
  const { searchInput, searchWrapper } = dropdownSearchElements(type) || {};

  if (!menu || !itemsList) return;

  const allItems = currentDropdownsData[type] || [];
  const query = searchInput?.value?.trim() ?? "";

  // Update count
  updateDropdownCount(type, allItems.length);

  const filtered = filterDropdownItems(allItems, query);

  if (filtered.length > 0) {
    const selectedSet = filtersState.filters[type];
    const html = filtered
      .map(item => {
        const label = item?.label ?? item;
        const value = item?.value ?? item;
        const isSelected = selectedSet instanceof Set && selectedSet.has(value);

        return renderDropdownItem(
          type,
          { label, value },
          `dropdown-item-${type}-${value}`,
          `item-btn-${type}-${value}`,
          isSelected,
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
