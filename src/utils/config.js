export const baseUrl = import.meta.env.BASE_URL || "/";
export const ariaHidden = "aria-hidden";

export const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
// Check if mobile via CSS detector
export const isMobile = () => {
  try {
    const detector = document.querySelector(".mobile-detector");
    return detector ? window.getComputedStyle(detector).display !== "none" : false;
  } catch {
    return false;
  }
};
