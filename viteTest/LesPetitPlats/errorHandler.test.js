import { afterAll, describe, it, expect, beforeEach } from "vitest";
import { showError, hideError } from "../../src/utils/errorHandler.js";
import { logCategorySummary } from "./utils/logging/console.js";

const ERROR_BANNER_SELECTOR = "#error-banner";

describe("errorHandler", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("showError", () => {
    it("should create error banner when it doesn't exist", () => {
      document.body.innerHTML = '<div id="root"></div>';

      showError("Test error message");

      const banner = document.querySelector(ERROR_BANNER_SELECTOR);
      expect(banner).toBeTruthy();
      expect(banner.textContent).toBe("Test error message");
      expect(banner.getAttribute("role")).toBe("alert");
      expect(banner.classList.contains("error-banner")).toBe(true);
    });

    it("should update existing error banner", () => {
      document.body.innerHTML = `
        <div id="root">
          <div id="error-banner">Old message</div>
        </div>
      `;

      showError("New error message");

      const banner = document.querySelector(ERROR_BANNER_SELECTOR);
      expect(banner.textContent).toBe("New error message");
      expect(banner.hidden).toBe(false);
    });

    it("should make existing banner visible", () => {
      document.body.innerHTML = `
        <div id="root">
          <div id="error-banner" hidden>Hidden message</div>
        </div>
      `;

      showError("New message");

      const banner = document.querySelector(ERROR_BANNER_SELECTOR);
      expect(banner.hidden).toBe(false);
    });

    it("should handle missing root element gracefully", () => {
      document.body.innerHTML = "";

      expect(() => showError("Error")).not.toThrow();
    });

    it("should insert banner at beginning of root", () => {
      document.body.innerHTML = `
        <div id="root">
          <div>Existing content</div>
        </div>
      `;

      showError("Error");

      const root = document.querySelector("#root");
      const banner = root.firstElementChild;
      expect(banner.id).toBe("error-banner");
    });

    it("should display error message as provided", () => {
      document.body.innerHTML = '<div id="root"></div>';

      showError("Error message");

      const banner = document.querySelector(ERROR_BANNER_SELECTOR);
      expect(banner.textContent).toBe("Error message");
    });
  });

  describe("hideError", () => {
    it("should hide error banner", () => {
      document.body.innerHTML = `
        <div id="error-banner">Error message</div>
      `;

      hideError();

      const banner = document.querySelector(ERROR_BANNER_SELECTOR);
      expect(banner.getAttribute("hidden")).toBe("");
    });

    it("should handle missing banner gracefully", () => {
      document.body.innerHTML = "";

      expect(() => hideError()).not.toThrow();
    });

    it("should set hidden attribute even if already hidden", () => {
      document.body.innerHTML = `
        <div id="error-banner" hidden>Error</div>
      `;

      hideError();

      const banner = document.querySelector(ERROR_BANNER_SELECTOR);
      expect(banner.getAttribute("hidden")).toBe("");
    });
  });

  describe("error banner lifecycle", () => {
    it("should create, show, and hide error banner", () => {
      document.body.innerHTML = '<div id="root"></div>';

      showError("First error");
      const banner1 = document.querySelector("#error-banner");
      expect(banner1).toBeTruthy();
      expect(banner1.hidden).toBe(false);

      hideError();
      expect(banner1.getAttribute("hidden")).toBe("");

      showError("Second error");
      const banner2 = document.querySelector("#error-banner");
      expect(banner2).toBe(banner1); // Same element
      expect(banner2.textContent).toBe("Second error");
      expect(banner2.hidden).toBe(false);
    });
  });

  afterAll(() => {
    logCategorySummary("errorHandler", "Error Handler", "All error handler tests");
  });
});

