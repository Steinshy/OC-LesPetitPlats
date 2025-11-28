// src/components/scrollToTop.js

// ---------------
// dom elements
// ---------------

const getScrollToTopElements = () => {
  return {
    button: document.getElementById("scroll-to-top"),
    dropdowns: document.querySelector(".dropdowns"),
    placeholder: document.querySelector(".dropdowns-placeholder"),
  };
};

// ---------------
// helpers
// ---------------

const isMobile = () => {
  const detector = document.querySelector(".mobile-detector");
  return detector ? window.getComputedStyle(detector).display !== "none" : false;
};

const scrollToTop = () => {
  const { button } = getScrollToTopElements();
  window.scrollTo({ top: 0, behavior: "smooth" });
  button?.blur();
};

// ---------------
// sticky dropdowns
// ---------------

let dropdownsOffsetTop = null;

const updateStickyDropdowns = () => {
  const { dropdowns, placeholder } = getScrollToTopElements();
  if (!dropdowns) return;

  // Init placeholder
  if (!placeholder) {
    const newPlaceholder = document.createElement("div");
    newPlaceholder.className = "dropdowns-placeholder";
    dropdowns.parentNode.insertBefore(newPlaceholder, dropdowns.nextSibling);
  }

  const currentPlaceholder = document.querySelector(".dropdowns-placeholder");

  // Store original offset
  if (dropdownsOffsetTop === null && !dropdowns.classList.contains("is-sticky")) {
    dropdownsOffsetTop = dropdowns.offsetTop;
  }

  const shouldBeSticky = window.scrollY >= dropdownsOffsetTop;

  if (shouldBeSticky && !dropdowns.classList.contains("is-sticky")) {
    // Set placeholder height
    if (currentPlaceholder) {
      currentPlaceholder.style.height = `${dropdowns.offsetHeight}px`;
      currentPlaceholder.classList.add("visible");
    }
    dropdowns.classList.add("is-sticky");
  } else if (!shouldBeSticky && dropdowns.classList.contains("is-sticky")) {
    dropdowns.classList.remove("is-sticky");
    if (currentPlaceholder) {
      currentPlaceholder.classList.remove("visible");
    }
  }
};

// ---------------
// visibility
// ---------------

export const updateVisibility = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  const dropdownContainer = document.getElementById("dropdowns-container");
  const mobile = isMobile();

  // Check dropdown open state
  const hasOpenDropdown = dropdownContainer
    ? [...dropdownContainer.querySelectorAll(".dropdown-container")].some(container =>
        container.classList.contains("open"),
      )
    : false;

  const shouldShow = window.scrollY > 300 && !(mobile && hasOpenDropdown);

  button.classList.toggle("show", shouldShow);
  button.setAttribute("aria-hidden", String(!shouldShow));

  // Update sticky state
  updateStickyDropdowns();
};

// ---------------
// setup
// ---------------

const setupListeners = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  button.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", updateVisibility, { passive: true });
};

export const setupScrollToTop = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  updateVisibility();
  setupListeners();
};
