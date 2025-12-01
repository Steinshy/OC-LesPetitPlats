import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { lockScroll, unlockScroll } from "@/components/scrollLock.js";
import * as deviceModule from "@/utils/device.js";
import { logCategorySummary } from "../../Benchmarks/utils/console.js";

const MOBILE_DETECTOR_HTML = '<div class="mobile-detector"></div>';

// Mock device module
vi.mock("@/utils/device.js", () => ({
  isMobile: vi.fn(() => false),
}));

describe("scrollLock", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.style.cssText = "";
    window.scrollY = 0;
    document.documentElement.scrollTop = 0;
    // Mock window.scrollTo for test environment
    window.scrollTo = vi.fn();
    // Reset isMobile mock
    vi.mocked(deviceModule.isMobile).mockReturnValue(false);
    // Ensure scroll is unlocked before each test
    unlockScroll();
    vi.clearAllMocks();
  });

  describe("lockScroll", () => {
    it("should not lock scroll on desktop", () => {
      // Mock desktop (no mobile detector)
      document.body.innerHTML = "";

      const initialOverflow = document.body.style.overflow;
      const initialPosition = document.body.style.position;

      lockScroll();

      expect(document.body.style.overflow).toBe(initialOverflow);
      expect(document.body.style.position).toBe(initialPosition);
    });

    it("should lock scroll on mobile", () => {
      // Mock mobile detector
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 100,
        writable: true,
        configurable: true,
      });

      lockScroll();

      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");
      expect(document.body.style.top).toBe("-100px");
      expect(document.body.style.width).toBe("100%");
    });

    it("should save scroll position before locking", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      // Set scrollY directly
      Object.defineProperty(window, "scrollY", {
        value: 250,
        writable: true,
        configurable: true,
      });

      lockScroll();

      expect(document.body.style.top).toBe("-250px");
    });

    it("should use document.documentElement.scrollTop if window.scrollY is 0", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      // Set scrollY to 0
      Object.defineProperty(window, "scrollY", {
        value: 0,
        writable: true,
        configurable: true,
      });
      // Set documentElement.scrollTop
      Object.defineProperty(document.documentElement, "scrollTop", {
        writable: true,
        value: 150,
        configurable: true,
      });

      lockScroll();

      expect(document.body.style.top).toBe("-150px");
    });
  });

  describe("unlockScroll", () => {
    it("should not unlock scroll on desktop", () => {
      document.body.innerHTML = "";

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";

      unlockScroll();

      // unlockScroll always clears styles (sets to empty string)
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
    });

    it("should unlock scroll on mobile", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);
      Object.defineProperty(window, "scrollY", {
        value: 200,
        writable: true,
        configurable: true,
      });

      // First lock
      lockScroll();

      // Then unlock
      unlockScroll();

      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.body.style.top).toBe("");
      expect(document.body.style.width).toBe("");
      expect(window.scrollTo).toHaveBeenCalledWith(0, 200);
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

      expect(window.scrollTo).toHaveBeenCalledWith(0, 300);
    });

    it("should handle missing mobile detector gracefully", () => {
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

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should not detect mobile when mobile-detector display is none", () => {
      document.body.innerHTML = MOBILE_DETECTOR_HTML;

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      lockScroll();

      expect(document.body.style.overflow).toBe("");
    });
  });

  afterAll(() => {
    logCategorySummary("scrollLock", "Scroll Lock", "All scroll lock tests");
  });
});
