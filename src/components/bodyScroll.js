// src/components/bodyScroll.js

import { isMobile } from "@utils/string.js";

let scrollPosition = 0;
export const lockBodyScroll = () => {
  if (!isMobile()) return;

  scrollPosition = window.scrollY || document.documentElement.scrollTop;
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
};

export const unlockBodyScroll = () => {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";

  // Restore mobile scroll
  if (isMobile() && scrollPosition > 0) {
    window.scrollTo(0, scrollPosition);
  }
};
