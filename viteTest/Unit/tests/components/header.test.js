import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  headerElement,
  getHeaderHeight,
  isScrolledPastHeader,
  setupHeader,
} from "@/components/header.js";
import * as deviceModule from "@/utils/device.js";
import * as skeletonsModule from "@/components/skeletons/manager.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

vi.mock("@/utils/device.js", () => ({
  isMobile: vi.fn(() => false),
}));

const mockHide = vi.fn();
vi.mock("@/components/skeletons/manager.js", () => ({
  headerSkeleton: vi.fn(() => ({
    hide: mockHide,
  })),
}));

describe("header", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    mockHide.mockClear();
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  describe("headerElement", () => {
    it("should return header element when it exists", () => {
      document.body.innerHTML = '<div id="header"></div>';

      const result = headerElement();

      expect(result.header).toBeTruthy();
      expect(result.header.id).toBe("header");
    });

    it("should return null header when element does not exist", () => {
      document.body.innerHTML = "";

      const result = headerElement();

      expect(result.header).toBeNull();
    });
  });

  describe("getHeaderHeight", () => {
    it("should return header height when header exists", () => {
      const header = document.createElement("div");
      header.id = "header";
      header.style.height = "200px";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 200,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(200);
    });

    it("should return 0 when header does not exist", () => {
      document.body.innerHTML = "";

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });

    it("should return 0 when header offsetHeight is 0", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 0,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });

    it("should return 0 when header offsetHeight is undefined", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: undefined,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });
  });

  describe("isScrolledPastHeader", () => {
    it("should return false when header does not exist", () => {
      document.body.innerHTML = "";

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    it("should return false when scrollY is less than header height on desktop", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 100,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 50,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    it("should return true when scrollY is greater than header height on desktop", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 100,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 150,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      const result = isScrolledPastHeader();

      expect(result).toBe(true);
    });

    it("should use mobile threshold (35% of header height) when on mobile", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 100,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 40,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);

      const result = isScrolledPastHeader();

      expect(result).toBe(true);
    });

    it("should return false when scrollY is less than mobile threshold", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 100,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 30,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    it("should handle header with 0 height", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 0,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 10,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      const result = isScrolledPastHeader();

      expect(result).toBe(true);
    });

    it("should return false when scrollY exactly equals header height on desktop", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 100,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 100,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    it("should return false when scrollY exactly equals mobile threshold", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 100,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 35,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(true);

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    it("should handle negative scrollY values", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 100,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: -10,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    it("should handle offsetHeight being undefined", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: undefined,
        writable: false,
        configurable: true,
      });

      Object.defineProperty(window, "scrollY", {
        value: 10,
        writable: true,
        configurable: true,
      });

      vi.mocked(deviceModule.isMobile).mockReturnValue(false);

      const result = isScrolledPastHeader();

      expect(result).toBe(true);
    });
  });

  describe("setupHeader", () => {
    it("should not set background when recipesData is null", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      setupHeader(null);

      expect(skeletonsModule.headerSkeleton).not.toHaveBeenCalled();
      expect(header.style.backgroundImage).toBe("");
    });

    it("should not set background when recipesData is undefined", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      setupHeader(undefined);

      expect(skeletonsModule.headerSkeleton).not.toHaveBeenCalled();
      expect(header.style.backgroundImage).toBe("");
    });

    it("should hide skeleton and set random background image", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: "image1.webp",
            jpgUrl: "image1.jpg",
          },
        },
        {
          images: {
            webpUrl: "image2.webp",
            jpgUrl: "image2.jpg",
          },
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(mockHide).toHaveBeenCalled();
      expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.webp["']?\)/);

      randomSpy.mockRestore();
    });

    it("should use jpgUrl when webpUrl is not available", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            jpgUrl: "image1.jpg",
          },
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.jpg["']?\)/);

      randomSpy.mockRestore();
    });

    it("should not set background image when no image URLs are available", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {},
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toBe("");

      randomSpy.mockRestore();
    });

    it("should filter out recipes without images", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: "image1.webp",
          },
        },
        {},
        {
          images: null,
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.webp["']?\)/);

      randomSpy.mockRestore();
    });

    it("should handle empty images array", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: null,
        },
      ];

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toBe("");
    });

    it("should return early when header element is missing", () => {
      document.body.innerHTML = "";

      const recipesData = [
        {
          images: {
            webpUrl: "image1.webp",
          },
        },
      ];

      expect(() => setupHeader(recipesData)).not.toThrow();
      expect(mockHide).not.toHaveBeenCalled();
    });

    it("should handle empty recipesData array", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      setupHeader([]);

      expect(mockHide).toHaveBeenCalled();
      expect(header.style.backgroundImage).toBe("");
    });

    it("should use jpgUrl when webpUrl is empty string", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: "",
            jpgUrl: "image1.jpg",
          },
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.jpg["']?\)/);

      randomSpy.mockRestore();
    });

    it("should not set background when both webpUrl and jpgUrl are empty strings", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: "",
            jpgUrl: "",
          },
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toBe("");

      randomSpy.mockRestore();
    });

    it("should handle recipe with images object but no URL properties", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: "image1.webp",
          },
        },
        {
          images: {},
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toBe("");

      randomSpy.mockRestore();
    });

    it("should select different random images on multiple calls", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: "image1.webp",
          },
        },
        {
          images: {
            webpUrl: "image2.webp",
          },
        },
        {
          images: {
            webpUrl: "image3.webp",
          },
        },
      ];

      const randomSpy = vi
        .spyOn(Math, "random")
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.9);

      setupHeader(recipesData);
      expect(header.style.backgroundImage).toMatch(/image1\.webp/);

      setupHeader(recipesData);
      expect(header.style.backgroundImage).toMatch(/image2\.webp/);

      setupHeader(recipesData);
      expect(header.style.backgroundImage).toMatch(/image3\.webp/);

      randomSpy.mockRestore();
    });

    it("should handle recipesData that is not an array (object)", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = { length: 2, 0: { images: { webpUrl: "image1.webp" } } };

      expect(() => setupHeader(recipesData)).not.toThrow();
      expect(mockHide).not.toHaveBeenCalled();
      expect(header.style.backgroundImage).toBe("");
    });

    it("should handle recipesData that is not an array (string)", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      expect(() => setupHeader("not an array")).not.toThrow();
      expect(mockHide).not.toHaveBeenCalled();
      expect(header.style.backgroundImage).toBe("");
    });

    it("should handle recipesData that is not an array (number)", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      expect(() => setupHeader(123)).not.toThrow();
      expect(mockHide).not.toHaveBeenCalled();
      expect(header.style.backgroundImage).toBe("");
    });

    it("should handle recipe.images that is not an object (string)", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: "not an object",
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toBe("");

      randomSpy.mockRestore();
    });

    it("should handle recipe.images that is not an object (array)", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: ["not", "an", "object"],
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toBe("");

      randomSpy.mockRestore();
    });

    it("should handle webpUrl that is not a string (number)", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: 123,
            jpgUrl: "image1.jpg",
          },
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toMatch(/url\(["']?123["']?\)/);

      randomSpy.mockRestore();
    });

    it("should handle jpgUrl that is not a string (object)", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      const recipesData = [
        {
          images: {
            webpUrl: "image1.webp",
            jpgUrl: { url: "image1.jpg" },
          },
        },
      ];

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

      setupHeader(recipesData);

      expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.webp["']?\)/);

      randomSpy.mockRestore();
    });
  });

  afterAll(() => {
    logCategorySummary("header", "Header", "All header tests");
  });
});
