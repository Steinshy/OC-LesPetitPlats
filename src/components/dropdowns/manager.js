// src/components/dropdowns/manager.js

import {
  dropdownElements,
  dropdownSearchElements,
  dropdownListElements,
  dropdownsElements,
} from "@components/dropdowns/elements.js";
import { closeDropdown, toggleDropdown } from "@components/dropdowns/interactions.js";
import { renderEmptyStateItem, renderDropdownItem } from "@components/dropdowns/render.js";
import { currentDropdownsData } from "@components/dropdowns/setup.js";
import { filtersEngine } from "@components/filters/engine.js";
import { filtersState } from "@components/filters/state.js";
import { isScrolledPastHeader } from "@components/scroll.js";
import { ariaHidden, isMobile } from "@utils/config.js";
import { eventBus } from "@utils/eventBus.js";

export const stickyDropdowns = () => {
  const { section } = dropdownsElements();
  if (!section) return;

  const shouldStick = isScrolledPastHeader();
  const sheetOpen = document.body.classList.contains("dropdown-open");

  const clearInlineStyles = () => {
    section.style.position = "";
    section.style.top = "";
    section.style.left = "";
    section.style.right = "";
    section.style.width = "";
  };

  if (isMobile()) {
    if (sheetOpen || !shouldStick) {
      section.classList.remove("is-sticky");
      clearInlineStyles();
      return;
    }

    section.classList.add("is-sticky");
    section.style.position = "fixed";
    section.style.top = "0px";
    section.style.left = "0px";
    section.style.right = "0px";
    section.style.width = "100%";
    return;
  }

  section.classList.toggle("is-sticky", shouldStick);

  if (!shouldStick) {
    clearInlineStyles();
    return;
  }

  const main = document.querySelector(".main");
  if (!main) return;

  const rect = main.getBoundingClientRect();
  section.style.position = "fixed";
  section.style.top = "0px";
  section.style.left = `${rect.left}px`;
  section.style.right = "";
  section.style.width = `${rect.width}px`;
};

export const setupDropdownListeners = dropdownTypes => {
  const cleanups = [];

  dropdownTypes.forEach(currentType => {
    const { searchInput, searchClear } = dropdownSearchElements(currentType);
    const { backdrop, button } = dropdownElements(currentType);
    const { itemsList } = dropdownListElements(currentType);

    const onSearchInput = () => {
      updateDropdownContent(currentType);
    };

    const onBackdropClick = event => {
      event.preventDefault();
      event.stopPropagation();
      closeDropdown(currentType);
    };

    const onItemClick = event => {
      const clickedButton = event.target.closest(".item-btn");
      if (!clickedButton) return;

      event.preventDefault();
      event.stopPropagation();

      eventBus.emit("dropdown:itemToggled", {
        type: clickedButton.dataset.type,
        value: clickedButton.dataset.value,
      });

      if (isMobile()) {
        closeDropdown(currentType);
      }
    };

    const onClearClick = () => {
      if (!searchInput) return;
      searchInput.value = "";
      searchInput.focus();
      updateDropdownContent(currentType);
    };

    const onButtonClick = event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      toggleDropdown(currentType);
    };

    if (searchInput) {
      searchInput.addEventListener("input", onSearchInput);
      cleanups.push(() => searchInput.removeEventListener("input", onSearchInput));
    }

    if (backdrop) {
      backdrop.addEventListener("click", onBackdropClick);
      cleanups.push(() => backdrop.removeEventListener("click", onBackdropClick));
    }

    if (itemsList) {
      itemsList.addEventListener("click", onItemClick);
      cleanups.push(() => itemsList.removeEventListener("click", onItemClick));
    }

    if (searchClear) {
      searchClear.addEventListener("click", onClearClick);
      cleanups.push(() => searchClear.removeEventListener("click", onClearClick));
    }

    if (button) {
      button.addEventListener("click", onButtonClick);
      cleanups.push(() => button.removeEventListener("click", onButtonClick));
    }
  });

  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
};

export const updateDropdownContent = type => {
  const { searchWrapper, searchInput, searchClear, searchSubmit } = dropdownSearchElements(type);
  if (!searchInput) return;

  const hasQuery = !!searchInput.value.trim();
  searchClear?.classList.toggle("hidden", !hasQuery);
  searchSubmit?.classList.toggle("hidden", hasQuery);
  searchWrapper?.classList.toggle("has-clear-btn", hasQuery);

  updateDropdownList(type);
};

export const updateDropdownList = type => {
  const { menu, itemsList } = dropdownListElements(type);
  const { searchInput, searchWrapper } = dropdownSearchElements(type);

  if (!menu || !itemsList) return;

  const allItems = currentDropdownsData[type] || [];
  const query = searchInput?.value?.trim() ?? "";
  const filtered = filtersEngine.filterDropdownItems(allItems, query);
  const countElement = document.getElementById(`dropdown-${type}-count`);

  if (countElement) {
    countElement.textContent = allItems.length > 0 ? allItems.length : "";
    countElement.classList.toggle("visible", allItems.length > 0);
  }

  if (filtered.length > 0) {
    const selectedSet = filtersState[type];
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

  menu.setAttribute(ariaHidden, "false");

  if (searchWrapper) {
    searchWrapper.classList.toggle("show", allItems.length > 0);
  }
};
