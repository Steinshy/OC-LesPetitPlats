// src/components/scrollToTop.js
import { dropdownsElements } from "@components/dropdowns/elements.js";
import { isScrolledPastHeader } from "@components/header.js";
import { isMobile } from "@utils/device.js";

let button = null;

const getButton = () => {
  if (!button) button = document.getElementById("scroll-to-top");
  return button;
};

export const showScrollToTop = () => {
  const buttonElement = getButton();
  if (!buttonElement) return;
  buttonElement.classList.add("show");
  buttonElement.setAttribute("aria-hidden", "false");
};

export const hideScrollToTop = () => {
  const buttonElement = getButton();
  if (!buttonElement) return;
  buttonElement.classList.remove("show");
  buttonElement.setAttribute("aria-hidden", "true");
};

export const hasOpenDropdown = () => {
  const { section } = dropdownsElements();
  if (!section) return false;
  return [...section.querySelectorAll(".dropdown-container")].some(
    dropdown => dropdown.classList.contains("open"),
  );
};

export const updateVisibility = () => {
  const buttonElement = getButton();
  if (!buttonElement) return;

  const shouldHideOnMobile = isMobile() && hasOpenDropdown();
  const shouldShow = isScrolledPastHeader() && !shouldHideOnMobile;

  if (shouldShow) {
    showScrollToTop();
  } else {
    hideScrollToTop();
  }
};

export const setupScrollToTop = () => {
  button = document.getElementById("scroll-to-top");
  if (!button) return;

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    button?.blur();
  });
};
