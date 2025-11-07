import { renderItem } from "./render.js";
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

  // Handle body scroll lock on mobile
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

export const updateDropdownList = (type, items, onFilterChange, activeFilters) => {
  const listElement = document.getElementById(`dropdown-${type}-list`);
  if (!listElement) return;
  const selectedSet = activeFilters?.[type] || new Set();
  listElement.innerHTML = items.map(item => renderItem(item, type, selectedSet.has(item))).join("");

  listElement.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault();
      item.blur();
      onFilterChange?.(item.dataset.type, item.dataset.value, item.classList.contains("selected"));
    });
  });
};

export const updateDropdown = (type, searchInput, clearButton, dropdownData, onFilterChange, activeFilters) => {
  if (!searchInput) return;
  clearButton?.classList.toggle("hidden", !searchInput.value.trim());
  updateDropdownList(
    type,
    getFilteredItems(type, dropdownData, searchInput),
    onFilterChange,
    activeFilters,
  );
};

export const setupDropdown = (type, dropdownData, onFilterChange, activeFilters) => {
  const { button, searchInput, menu, clearButton, backdrop } = getDropdownElements(type);

  button?.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = !button.classList.contains("active");
    closeAllDropdowns();
    if (isOpen) {
      toggleDropdown(type, true);
      updateDropdown(type, searchInput, clearButton, dropdownData, onFilterChange, activeFilters);
    }
  });

  searchInput?.addEventListener("input", () => updateDropdown(type, searchInput, clearButton, dropdownData, onFilterChange, activeFilters));
  searchInput?.addEventListener("click", event => event.stopPropagation());

  clearButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
      updateDropdown(type, searchInput, clearButton, dropdownData, onFilterChange, activeFilters);
    }
  });

  backdrop?.addEventListener("click", event => {
    event.stopPropagation();
    closeAllDropdowns();
  });

  menu?.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-item")) event.stopPropagation();
  });

  updateDropdownList(type, dropdownData[type], onFilterChange, activeFilters);
};

export const setupGlobalListeners = () => {
  document.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-container")) closeAllDropdowns();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const openDropdown = document.querySelector(".dropdown-container.open");
      closeAllDropdowns();
      openDropdown && document.getElementById(`dropdown-${openDropdown.dataset.type}-button`)?.focus();
    }
  });
};
