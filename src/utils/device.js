// Check mobile via CSS detector
export const isMobile = () => {
  try {
    const detector = document.querySelector(".mobile-detector");
    return detector ? window.getComputedStyle(detector).display !== "none" : false;
  } catch {
    return false;
  }
};
