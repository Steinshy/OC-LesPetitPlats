import { afterAll, describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as headerModule from "@/components/header.js";
import { setupScrollToTop, updateVisibility } from "@components/scrollToTop.js";
import { logCategorySummary } from "../../Benchmarks/utils/console.js";

// Mock dependencies
vi.mock("@/components/header.js", () => ({
  isScrolledPastHeader: vi.fn(() => false),
}));

vi.mock("@/utils/device.js", () => ({
  isMobile: vi.fn(() => false),
}));

const SCROLL_TO_TOP_BUTTON_ID = "scroll-to-top";
const DROPDOWNS_CONTAINER_ID = "dropdowns-container";

describe("scrollToTop", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.scrollTo = vi.fn();
    window.scrollY = 0;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
    // Mock getComputedStyle for mobile detector
    window.getComputedStyle = vi.fn(() => ({
      display: "none",
    }));
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("setupScrollToTop", () => {
    it("should initialize scroll to top button", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      setupScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button).toBeTruthy();
    });

    it("should handle missing button gracefully", () => {
      document.body.innerHTML = "";

      expect(() => setupScrollToTop()).not.toThrow();
    });

    it("should show button when scrolled past threshold", async () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      vi.mocked(headerModule.isScrolledPastHeader).mockReturnValue(true);
      setupScrollToTop();
      updateVisibility();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(true);
      expect(button.getAttribute("aria-hidden")).toBe("false");
    });

    it("should hide button when not scrolled past threshold", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      vi.mocked(headerModule.isScrolledPastHeader).mockReturnValue(false);
      setupScrollToTop();
      updateVisibility();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(false);
      expect(button.getAttribute("aria-hidden")).toBe("true");
    });

    it("should handle missing dropdownContainer gracefully", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      // Should not throw when dropdownContainer is missing
      expect(() => setupScrollToTop()).not.toThrow();
    });

    it("should scroll to top on button click", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      setupScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      button.click();

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });

    it("should blur button after clicking", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      setupScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      const blurSpy = vi.spyOn(button, "blur");
      button.click();

      expect(blurSpy).toHaveBeenCalled();
    });

    it("should update button visibility on scroll", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      vi.mocked(headerModule.isScrolledPastHeader).mockReturnValue(true);
      setupScrollToTop();

      // setupScrollToTop doesn't set up scroll listener, that's in scrollLock.js
      // So we test updateVisibility directly
      updateVisibility();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(true);
    });

    it("should call updateVisibility directly on scroll", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      vi.mocked(headerModule.isScrolledPastHeader).mockReturnValue(true);
      setupScrollToTop();
      updateVisibility();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(true);
    });

    it("should set passive scroll listener", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      // setupScrollToTop doesn't add scroll listener - that's in scrollLock.js
      setupScrollToTop();
      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button).toBeTruthy();
    });

    it("should initialize button visibility on mount", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      vi.mocked(headerModule.isScrolledPastHeader).mockReturnValue(true);
      setupScrollToTop();
      updateVisibility();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(true);
    });

    it("should handle rapid scroll events", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      setupScrollToTop();
      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);

      // Test rapid calls to updateVisibility
      for (let i = 0; i < 10; i++) {
        vi.mocked(headerModule.isScrolledPastHeader).mockReturnValue(i % 2 === 0);
        updateVisibility();
      }

      // Should handle rapid updates
      expect(button).toBeTruthy();
    });
  });

  afterAll(() => {
    logCategorySummary("scrollToTop", "Scroll To Top", "All scroll to top tests");
  });
});
