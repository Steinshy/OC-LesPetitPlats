// src/components/scrollLock.js

import { stickyDropdowns } from "@components/dropdowns/manager.js";
import { updateVisibility as scrollToTopVisibility } from "@components/scrollToTop.js";
import { isMobile } from "@utils/device.js";

let scrollPosition = 0;
let isLocked = false;

// ---------------
// Lock Scroll
// ---------------
export const lockScroll = () => {
  if (!isMobile() || isLocked) return;

  scrollPosition = window.scrollY || document.documentElement.scrollTop;
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
  isLocked = true;
};

// ---------------
// Unlock Scroll
// ---------------
export const unlockScroll = () => {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  isLocked && scrollPosition > 0 && window.scrollTo(0, scrollPosition);
  isLocked = false;
  scrollPosition = 0;
};

// ---------------
// Setup Scroll Lock
// ---------------
export const setupScrollLock = () => {
  window.addEventListener(
    "scroll",
    () => {
      scrollToTopVisibility();
      stickyDropdowns();
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    isMobile() && isLocked && unlockScroll();
  });
};
