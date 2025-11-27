import { afterAll, describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initScrollToTop } from "@/components/scrollToTop.js";
import { logCategorySummary } from "@tests-logging/console.js";

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

  describe("initScrollToTop", () => {
    it("should initialize scroll to top button", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button).toBeTruthy();
    });

    it("should handle missing button gracefully", () => {
      document.body.innerHTML = "";

      expect(() => initScrollToTop()).not.toThrow();
    });

    it("should show button when scrolled past threshold", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="${DROPDOWNS_CONTAINER_ID}"></div>
      `;

      Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(true);
      expect(button.getAttribute("aria-hidden")).toBe("false");
    });

    it("should hide button when not scrolled past threshold", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="${DROPDOWNS_CONTAINER_ID}"></div>
      `;

      Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(false);
      expect(button.getAttribute("aria-hidden")).toBe("true");
    });

    it("should handle missing dropdownContainer gracefully", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });

      // Should not throw when dropdownContainer is missing
      expect(() => initScrollToTop()).not.toThrow();
    });

    it("should scroll to top on button click", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      button.click();

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });

    it("should blur button after clicking", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      const blurSpy = vi.spyOn(button, "blur");
      button.click();

      expect(blurSpy).toHaveBeenCalled();
    });

    it("should update button visibility on scroll", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="${DROPDOWNS_CONTAINER_ID}"></div>
      `;

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });

      // Trigger scroll event - implementation calls updateVisibility directly (no requestAnimationFrame)
      window.dispatchEvent(new Event("scroll"));

      expect(button.classList.contains("show")).toBe(true);
    });

    it("should call updateVisibility directly on scroll", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="${DROPDOWNS_CONTAINER_ID}"></div>
      `;

      initScrollToTop();

      const _dropdownContainer = document.getElementById(DROPDOWNS_CONTAINER_ID);
      Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });

      // Implementation calls updateVisibility directly (no requestAnimationFrame)
      window.dispatchEvent(new Event("scroll"));

      // Should update immediately
      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      expect(button.classList.contains("show")).toBe(true);
    });

    it("should set passive scroll listener", () => {
      document.body.innerHTML = `<button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>`;

      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      initScrollToTop();

      const scrollCall = addEventListenerSpy.mock.calls.find(call => call[0] === "scroll");
      expect(scrollCall).toBeDefined();
      expect(scrollCall[2]?.passive).toBe(true);
    });

    it("should initialize button visibility on mount", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="${DROPDOWNS_CONTAINER_ID}"></div>
      `;

      Object.defineProperty(window, "scrollY", { value: 500, writable: true, configurable: true });

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      // Initial visibility check should run - should show when scrollY > 300
      expect(button.classList.contains("show")).toBe(true);
    });

    it("should handle rapid scroll events", () => {
      document.body.innerHTML = `
        <button id="${SCROLL_TO_TOP_BUTTON_ID}"></button>
        <div id="${DROPDOWNS_CONTAINER_ID}"></div>
      `;

      initScrollToTop();

      const button = document.getElementById(SCROLL_TO_TOP_BUTTON_ID);
      const classListSpy = vi.spyOn(button.classList, "toggle");

      // Rapid scroll events - implementation calls updateVisibility directly for each event
      for (let i = 0; i < 10; i++) {
        Object.defineProperty(window, "scrollY", {
          value: i * 100,
          writable: true,
          configurable: true,
        });
        window.dispatchEvent(new Event("scroll"));
      }

      // Each scroll event triggers updateVisibility directly (no throttling)
      // Toggle should be called for each event
      expect(classListSpy).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    logCategorySummary("scrollToTop", "Scroll To Top", "All scroll to top tests");
  });
});
