import {
  dropdownElements,
  dropdownSearchElements,
  dropdownsElements,
} from "@components/dropdowns/elements.js";
import { updateDropdownList, stickyDropdowns } from "@components/dropdowns/manager.js";
import { dropdownTypes } from "@components/dropdowns/setup.js";
import { scrollLock, scrollToTop } from "@components/scroll.js";
import { ariaHidden, isMobile } from "@utils/config.js";
import { eventBus } from "@utils/eventBus.js";
export const openDropdown = type => {
  const { container, button, backdrop, menu } = dropdownElements(type);
  if (!container || !button) return;

  const scrollY = window.scrollY;

  container.classList.add("open");
  button.classList.add("active");
  button.setAttribute("aria-expanded", "true");

  backdrop?.setAttribute(ariaHidden, "false");
  menu?.setAttribute(ariaHidden, "false");
  updateDropdownList(type);
  document.body.classList.add("dropdown-open");

  if (isMobile()) {
    const { section } = dropdownsElements();
    if (section) {
      section.classList.remove("is-sticky");
      section.style.position = "";
      section.style.top = "";
      section.style.left = "";
      section.style.width = "";
    }
    scrollLock.lock();
  } else {
    window.scrollTo({
      top: scrollY,
      behavior: "auto",
    });
  }

  scrollToTop.update();
  eventBus.emit("dropdown:opened", type);
};

export const closeAllDropdowns = () => {
  if (dropdownTypes?.length) {
    dropdownTypes.forEach(type => {
      const { container, button, backdrop, menu } = dropdownElements(type);
      if (!container || !button) return;

      container.classList.remove("open");
      button.classList.remove("active");
      button.setAttribute("aria-expanded", "false");

      backdrop?.setAttribute(ariaHidden, "true");
      menu?.setAttribute(ariaHidden, "true");
    });
  }

  if (isMobile()) {
    stickyDropdowns();
  }
  document.body.classList.remove("dropdown-open");

  scrollLock.unlock();
  scrollToTop.update();
  eventBus.emit("dropdown:closed");
};

export const closeDropdown = type => {
  const { container } = dropdownElements(type);
  const { searchInput } = dropdownSearchElements(type);
  if (!container?.classList.contains("open")) return;
  if (searchInput) searchInput.value = "";

  closeAllDropdowns();
};

export const toggleDropdown = type => {
  const { container } = dropdownElements(type);
  const isOpen = container?.classList.contains("open");

  closeAllDropdowns();

  if (!isOpen) {
    openDropdown(type);
  }
};

export const interactionsHandlers = {
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
