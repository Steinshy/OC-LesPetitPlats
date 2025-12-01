// Check mobile via CSS detector
export const isMobile = () => {
  const detector = document.querySelector(".mobile-detector");
  return detector ? window.getComputedStyle(detector).display !== "none" : false;
};
