import { renderItem } from "./render.js";

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
