// src/components/scroll.js
import { dropdownElements } from "@components/dropdowns/elements.js";
import { stickyDropdowns } from "@components/dropdowns/manager.js";
import { dropdownTypes } from "@components/dropdowns/setup.js";
import { getHeaderHeight, isMobile } from "@utils/config.js";

const getButton = () => document.getElementById("scroll-to-top");

export const isScrolledPastHeader = () => {
  const threshold = isMobile() ? getHeaderHeight() * 0.35 : getHeaderHeight();
  return window.scrollY > threshold;
};

export const setupScrollToTop = () => {
  scrollToTop.init();
  return () => {
    scrollToTop.cleanup();
  };
};

export const setupScrollLock = () => {
  scrollListeners.init();
  return () => {
    scrollListeners.cleanup();
  };
};

export const lockScroll = () => {
  scrollLock.lock();
};

export const unlockScroll = () => {
  scrollLock.unlock();
};

export const updateVisibility = () => {
  scrollToTop.update();
};

export const scrollToTop = {
  button: getButton(),
  boundOnClick: null,

  onShow() {
    this.button?.classList.add("show");
    this.button?.setAttribute("aria-hidden", "false");
  },

  onHide() {
    this.button?.classList.remove("show");
    this.button?.setAttribute("aria-hidden", "true");
  },

  update() {
    if (!this.button) return;

    const hasOpenDropdown = dropdownTypes.some(type => {
      const { container } = dropdownElements(type);
      return container?.classList.contains("open");
    });
    const shouldHideOnMobile = isMobile() && hasOpenDropdown;
    const shouldShow = isScrolledPastHeader() && !shouldHideOnMobile;

    if (shouldShow) {
      this.onShow();
    } else {
      this.onHide();
    }
  },

  onClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getButton()?.blur();
  },

  init() {
    if (!getButton()) return;
    this.boundOnClick = this.onClick.bind(this);
    getButton().addEventListener("click", this.boundOnClick);
  },

  cleanup() {
    if (!getButton() || !this.boundOnClick) return;
    getButton().removeEventListener("click", this.boundOnClick);
    this.boundOnClick = null;
  },
};

export const scrollLock = {
  scrollPosition: 0,
  isLocked: false,

  lock() {
    if (!isMobile() || this.isLocked) return;

    this.scrollPosition = window.scrollY || document.documentElement.scrollTop;
    document.documentElement.classList.add("no-scroll");
    this.isLocked = true;
  },

  unlock() {
    if (!this.isLocked) return;

    document.documentElement.classList.remove("no-scroll");

    window.scrollTo({
      top: this.scrollPosition,
      behavior: "auto",
    });

    this.isLocked = false;
  },
};

export const scrollListeners = {
  resizeRafId: null,
  boundOnScroll: null,
  boundOnResize: null,

  onScroll() {
    scrollToTop.update();
    stickyDropdowns();
  },

  onResize() {
    if (this.resizeRafId) {
      cancelAnimationFrame(this.resizeRafId);
    }

    this.resizeRafId = requestAnimationFrame(() => {
      this.resizeRafId = undefined;
      stickyDropdowns();

      if (!isMobile() && scrollLock.isLocked) {
        scrollLock.unlock();
      }
    });
  },

  init() {
    this.boundOnScroll = this.onScroll.bind(this);
    this.boundOnResize = this.onResize.bind(this);
    window.addEventListener("scroll", this.boundOnScroll, { passive: true });
    window.addEventListener("resize", this.boundOnResize);
  },

  cleanup() {
    if (this.boundOnScroll) {
      window.removeEventListener("scroll", this.boundOnScroll);
      this.boundOnScroll = null;
    }

    if (this.boundOnResize) {
      window.removeEventListener("resize", this.boundOnResize);
      this.boundOnResize = null;
    }

    if (this.resizeRafId) {
      cancelAnimationFrame(this.resizeRafId);
      this.resizeRafId = undefined;
    }
  },
};
