// src/components/scrollLock.js

import { stickyDropdowns } from "@components/dropdowns/manager.js";
import { updateVisibility as scrollToTopVisibility } from "@components/scrollToTop.js";
import { isMobile } from "@utils/device.js";

let scrollPosition = 0;
let isLocked = false;

// Lock scroll on mobile by toggling a class on <html>.
// Much safer than forcing body to fixed with top offsets.
export const lockScroll = () => {
  if (!isMobile() || isLocked) return;

  scrollPosition = window.scrollY || document.documentElement.scrollTop;

  document.documentElement.classList.add("no-scroll");
  isLocked = true;
};

export const unlockScroll = () => {
  if (!isLocked) return;

  document.documentElement.classList.remove("no-scroll");

  // Restore scroll position without visual jump
  window.scrollTo({
    top: scrollPosition,
    behavior: "auto",
  });

  isLocked = false;
};

export const setupScrollLock = () => {
  window.addEventListener(
    "scroll",
    () => {
      scrollToTopVisibility();
      stickyDropdowns();
    },
    { passive: true },
  );

  let resizeRafId;

  const handleResize = () => {
    resizeRafId = undefined;
    stickyDropdowns();

    // If viewport becomes non-mobile while locked, unlock gracefully
    if (!isMobile() && isLocked) {
      unlockScroll();
    }
  };

  window.addEventListener("resize", () => {
    if (resizeRafId) {
      cancelAnimationFrame(resizeRafId);
    }

    resizeRafId = requestAnimationFrame(handleResize);
  });
};
