import { buildDropdownsData } from "./data.js";
import {
  ingredientsDropdown,
  ustensilsDropdown,
  appliancesDropdown,
  renderEmptyStateItem,
} from "./render.js";
import { filterDropdownItems } from "@/components/filters/recipeFilters.js";
import { dropdownsContainerSkeleton } from "@/components/skeletonsManager.js";

export let currentDropdownsData = {};
let dropdownTypes = [];
let isGlobalHandlersInitialized = false;
const ARIA_HIDDEN = "aria-hidden";

export const getDropdownElements = dropdownType => {
  return {
    button: document.getElementById(`dropdown-${dropdownType}-button`),
    searchInput: document.getElementById(`search-${dropdownType}`),
    clearButton: document.getElementById(`dropdown-${dropdownType}-search-clear-button`),
    menu: document.getElementById(`menu-${dropdownType}`),
    container: document.getElementById(`dropdown-${dropdownType}-container`),
    backdrop: document.getElementById(`dropdown-${dropdownType}-backdrop`),
    itemsList: document.getElementById(`dropdown-${dropdownType}-list`),
  };
};

const getDropdownSearchElements = type => {
  return {
    list: document.getElementById(`dropdown-${type}-list`),
    searchWrapper: document.getElementById(`dropdown-${type}-search`),
    searchInput: document.getElementById(`search-${type}`),
    searchClear: document.getElementById(`dropdown-${type}-search-clear-button`),
  };
};

const getDropdownListElements = (type, list) => {
  return {
    itemsElements: [...list.querySelectorAll(".dropdown-item")],
    emptyElement: document.getElementById(`dropdown-empty-state-${type}`),
  };
};

export const setupDropdowns = recipesData => {
  if (!recipesData) return;
  const dropdownContainer = document.getElementById("dropdowns-container");

  if (!dropdownContainer) return;

  const dropdownsData = buildDropdownsData(recipesData);
  currentDropdownsData = dropdownsData.dropdowns || {};
  dropdownTypes = Object.keys(currentDropdownsData);

  dropdownContainer.innerHTML =
    ingredientsDropdown(currentDropdownsData.ingredients) +
    ustensilsDropdown(currentDropdownsData.ustensils) +
    appliancesDropdown(currentDropdownsData.appliances);

  dropdownsContainerSkeleton().hide();
  setupDropdownListeners(dropdownTypes);
  dropdownTypes.forEach(dropdownType => {
    updateDropdownList(dropdownType);
  });
};

const setupDropdownListeners = types => {
  types.forEach(type => {
    const { searchInput, searchClear } = getDropdownSearchElements(type);

    const { backdrop, itemsList, button } = getDropdownElements(type);

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        updateDropdownContent(type);
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(type, false);
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

    if (searchClear) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.focus();
        updateDropdownContent(type);
      });
    }

    if (button) {
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(type);
      });
    }
  });

  setupGlobalHandlers();
};

const setupGlobalHandlers = () => {
  if (isGlobalHandlersInitialized);
  isGlobalHandlersInitialized = true;

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

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

  const hasOpenDropdown = getOpenDropdownType() !== null;
  if (!hasOpenDropdown) {
    unlockBodyScroll();
    if (isMobile()) {
      const button = document.getElementById("scroll-to-top");
      if (button && window.scrollY > 300) {
        button.classList.add("show");
        button.setAttribute("aria-hidden", "false");
      }
    }
  }
};

const isMobile = () => window.matchMedia("(width <= 767px)").matches;
let scrollPosition = 0;

const lockBodyScroll = () => {
  if (!isMobile()) return;
  scrollPosition = window.scrollY || document.documentElement.scrollTop;
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
};

const unlockBodyScroll = () => {
  if (!isMobile()) return;
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);
};

const applyDropdownState = (type, needsToOpen) => {
  const { container, button, backdrop, menu } = getDropdownElements(type);

  container.classList.toggle("open", needsToOpen);
  button.classList.toggle("active", needsToOpen);
  button.setAttribute("aria-expanded", String(needsToOpen));

  backdrop?.setAttribute(ARIA_HIDDEN, String(!needsToOpen));
  menu?.setAttribute(ARIA_HIDDEN, String(!needsToOpen));

  if (needsToOpen) {
    lockBodyScroll();
    if (isMobile()) {
      const scrollToTopButton = document.getElementById("scroll-to-top");
      if (scrollToTopButton) {
        scrollToTopButton.classList.remove("show");
        scrollToTopButton.setAttribute("aria-hidden", "true");
      }
    }
  }
};

export const updateDropdownContent = type => {
  const { searchInput, clearButton } = getDropdownElements(type);
  if (!searchInput) return;

  const hasQuery = !!searchInput.value.trim();
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

const updateDropdownList = type => {
  const { list, searchWrapper, searchInput } = getDropdownSearchElements(type);
  if (!list) return;

  const allItems = currentDropdownsData[type] || [];

  const query = searchInput?.value ?? "";

  const filteredItems = filterDropdownItems(allItems, query);

  const itemsHtml = filteredItems
    .map(item => {
      const label = item?.label ?? item;
      const value = item?.value ?? item;

      return `
        <li role="option" id="dropdown-item-${type}-${value}">
          <button
            type="button"
            class="dropdown-item item-btn"
            id="item-btn-${type}-${value}"
            data-value="${value}"
            data-type="${type}"
            aria-pressed="false"
          >
            <span class="dropdown-item-label">${label}</span>
            <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
          </button>
        </li>
      `;
    })
    .join("");

  list.innerHTML = itemsHtml;

  const { itemsElements } = getDropdownListElements(type, list) || {};
  const shouldShowEmpty = itemsElements?.length === 0;

  if (shouldShowEmpty) {
    const emptyStateHtml = renderEmptyStateItem(type);
    list.insertAdjacentHTML("beforeend", emptyStateHtml);
  }

  if (searchWrapper) {
    searchWrapper.classList.toggle("show", allItems.length > 0);
  }
};
