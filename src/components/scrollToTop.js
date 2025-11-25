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

const updateVisibility = () => {
  const dropdownContainer = document.getElementById("dropdowns-container");
  const mobile = isMobile();

  const shouldShow =
    window.scrollY > 300 && !(mobile && dropdownContainer?.classList.contains("open"));
  if (!dropdownContainer) return;

  dropdownContainer.classList.toggle("show", shouldShow);
  dropdownContainer.setAttribute("aria-hidden", String(!shouldShow));
};

const setupListeners = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  button.addEventListener("click", scrollToTop);
  setupGlobalHandlers();
};

const setupGlobalHandlers = () => {
  window.addEventListener("scroll", updateVisibility, { passive: true });
};

export const initScrollToTop = () => {
  const { button } = getScrollToTopElements();
  if (!button) return;

  updateVisibility();
  setupListeners();
};
