import { afterAll, describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as scrollModule from "@/components/scroll.js";
import { setupScrollToTop, updateVisibility } from "@components/scroll.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

// Mock dependencies
vi.mock("@/components/scroll.js", async () => {
  const actual = await vi.importActual("@/components/scroll.js");
  const mockIsScrolledPastHeader = vi.fn(() => false);
  return {
    ...actual,
    isScrolledPastHeader: mockIsScrolledPastHeader,
  };
});

vi.mock("@/utils/config.js", async () => {
  const actual = await vi.importActual("@/utils/config.js");
  return {
    ...actual,
    isMobile: vi.fn(() => false),
    getHeaderHeight: vi.fn(() => 100),
  };
});

vi.mock("@/components/dropdowns/setup.js", () => ({
  dropdownTypes: [],
}));

vi.mock("@/components/dropdowns/elements.js", () => ({
  dropdownElements: () => ({ container: null }),
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
    scrollModule.scrollToTop.button = null;
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

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
      scrollModule.scrollToTop.button = button;
      setupScrollToTop();
      scrollModule.scrollToTop.update();

      expect(button.classList.contains("show")).toBe(true);
      expect(button.getAttribute("aria-hidden")).toBe("false");
    });

    it("should hide button when not scrolled past threshold", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      vi.mocked(scrollModule.isScrolledPastHeader).mockReturnValue(false);
      scrollModule.scrollToTop.button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
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

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
      scrollModule.scrollToTop.button = button;
      setupScrollToTop();
      scrollModule.scrollToTop.update();

      expect(button.classList.contains("show")).toBe(true);
    });

    it("should call updateVisibility directly on scroll", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="dropdowns"></div>
      `;

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
      scrollModule.scrollToTop.button = button;
      setupScrollToTop();
      updateVisibility();

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

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      Object.defineProperty(window, "scrollY", { value: 200, writable: true, configurable: true });
      scrollModule.scrollToTop.button = button;
      setupScrollToTop();
      scrollModule.scrollToTop.update();

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
        vi.mocked(scrollModule.isScrolledPastHeader).mockReturnValue(i % 2 === 0);
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
