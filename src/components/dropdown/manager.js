import { hideDropdownsSkeletons } from "../skeletons.js";
import {
  ingredientsDropdown,
  ustensilsDropdown,
  appliancesDropdown,
  renderDropdownsSkeletons,
  renderEmptyStateItem,
} from "./render.js";
import { deduplicateItems, normalizeString } from "@/utils/string.js";

// Constants
const ARIA_HIDDEN = "aria-hidden";

// Store dropdown data globally for filtering
export let currentDropdownsData = {};
export let dropdownTypes = [];

// Get dropdown (single)elements
const getDropdownElements = dropdownType => ({
  button: document.getElementById(`dropdown-${dropdownType}-button`),
  items: document.querySelectorAll(`#dropdown-${dropdownType}-list button`),
  searchInput: document.getElementById(`search-${dropdownType}`),
  searchIcon: document.getElementById(`search-icon-${dropdownType}`),
  clearButton: document.getElementById(`clear-search-${dropdownType}`),
  menu: document.getElementById(`menu-${dropdownType}`),
  container: document.getElementById(`dropdown-${dropdownType}-container`),
  backdrop: document.getElementById(`dropdown-${dropdownType}-backdrop`),
  list: document.getElementById(`dropdown-${dropdownType}-list`),
});

export const buildDropdownsData = recipesData => {
  let dropdownsData = {};
  // Collect all ingredients from all recipes (raw values)
  const allIngredients = recipesData
    .flatMap(recipe => recipe?.ingredients?.map(ingredient => ingredient?.ingredient) || [])
    .filter(Boolean);

  // Collect all ustensils from all recipes (raw values)
  const allUstensils = recipesData.flatMap(recipe => recipe?.ustensils || []).filter(Boolean);

  // Collect all appliances from all recipes (raw values)
  const allAppliances = recipesData.map(recipe => recipe?.appliance).filter(Boolean);

  dropdownsData = {
    ingredients: deduplicateItems(allIngredients),
    ustensils: deduplicateItems(allUstensils),
    appliances: deduplicateItems(allAppliances),
  };

  return dropdownsData;
};

export const setupDropdowns = recipesData => {
  if (!recipesData) return;
  // Show skeletons before building dropdowns data
  const dropdownsContainer = document.getElementById("dropdowns-container");
  dropdownsContainer.innerHTML = renderDropdownsSkeletons();

  currentDropdownsData = buildDropdownsData(recipesData);
  dropdownTypes = Object.keys(currentDropdownsData);

  // Render dropdowns content
  dropdownsContainer.innerHTML =
    ingredientsDropdown(currentDropdownsData.ingredients || []) +
    ustensilsDropdown(currentDropdownsData.ustensils || []) +
    appliancesDropdown(currentDropdownsData.appliances || []);

  // Hide skeletons after rendering
  hideDropdownsSkeletons();

  // Setup global listeners
  setupGlobalListeners(dropdownTypes);

  // Initialize show class for dropdown-search based on items count
  dropdownTypes.forEach(dropdownType => {
    updateDropdownList(dropdownType);
  });
};

const setupGlobalListeners = dropdownTypes => {
  // Handle search input changes using event delegation
  dropdownTypes.forEach(dropdownType => {
    const { searchInput, backdrop, list, button, clearButton } = getDropdownElements(dropdownType);

    if (searchInput) {
      searchInput.addEventListener("input", () => updateDropdownContent(dropdownType));
    }

    if (backdrop) {
      backdrop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        closeDropdown(dropdownType);
      });
    }

    if (list) {
      list.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const itemButton = event.target.closest(".dropdown-item");
        if (itemButton) {
          manageItemsClicks(itemButton);
        }
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        searchInput.value = "";
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

  // Handle Escape key to close all dropdowns
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

  // Handle clicks outside dropdowns to close them
  document.addEventListener("click", event => {
    const clickedElement = event.target;
    const isClickInsideDropdown = dropdownTypes.some(dropdownType => {
      const { container } = getDropdownElements(dropdownType);
      return container && container.contains(clickedElement);
    });

    if (!isClickInsideDropdown) {
      closeAllDropdowns();
    }
  });
};

// Close a specific dropdown
const closeDropdown = dropdownType => {
  const { container, button, backdrop, menu } = getDropdownElements(dropdownType);
  if (!container || !button) return;

  container.classList.remove("open");
  button.classList.remove("active");
  button.setAttribute("aria-expanded", "false");
  if (backdrop) {
    backdrop.setAttribute(ARIA_HIDDEN, "true");
  }
  if (menu) {
    menu.setAttribute(ARIA_HIDDEN, "true");
  }
};

// Close all dropdowns
const closeAllDropdowns = () => {
  dropdownTypes.forEach(type => {
    const { container } = getDropdownElements(type);
    if (container?.classList.contains("open")) {
      closeDropdown(type);
    }
  });
};

const toggleDropdown = dropdownType => {
  const { container, button, backdrop, menu } = getDropdownElements(dropdownType);
  if (!container || !button) return;

  const isCurrentlyOpen = container.classList.contains("open");

  if (isCurrentlyOpen) {
    closeDropdown(dropdownType);
  } else {
    // Close all other dropdowns before opening this one
    closeAllDropdowns();

    // Open the selected dropdown
    container.classList.add("open");
    button.classList.add("active");
    button.setAttribute("aria-expanded", "true");
    if (backdrop) {
      backdrop.setAttribute(ARIA_HIDDEN, "false");
    }
    if (menu) {
      menu.setAttribute(ARIA_HIDDEN, "false");
    }
  }
};

// Update dropdown content based on search
const updateDropdownContent = type => {
  const { searchInput, searchIcon, clearButton } = getDropdownElements(type);
  if (!searchInput) return;

  const hasSearchQuery = Boolean(searchInput.value.trim());
  searchIcon?.classList.toggle("hidden", hasSearchQuery);
  clearButton?.classList.toggle("hidden", !hasSearchQuery);

  // Update dropdown list content
  updateDropdownList(type);
};

// Handle dropdown item click
const manageItemsClicks = itemButton => {
  if (!itemButton) return;

  const wasSelected = itemButton.classList.contains("selected");
  const checkIcon = itemButton.querySelector(".dropdown-item-check");

  itemButton.classList.toggle("selected", !wasSelected);

  if (!wasSelected) {
    // Add check icon if not present
    if (!checkIcon) {
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-check dropdown-item-check";
      icon.setAttribute(ARIA_HIDDEN, "true");
      itemButton.appendChild(icon);
    }
  } else {
    // Remove check icon
    if (checkIcon) {
      checkIcon.remove();
    }
  }

  const event = new CustomEvent("dropdown:itemToggled", {
    detail: {
      type: itemButton.dataset.type,
      value: itemButton.dataset.value,
      selected: !wasSelected,
    },
  });
  document.dispatchEvent(event);
};

// Update dropdown list content
const updateDropdownList = type => {
  const { list, searchInput, container } = getDropdownElements(type);
  if (!list) return;

  const normalizedQuery = normalizeString(searchInput?.value || "");
  const items = list.querySelectorAll(".dropdown-item");
  let visibleCount = 0;

  // Filter items based on search query
  items.forEach(item => {
    const itemText = item.querySelector("span")?.textContent || "";
    const isVisible = !normalizedQuery || normalizeString(itemText).includes(normalizedQuery);
    const listItem = item.closest("li");

    if (listItem) {
      listItem.style.display = isVisible ? "" : "none";
    }
    if (isVisible) visibleCount++;
  });

  // Show/hide empty state
  const emptyElement = list.querySelector(".dropdown-empty-state");
  const shouldShowEmpty = visibleCount === 0;

  if (shouldShowEmpty && !emptyElement) {
    list.insertAdjacentHTML("beforeend", renderEmptyStateItem());
  }

  if (emptyElement) {
    emptyElement.style.display = shouldShowEmpty ? "" : "none";
  }

  // Manage show class for dropdown-search based on total items count
  const searchElement = container?.querySelector(".dropdown-search");
  if (searchElement) {
    const totalItems = items.length;
    searchElement.classList.toggle("show", totalItems > 0);
  }
};
