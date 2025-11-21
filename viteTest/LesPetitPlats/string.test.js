import { afterAll, describe, it, expect, beforeEach } from "vitest";
import {
  normalizeString,
  cleanupDuplicatedItems,
  updateCounter,
  jpgUrl,
  webpUrl,
  imageUrl,
  baseUrl,
  dataUrl,
} from "../../src/utils/string.js";
import { logCategorySummary } from "./utils/logging/console.js";

describe("string", () => {
  describe("normalizeString", () => {
    it("should normalize string to lowercase", () => {
      expect(normalizeString("HELLO")).toBe("hello");
      expect(normalizeString("Hello World")).toBe("hello world");
    });

    it("should remove accents", () => {
      expect(normalizeString("éclairs")).toBe("eclairs");
      expect(normalizeString("café")).toBe("cafe");
      expect(normalizeString("crème")).toBe("creme");
      expect(normalizeString("pâté")).toBe("pate");
    });

    it("should remove parentheses and their content", () => {
      expect(normalizeString("tomate (red)")).toBe("tomate");
      expect(normalizeString("poulet (chicken)")).toBe("poulet");
      expect(normalizeString("(test) hello")).toBe("hello");
    });

    it("should trim whitespace", () => {
      expect(normalizeString("  hello  ")).toBe("hello");
      expect(normalizeString("\t\nworld\t\n")).toBe("world");
    });

    it("should handle null and undefined", () => {
      expect(normalizeString(null)).toBe("");
      expect(normalizeString(undefined)).toBe("");
      expect(normalizeString("")).toBe("");
    });

    it("should handle numbers", () => {
      expect(normalizeString("123")).toBe("123");
      expect(normalizeString(123)).toBe("123");
    });

    it("should handle special characters", () => {
      expect(normalizeString("hello-world")).toBe("hello-world");
      expect(normalizeString("test@email.com")).toBe("test@email.com");
    });

    it("should handle complex strings with accents and parentheses", () => {
      expect(normalizeString("Tomate (rouge)")).toBe("tomate");
      expect(normalizeString("  CAFÉ & THÉ  ")).toBe("cafe & the");
    });
  });

  describe("cleanupDuplicatedItems", () => {
    it("should remove duplicates based on normalized values", () => {
      const items = ["tomate", "Tomate", "TOMATE"];
      const result = cleanupDuplicatedItems(items);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Tomate");
    });

    it("should handle plural forms as duplicates", () => {
      const items = ["tomate", "tomates", "Tomate"];
      const result = cleanupDuplicatedItems(items);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Tomate");
    });

    it("should capitalize first letter of items", () => {
      const items = ["tomate", "carrot"];
      const result = cleanupDuplicatedItems(items);
      expect(result).toEqual(["Carrot", "Tomate"]);
    });

    it("should sort items in French locale", () => {
      const items = ["zucchini", "tomate", "carrot"];
      const result = cleanupDuplicatedItems(items);
      expect(result[0]).toBe("Carrot");
      expect(result[1]).toBe("Tomate");
      expect(result[2]).toBe("Zucchini");
    });

    it("should filter out empty strings", () => {
      const items = ["tomate", "", "  ", "carrot"];
      const result = cleanupDuplicatedItems(items);
      expect(result).toHaveLength(2);
    });

    it("should handle items with accents", () => {
      const items = ["café", "cafe", "Café"];
      const result = cleanupDuplicatedItems(items);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Café");
    });

    it("should return empty array for empty input", () => {
      expect(cleanupDuplicatedItems([])).toEqual([]);
      expect(cleanupDuplicatedItems(undefined)).toEqual([]);
    });

    it("should handle mixed case and whitespace", () => {
      const items = ["  tomate  ", "TOMATE", "tomates"];
      const result = cleanupDuplicatedItems(items);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Tomate");
    });
  });

  describe("updateCounter", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("should update counter with correct count", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';
      updateCounter(5);
      const counter = document.getElementById("results-counter");
      expect(counter.innerHTML).toBe("5 résultats");
    });

    it("should use singular form for count of 1", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';
      updateCounter(1);
      const counter = document.getElementById("results-counter");
      expect(counter.innerHTML).toBe("1 résultat");
    });

    it("should use plural form for count of 0", () => {
      document.body.innerHTML = '<div id="results-counter"></div>';
      updateCounter(0);
      const counter = document.getElementById("results-counter");
      expect(counter.innerHTML).toBe("0 résultats");
    });

    it("should handle missing counter element gracefully", () => {
      document.body.innerHTML = "";
      expect(() => updateCounter(5)).not.toThrow();
    });

    it("should update existing counter content", () => {
      document.body.innerHTML = '<div id="results-counter">Old content</div>';
      updateCounter(10);
      const counter = document.getElementById("results-counter");
      expect(counter.innerHTML).toBe("10 résultats");
    });
  });

  describe("imageUrl", () => {
    it("should construct image URL with base URL", () => {
      const result = imageUrl("test.jpg");
      expect(result).toContain("recipes/test.jpg");
    });

    it("should handle paths with base URL", () => {
      const result = imageUrl("test.jpg");
      expect(result).toMatch(/\/recipes\/test\.jpg$/);
    });
  });

  describe("jpgUrl", () => {
    it("should construct JPG URL from image name", () => {
      const result = jpgUrl("test.jpg");
      expect(result).toContain("recipes/test.jpg");
    });

    it("should remove file extension before adding .jpg", () => {
      const result = jpgUrl("test.png");
      expect(result).toContain("recipes/test.jpg");
      expect(result).not.toContain("test.png.jpg");
    });

    it("should handle filename without extension", () => {
      const result = jpgUrl("test");
      expect(result).toContain("recipes/test.jpg");
    });

    it("should handle null and undefined", () => {
      expect(jpgUrl(null)).toContain("recipes/null.jpg");
      expect(jpgUrl(undefined)).toContain("recipes/undefined.jpg");
    });
  });

  describe("webpUrl", () => {
    it("should construct WebP URL from image name", () => {
      const result = webpUrl("test.jpg");
      expect(result).toContain("recipes/test.webp");
    });

    it("should remove file extension before adding .webp", () => {
      const result = webpUrl("test.png");
      expect(result).toContain("recipes/test.webp");
      expect(result).not.toContain("test.png.webp");
    });

    it("should handle filename without extension", () => {
      const result = webpUrl("test");
      expect(result).toContain("recipes/test.webp");
    });

    it("should handle null and undefined", () => {
      expect(webpUrl(null)).toContain("recipes/null.webp");
      expect(webpUrl(undefined)).toContain("recipes/undefined.webp");
    });
  });

  describe("baseUrl and dataUrl", () => {
    it("should export baseUrl", () => {
      expect(baseUrl).toBeDefined();
      expect(typeof baseUrl).toBe("string");
    });

    it("should export dataUrl", () => {
      expect(dataUrl).toBeDefined();
      expect(typeof dataUrl).toBe("string");
      expect(dataUrl).toContain("api/data.json");
    });
  });

  afterAll(() => {
    logCategorySummary("string", "String Utils", "All string utility tests");
  });
});

