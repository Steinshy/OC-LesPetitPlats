let scrollPosition = 0;

const isMobile = () => {
  const detector = document.querySelector(".mobile-detector");
  return detector ? window.getComputedStyle(detector).display !== "none" : false;
};

export const lockBodyScroll = () => {
  if (!isMobile()) return;

  scrollPosition = window.scrollY || document.documentElement.scrollTop;
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
};

export const unlockBodyScroll = () => {
  if (!isMobile()) return;

  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);
};
