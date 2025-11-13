import { getCurrentDropdownData } from "../dropdown.js";
import { renderItem, renderEmptyState } from "./render.js";
import { getFilteredItems, getDropdownElements, DROPDOWN_TYPES } from "./utils.js";

const isMobile = () => window.innerWidth <= 640;

export const toggleDropdown = (type, isOpen) => {
  const button = document.getElementById(`dropdown-${type}-button`);
  const menu = document.getElementById(`menu-${type}`);
  const container = document.getElementById(`dropdown-${type}-container`);
  const backdrop = document.getElementById(`dropdown-${type}-backdrop`);
  if (!button || !menu || !container) return;

  button.classList.toggle("active", isOpen);
  button.setAttribute("aria-expanded", isOpen);
  container.classList.toggle("open", isOpen);

  if (isMobile()) {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (backdrop) {
    backdrop.setAttribute("aria-hidden", !isOpen);
  }

  if (isOpen) {
    menu.setAttribute("aria-hidden", "false");
  } else {
    const focusedElement = menu.querySelector(":focus");
    if (focusedElement) {
      focusedElement.blur();
      button.focus();
    }
    menu.setAttribute("aria-hidden", "true");
  }
};

export const closeAllDropdowns = () => {
  DROPDOWN_TYPES.forEach(({ type }) => {
    toggleDropdown(type, false);
  });
};

const handleItemClick = (item, onFilterChange) => {
  const wasSelected = item.classList.contains("selected");
  const checkIcon = item.querySelector(".dropdown-item-check");

  item.classList.toggle("selected", !wasSelected);

  if (!wasSelected) {
    if (!checkIcon) {
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-check dropdown-item-check";
      icon.setAttribute("aria-hidden", "true");
      item.appendChild(icon);
    }
  } else if (checkIcon) {
    checkIcon.remove();
  }

  onFilterChange?.(item.dataset.type, item.dataset.value, wasSelected);
};

const attachItemListeners = (listElement, onFilterChange) => {
  listElement.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault();
      item.blur();
      handleItemClick(item, onFilterChange);
    });
  });
};

const buildItemsHTML = (items, type, activeFilters) => {
  const selectedSet = activeFilters?.[type] || new Set();
  return items.map(item => renderItem(item, type, selectedSet.has(item))).join("");
};

export const updateDropdownList = (type, itemsHTML, onFilterChange, hasSearchQuery = false) => {
  const listElement = document.getElementById(`dropdown-${type}-list`);
  if (!listElement) return;

  if (itemsHTML === "" && hasSearchQuery) {
    listElement.innerHTML = renderEmptyState();
  } else {
    listElement.innerHTML = itemsHTML;
    attachItemListeners(listElement, onFilterChange);
  }
};

const toggleSearchIcons = (hasSearchQuery, searchIcon, clearButton) => {
  searchIcon?.classList.toggle("hidden", hasSearchQuery);
  clearButton?.classList.toggle("hidden", !hasSearchQuery);
};

const updateDropdownContent = (
  type,
  getActiveFilters,
  dropdownData,
  searchInput,
  searchIcon,
  clearButton,
  onFilterChange,
) => {
  const hasSearchQuery = Boolean(searchInput?.value.trim());
  toggleSearchIcons(hasSearchQuery, searchIcon, clearButton);

  const activeFilters = getActiveFilters();
  const filteredItems = getFilteredItems(type, dropdownData, searchInput);
  const itemsHTML =
    filteredItems.length === 0 && hasSearchQuery
      ? renderEmptyState()
      : buildItemsHTML(filteredItems, type, activeFilters);

  updateDropdownList(type, itemsHTML, onFilterChange, hasSearchQuery);
};

export const updateDropdown = (type, getActiveFilters, dropdownData, onFilterChange) => {
  const { searchInput, searchIcon, clearButton } = getDropdownElements(type);
  if (!searchInput) return;
  updateDropdownContent(
    type,
    getActiveFilters,
    dropdownData,
    searchInput,
    searchIcon,
    clearButton,
    onFilterChange,
  );
};

const createDropdownHandlers = (
  type,
  getActiveFilters,
  dropdownData,
  searchInput,
  searchIcon,
  clearButton,
  onFilterChange,
) => {
  const handleButtonClick = event => {
    event.stopPropagation();
    const button = event.currentTarget;
    const isOpen = !button.classList.contains("active");
    closeAllDropdowns();
    if (isOpen) {
      toggleDropdown(type, true);
      const currentData = getCurrentDropdownData() || dropdownData;
      updateDropdownContent(
        type,
        getActiveFilters,
        currentData,
        searchInput,
        searchIcon,
        clearButton,
        onFilterChange,
      );
    }
  };

  const handleSearchInput = () => {
    const currentData = getCurrentDropdownData() || dropdownData;
    updateDropdownContent(
      type,
      getActiveFilters,
      currentData,
      searchInput,
      searchIcon,
      clearButton,
      onFilterChange,
    );
  };

  const handleClearClick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
      const currentData = getCurrentDropdownData() || dropdownData;
      updateDropdownContent(
        type,
        getActiveFilters,
        currentData,
        searchInput,
        searchIcon,
        clearButton,
        onFilterChange,
      );
    }
  };

  return { handleButtonClick, handleSearchInput, handleClearClick };
};

export const setupDropdown = (type, dropdownData, onFilterChange, getActiveFilters) => {
  const { button, searchInput, menu, searchIcon, clearButton, backdrop } =
    getDropdownElements(type);
  if (!button || !searchInput || !menu) return;

  const { handleButtonClick, handleSearchInput, handleClearClick } = createDropdownHandlers(
    type,
    getActiveFilters,
    dropdownData,
    searchInput,
    searchIcon,
    clearButton,
    onFilterChange,
  );

  button.addEventListener("click", handleButtonClick);
  searchInput.addEventListener("input", handleSearchInput);
  searchInput.addEventListener("click", event => event.stopPropagation());

  if (clearButton) {
    clearButton.addEventListener("click", handleClearClick);
  }

  if (backdrop) {
    backdrop.addEventListener("click", event => {
      event.stopPropagation();
      closeAllDropdowns();
    });
  }

  menu.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-item")) event.stopPropagation();
  });

  const activeFilters = getActiveFilters();
  const currentData = getCurrentDropdownData() || dropdownData;
  const itemsHTML = buildItemsHTML(currentData[type], type, activeFilters);
  updateDropdownList(type, itemsHTML, onFilterChange);

  // Initialize icon visibility state based on current input value
  updateDropdownContent(
    type,
    getActiveFilters,
    currentData,
    searchInput,
    searchIcon,
    clearButton,
    onFilterChange,
  );
};

const getOpenDropdownType = () => {
  const openContainer = document.querySelector(".dropdown-container.open");
  if (!openContainer) return null;
  return (
    openContainer.dataset.type ||
    openContainer.id.replace("dropdown-", "").replace("-container", "")
  );
};

export const setupGlobalListeners = () => {
  document.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-container")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const openType = getOpenDropdownType();
      if (openType) {
        closeAllDropdowns();
        const button = document.getElementById(`dropdown-${openType}-button`);
        button?.focus();
      }
    }
  });
};
