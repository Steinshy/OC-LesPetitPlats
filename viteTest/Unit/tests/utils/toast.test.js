import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";

// Store mock toasts in a way accessible to both mock and tests
const mockToasts = [];

vi.mock("toastify-js", () => {
  // Create a closure to access mockToasts
  const toasts = [];

  const mockToastify = vi.fn(options => {
    const toast = {
      showToast: vi.fn(() => {
        // Create a mock toast element in DOM for testing
        const toastElement = document.createElement("div");
        toastElement.className = "toastify";
        toastElement.textContent = options.text;
        toastElement.setAttribute("role", "alert");
        document.body.appendChild(toastElement);
      }),
      hideToast: vi.fn(() => {
        const toastElements = document.querySelectorAll(".toastify");
        toastElements.forEach(element => element.remove());
      }),
    };
    toasts.push(toast);
    // Also push to global mockToasts for test access
    if (typeof globalThis.mockToasts !== "undefined") {
      globalThis.mockToasts.push(toast);
    }
    return toast;
  });

  return {
    default: mockToastify,
  };
});

vi.mock("toastify-js/src/toastify.css", () => ({}));

// Import after mock is set up

import { logCategorySummary } from "@viteTest-helper/message.js";
import { hideToast, showToast } from "~/src/utils/toast.js";

// Make mockToasts accessible globally for the mock
globalThis.mockToasts = mockToasts;

describe("toast", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockToasts.length = 0;
    vi.clearAllMocks();
  });

  describe("showToast", () => {
    it("should create error toast when called", async () => {
      await showToast("Test error message");

      // Check toast was shown
      const toast = document.querySelector(".toastify");
      expect(toast).toBeTruthy();
      expect(toast.textContent).toBe("Test error message");
      expect(toast.getAttribute("role")).toBe("alert");
    });

    it("should create new toast with updated message", async () => {
      await showToast("New error message");

      const toast = document.querySelector(".toastify");
      expect(toast).toBeTruthy();
      expect(toast.textContent).toBe("New error message");
    });

    it("should create toast with new message", async () => {
      await showToast("New message");

      const toast = document.querySelector(".toastify");
      expect(toast).toBeTruthy();
      expect(toast.textContent).toBe("New message");
    });

    it("should handle errors gracefully", async () => {
      await expect(showToast("Error")).resolves.not.toThrow();
    });

    it("should create toast when called", async () => {
      await showToast("Error");

      const toast = document.querySelector(".toastify");
      expect(toast).toBeTruthy();
    });

    it("should display error message as provided", async () => {
      await showToast("Error message");

      const toast = document.querySelector(".toastify");
      expect(toast).toBeTruthy();
      expect(toast.textContent).toBe("Error message");
    });
  });

  describe("hideToast", () => {
    it("should hide error toast", async () => {
      await showToast("Error message");
      const toast = document.querySelector(".toastify");
      expect(toast).toBeTruthy();

      hideToast();

      // Check that hideToast was called on all active toasts
      mockToasts.forEach(toast => {
        expect(toast.hideToast).toHaveBeenCalled();
      });

      const remainingToast = document.querySelector(".toastify");
      expect(remainingToast).toBeNull();
    });

    it("should handle missing toast gracefully", () => {
      expect(() => hideToast()).not.toThrow();
    });

    it("should hide toast even if called multiple times", async () => {
      await showToast("Error");
      hideToast();
      expect(() => hideToast()).not.toThrow();
    });
  });

  describe("toast lifecycle", () => {
    it("should create, show, and hide error toast", async () => {
      await showToast("First error");
      const toast1 = document.querySelector(".toastify");
      expect(toast1).toBeTruthy();
      expect(toast1.textContent).toBe("First error");

      hideToast();
      const hiddenToast = document.querySelector(".toastify");
      expect(hiddenToast).toBeNull();

      await showToast("Second error");
      const toast2 = document.querySelector(".toastify");
      expect(toast2).toBeTruthy();
      expect(toast2.textContent).toBe("Second error");
    });
  });

  afterAll(() => {
    logCategorySummary("toast", "Toast", "All toast tests");
  });
});
