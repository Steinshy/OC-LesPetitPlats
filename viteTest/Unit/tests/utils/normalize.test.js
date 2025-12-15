import { describe, it, expect } from "vitest";
import { normalizeString, cleanupDuplicatedItems, toFilterItem } from "~/src/utils/normalize.js";

describe("normalize", () => {
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

  describe("toFilterItem", () => {
    it("should convert raw value to filter item", () => {
      const result = toFilterItem("Tomate");
      expect(result).toBeDefined();
      expect(result.label).toBe("Tomate");
      expect(result.value).toBe("tomate");
      expect(result.key).toBe("tomate");
    });

    it("should handle values with parentheses", () => {
      const result = toFilterItem("Tomate (rouge)");
      expect(result.label).toBe("Tomate");
      expect(result.value).toBe("tomate");
    });

    it("should remove trailing 's' for deduplication key", () => {
      const result = toFilterItem("Tomates");
      expect(result.key).toBe("tomate");
      expect(result.value).toBe("tomates");
    });

    it("should handle plural forms correctly", () => {
      const result1 = toFilterItem("tomate");
      const result2 = toFilterItem("tomates");
      expect(result1.key).toBe("tomate");
      expect(result2.key).toBe("tomate");
    });

    it("should return null for empty strings", () => {
      expect(toFilterItem("")).toBeNull();
      expect(toFilterItem("   ")).toBeNull();
    });

    it("should return null for null or undefined", () => {
      expect(toFilterItem(null)).toBeNull();
      expect(toFilterItem(undefined)).toBeNull();
    });

    it("should normalize and capitalize label", () => {
      const result = toFilterItem("  TOMATE  ");
      expect(result.label).toBe("Tomate");
      expect(result.value).toBe("tomate");
    });

    it("should handle accents in values", () => {
      const result = toFilterItem("Café");
      expect(result.label).toBe("Café");
      expect(result.value).toBe("cafe");
    });
  });
});
