import { renderItem, renderEmptyState } from "./render.js";
import { getFilteredItems, getDropdownElements } from "./utils.js";

export const toggleDropdown = (type, isOpen) => {
  const button = document.getElementById(`dropdown-${type}-button`);
  const menu = document.getElementById(`menu-${type}`);
  const container = document.querySelector(`.dropdown-container[data-type="${type}"]`);
  const backdrop = container?.querySelector(".dropdown-backdrop");
  if (!button || !menu || !container) return;

  button.classList.toggle("active", isOpen);
  button.setAttribute("aria-expanded", isOpen);
  container.classList.toggle("open", isOpen);

  if (window.innerWidth <= 640) {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  // Handle backdrop
  if (backdrop) {
    backdrop.setAttribute("aria-hidden", !isOpen);
  }

  if (!isOpen) {
    const focusedElement = menu.querySelector(":focus");
    if (focusedElement) {
      focusedElement.blur();
      button.focus();
    }
    menu.setAttribute("aria-hidden", "true");
  } else {
    menu.setAttribute("aria-hidden", "false");
  }
};

export const closeAllDropdowns = () => {
  document.querySelectorAll(".dropdown-container").forEach(container => {
    toggleDropdown(container.dataset.type, false);
  });
};

export const updateDropdownList = (
  type,
  items,
  onFilterChange,
  activeFilters,
  hasSearchQuery = false,
) => {
  const listElement = document.getElementById(`dropdown-${type}-list`);
  if (!listElement) return;
  const selectedSet = activeFilters?.[type] || new Set();

  if (items.length === 0 && hasSearchQuery) {
    listElement.innerHTML = renderEmptyState();
  } else {
    listElement.innerHTML = items
      .map(item => renderItem(item, type, selectedSet.has(item)))
      .join("");

    listElement.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", event => {
        event.preventDefault();
        item.blur();
        const wasSelected = item.classList.contains("selected");
        const textSpan = item.querySelector("span");
        const checkIcon = item.querySelector(".dropdown-item-check");

        item.classList.toggle("selected", !wasSelected);

        if (!wasSelected && !checkIcon && textSpan) {
          const icon = document.createElement("i");
          icon.className = "fa-solid fa-check dropdown-item-check";
          icon.setAttribute("aria-hidden", "true");
          item.appendChild(icon);
        } else if (wasSelected && checkIcon) {
          checkIcon.remove();
        }

        onFilterChange?.(item.dataset.type, item.dataset.value, wasSelected);
      });
    });
  }
};

export const updateDropdown = (
  type,
  searchInput,
  clearButton,
  dropdownData,
  onFilterChange,
  activeFilters,
) => {
  if (!searchInput) return;
  const hasSearchQuery = !!searchInput.value.trim();
  clearButton?.classList.toggle("hidden", !hasSearchQuery);
  updateDropdownList(
    type,
    getFilteredItems(type, dropdownData, searchInput),
    onFilterChange,
    activeFilters,
    hasSearchQuery,
  );
};

export const setupDropdown = (type, dropdownData, onFilterChange, getActiveFilters) => {
  const { button, searchInput, menu, clearButton, backdrop } = getDropdownElements(type);

  button?.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = !button.classList.contains("active");
    closeAllDropdowns();
    if (isOpen) {
      toggleDropdown(type, true);
      const currentFilters = getActiveFilters();
      updateDropdown(type, searchInput, clearButton, dropdownData, onFilterChange, currentFilters);
    }
  });

  searchInput?.addEventListener("input", () => {
    const currentFilters = getActiveFilters();
    updateDropdown(type, searchInput, clearButton, dropdownData, onFilterChange, currentFilters);
  });
  searchInput?.addEventListener("click", event => event.stopPropagation());

  clearButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
      const currentFilters = getActiveFilters();
      updateDropdown(type, searchInput, clearButton, dropdownData, onFilterChange, currentFilters);
    }
  });

  backdrop?.addEventListener("click", event => {
    event.stopPropagation();
    closeAllDropdowns();
  });

  menu?.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-item")) event.stopPropagation();
  });

  const initialFilters = getActiveFilters();
  updateDropdownList(type, dropdownData[type], onFilterChange, initialFilters);
};

export const setupGlobalListeners = () => {
  document.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-container")) closeAllDropdowns();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const openDropdown = document.querySelector(".dropdown-container.open");
      closeAllDropdowns();
      openDropdown &&
        document.getElementById(`dropdown-${openDropdown.dataset.type}-button`)?.focus();
    }
  });
};
