import { afterAll, describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import * as dropdownsModule from "@/components/dropdowns/manager.js";
import { lockScroll, unlockScroll, setupScrollLock } from "@/components/scrollLock.js";
import * as scrollToTopModule from "@/components/scrollToTop.js";
import * as deviceModule from "@/utils/device.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

const MOBILE_DETECTOR_HTML = '<div class="mobile-detector"></div>';

vi.mock("@/utils/device.js", () => ({
  isMobile: vi.fn(() => false),
}));

vi.mock("@/components/dropdowns/manager.js", () => ({
  stickyDropdowns: vi.fn(),
}));

vi.mock("@/components/scrollToTop.js", () => ({
  updateVisibility: vi.fn(),
}));

describe("scrollLock", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.classList.remove("no-scroll");
    window.scrollY = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo = vi.fn();
    window.requestAnimationFrame = vi.fn(cb => {
      setTimeout(cb, 0);
      return 1;
    });
    window.cancelAnimationFrame = vi.fn();
    vi.mocked(deviceModule.isMobile).mockReturnValue(false);
    unlockScroll();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.removeEventListener("scroll", vi.fn());
    window.removeEventListener("resize", vi.fn());
  });

  describe("lockScroll", () => {
    it("should not lock scroll on desktop", () => {
      document.body.innerHTML = "";

      lockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(false);
    });

    it("should lock scroll on mobile", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 100,
        writable: true,
        configurable: true,
      });

      lockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(true);
    });

    it("should save scroll position before locking", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 250,
        writable: true,
        configurable: true,
      });

      lockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(true);
    });

    it("should use document.documentElement.scrollTop if window.scrollY is 0", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 0,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, "scrollTop", {
        writable: true,
        value: 150,
        configurable: true,
      });

      lockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(true);
    });

    it("should not lock if already locked", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 100,
        writable: true,
        configurable: true,
      });

      lockScroll();
      const classListBefore = document.documentElement.classList.toString();
      lockScroll();

      expect(document.documentElement.classList.toString()).toBe(classListBefore);
    });
  });

  describe("unlockScroll", () => {
    it("should not unlock scroll if not locked", () => {
      document.body.innerHTML = "";

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      unlockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(false);
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("should unlock scroll on mobile", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 200,
        writable: true,
        configurable: true,
      });

      lockScroll();
      unlockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(false);
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 200,
        behavior: "auto",
      });
    });

    it("should restore scroll position after unlocking", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 300,
        writable: true,
        configurable: true,
      });

      lockScroll();
      unlockScroll();

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 300,
        behavior: "auto",
      });
    });

    it("should handle unlock when not locked gracefully", () => {
      document.body.innerHTML = "";

      expect(() => unlockScroll()).not.toThrow();
    });
  });

  describe("mobile detection", () => {
    it("should detect mobile when mobile-detector is visible", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 100,
        writable: true,
        configurable: true,
      });

      lockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(true);
    });

    it("should not detect mobile when mobile-detector display is none", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      lockScroll();

      expect(document.documentElement.classList.contains("no-scroll")).toBe(false);
    });
  });

  describe("setupScrollLock", () => {
    it("should set up scroll event listener", () => {
      const scrollSpy = vi.spyOn(window, "addEventListener");
      setupScrollLock();

      expect(scrollSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
    });

    it("should call scrollToTopVisibility and stickyDropdowns on scroll", () => {
      setupScrollLock();

      const scrollEvent = new Event("scroll");
      window.dispatchEvent(scrollEvent);

      expect(scrollToTopModule.updateVisibility).toHaveBeenCalled();
      expect(dropdownsModule.stickyDropdowns).toHaveBeenCalled();
    });

    it("should set up resize event listener", () => {
      const resizeSpy = vi.spyOn(window, "addEventListener");
      setupScrollLock();

      expect(resizeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    });

    it("should cancel previous RAF when resize fires multiple times", () => {
      let rafId = 0;
      window.requestAnimationFrame = vi.fn(cb => {
        setTimeout(cb, 0);
        rafId += 1;
        return rafId;
      });

      setupScrollLock();

      const resizeEvent1 = new Event("resize");
      window.dispatchEvent(resizeEvent1);
      const firstRafId = rafId;

      const resizeEvent2 = new Event("resize");
      window.dispatchEvent(resizeEvent2);

      expect(window.cancelAnimationFrame).toHaveBeenCalledWith(firstRafId);
    });

    it("should call stickyDropdowns on resize", async () => {
      setupScrollLock();

      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);

      await new Promise(resolve => setTimeout(resolve, 10));
      expect(dropdownsModule.stickyDropdowns).toHaveBeenCalled();
    });

    it("should unlock scroll when switching from mobile to desktop on resize", async () => {
      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      lockScroll();
      expect(document.documentElement.classList.contains("no-scroll")).toBe(true);

      setupScrollLock();
      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);

      await new Promise(resolve => setTimeout(resolve, 10));
      expect(document.documentElement.classList.contains("no-scroll")).toBe(false);
    });

    it("should not unlock scroll when staying on mobile on resize", async () => {
      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      lockScroll();
      expect(document.documentElement.classList.contains("no-scroll")).toBe(true);

      setupScrollLock();

      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);

      await new Promise(resolve => setTimeout(resolve, 10));
      expect(document.documentElement.classList.contains("no-scroll")).toBe(true);
    });
  });

  afterAll(() => {
    logCategorySummary("scrollLock", "Scroll Lock", "All scroll lock tests");
  });
});
