import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { logCategorySummary } from "../../utils/logging/console.js";
import { lockBodyScroll, unlockBodyScroll } from "@/components/bodyScroll.js";

const MOBILE_DETECTOR_HTML = '<div class="mobile-detector"></div>';

describe("bodyScroll", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.style.cssText = "";
    window.scrollY = 0;
    document.documentElement.scrollTop = 0;
    vi.clearAllMocks();
  });

  describe("lockBodyScroll", () => {
    it("should not lock scroll on desktop", () => {
      // Mock desktop (no mobile detector)
      document.body.innerHTML = "";

      const initialOverflow = document.body.style.overflow;
      const initialPosition = document.body.style.position;

      lockBodyScroll();

      expect(document.body.style.overflow).toBe(initialOverflow);
      expect(document.body.style.position).toBe(initialPosition);
    });

    it("should lock scroll on mobile", () => {
      // Mock mobile detector
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      // Mock getComputedStyle to return display: block (mobile)
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = vi.fn(() => ({
        display: "block",
      }));

      window.scrollY = 100;

      lockBodyScroll();

      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");
      expect(document.body.style.top).toBe("-100px");
      expect(document.body.style.width).toBe("100%");

      // Restore
      window.getComputedStyle = originalGetComputedStyle;
    });

    it("should save scroll position before locking", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = vi.fn(() => ({
        display: "block",
      }));

      window.scrollY = 250;

      lockBodyScroll();

      expect(document.body.style.top).toBe("-250px");

      window.getComputedStyle = originalGetComputedStyle;
    });

    it("should use document.documentElement.scrollTop if window.scrollY is 0", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = vi.fn(() => ({
        display: "block",
      }));

      window.scrollY = 0;
      Object.defineProperty(document.documentElement, "scrollTop", {
        writable: true,
        value: 150,
      });

      lockBodyScroll();

      expect(document.body.style.top).toBe("-150px");

      window.getComputedStyle = originalGetComputedStyle;
    });
  });

  describe("unlockBodyScroll", () => {
    it("should not unlock scroll on desktop", () => {
      document.body.innerHTML = "";

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";

      unlockBodyScroll();

      // Should remain unchanged on desktop
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");
    });

    it("should unlock scroll on mobile", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = vi.fn(() => ({
        display: "block",
      }));

      // First lock
      window.scrollY = 200;
      lockBodyScroll();

      // Then unlock
      const scrollToSpy = vi.spyOn(window, "scrollTo");
      unlockBodyScroll();

      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.body.style.top).toBe("");
      expect(document.body.style.width).toBe("");
      expect(scrollToSpy).toHaveBeenCalledWith(0, 200);

      window.getComputedStyle = originalGetComputedStyle;
      scrollToSpy.mockRestore();
    });

    it("should restore scroll position after unlocking", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = vi.fn(() => ({
        display: "block",
      }));

      window.scrollY = 300;
      lockBodyScroll();

      const scrollToSpy = vi.spyOn(window, "scrollTo");
      unlockBodyScroll();

      expect(scrollToSpy).toHaveBeenCalledWith(0, 300);

      window.getComputedStyle = originalGetComputedStyle;
      scrollToSpy.mockRestore();
    });

    it("should handle missing mobile detector gracefully", () => {
      document.body.innerHTML = "";

      expect(() => unlockBodyScroll()).not.toThrow();
    });
  });

  describe("mobile detection", () => {
    it("should detect mobile when mobile-detector is visible", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = vi.fn(() => ({
        display: "block",
      }));

      window.scrollY = 100;
      lockBodyScroll();

      expect(document.body.style.overflow).toBe("hidden");

      window.getComputedStyle = originalGetComputedStyle;
    });

    it("should not detect mobile when mobile-detector display is none", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = vi.fn(() => ({
        display: "none",
      }));

      lockBodyScroll();

      expect(document.body.style.overflow).toBe("");

      window.getComputedStyle = originalGetComputedStyle;
    });
  });

  afterAll(() => {
    logCategorySummary("bodyScroll", "Body Scroll", "All body scroll tests");
  });
});

