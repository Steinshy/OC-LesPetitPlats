const getScrollToTopElements = () => {
  return {
    button: document.getElementById("scroll-to-top"),
  };
};

const isMobile = () => {
  const detector = document.querySelector(".mobile-detector");
  return detector ? window.getComputedStyle(detector).display !== "none" : false;
};

const scrollToTop = () => {
  const { button } = getScrollToTopElements();
  window.scrollTo({ top: 0, behavior: "smooth" });
  button?.blur();
};

export const updateVisibility = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  const dropdownContainer = document.getElementById("dropdowns-container");
  const mobile = isMobile();

  // Check if any dropdown is open
  const hasOpenDropdown = dropdownContainer
    ? [...dropdownContainer.querySelectorAll(".dropdown-container")].some(container =>
        container.classList.contains("open"),
      )
    : false;

  const shouldShow = window.scrollY > 300 && !(mobile && hasOpenDropdown);

  button.classList.toggle("show", shouldShow);
  button.setAttribute("aria-hidden", String(!shouldShow));
};

const setupListeners = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  button.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", updateVisibility, { passive: true });
};

export const initScrollToTop = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  updateVisibility();
  setupListeners();
};
