// src/components/scrollLock.js
import { stickyDropdowns } from "@components/dropdowns/manager.js";
import { updateVisibility as scrollToTopVisibility } from "@components/scrollToTop.js";
import { isMobile } from "@utils/config.js";

let scrollPosition = 0;
let isLocked = false;

export const lockScroll = () => {
  if (!isMobile() || isLocked) return;

  scrollPosition = window.scrollY || document.documentElement.scrollTop;
  document.documentElement.classList.add("no-scroll");
  isLocked = true;
};

export const unlockScroll = () => {
  if (!isLocked) return;

  document.documentElement.classList.remove("no-scroll");

  window.scrollTo({
    top: scrollPosition,
    behavior: "auto",
  });

  isLocked = false;
};

export const setupScrollLock = () => {
  const onScroll = () => {
    scrollToTopVisibility();
    stickyDropdowns();
  };

  let resizeRafId;

  const onResize = () => {
    if (resizeRafId) {
      cancelAnimationFrame(resizeRafId);
    }

    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = undefined;
      stickyDropdowns();

      if (!isMobile() && isLocked) {
        unlockScroll();
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);

    if (resizeRafId) {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = undefined;
    }
  };
};
