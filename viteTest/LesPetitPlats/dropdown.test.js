import { describe, it, expect } from "vitest";
import { formatDropdownData, getFilteredItems } from "../../src/components/dropdown/utils.js";

describe("dropdown utils", () => {
  describe("formatDropdownData", () => {
    it("should capitalize first letter of each item", () => {
      // Dropdown data with normalized values
      const dropdownData = {
        ingredients: ["tomato", "onion", "potato"],
        appliances: ["oven", "stove"],
        ustensils: ["fork", "knife", "spoon"],
      };
      // Formatted dropdown data
      const result = formatDropdownData(dropdownData);
      expect(result.ingredients).toEqual(["Tomato", "Onion", "Potato"]);
      expect(result.appliances).toEqual(["Oven", "Stove"]);
      expect(result.ustensils).toEqual(["Fork", "Knife", "Spoon"]);
    });

    it("should handle empty arrays", () => {
      // Dropdown data with empty arrays
      const dropdownData = {
        ingredients: [],
        appliances: [],
        ustensils: [],
      };
      // Formatted dropdown data
      const result = formatDropdownData(dropdownData);
      expect(result.ingredients).toEqual([]);
      expect(result.appliances).toEqual([]);
      expect(result.ustensils).toEqual([]);
    });

    it("should preserve casing after first letter", () => {
      // Dropdown data with mixed casing
      const dropdownData = {
        ingredients: ["tOmAtO", "onION"],
        appliances: ["oVeN"],
        ustensils: ["fOrK"],
      };
      // Formatted dropdown data
      const result = formatDropdownData(dropdownData);
      expect(result.ingredients).toEqual(["TOmAtO", "OnION"]);
      expect(result.appliances).toEqual(["OVeN"]);
      expect(result.ustensils).toEqual(["FOrK"]);
    });
  });

  describe("getFilteredItems", () => {
    // Dropdown data for testing (normalized values as used in production)
    const dropdownData = {
      ingredients: ["carrot", "onion", "potato", "tomato"],
      appliances: ["oven", "stove"],
      ustensils: ["fork", "knife", "spoon"],
    };

    it("should return all items when search input is empty", () => {
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, null);
      expect(result).toEqual(dropdownData.ingredients);
    });

    it("should return all items when search input value is empty", () => {
      // Empty search input
      const searchInput = { value: "" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(dropdownData.ingredients);
    });

    it("should filter items by search query (case insensitive)", () => {
      // Search input (uppercase)
      const searchInput = { value: "TO" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(["potato", "tomato"]);
    });

    it("should filter items by partial match", () => {
      // Partial search input
      const searchInput = { value: "ato" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(["potato", "tomato"]);
    });

    it("should return empty array when no match found", () => {
      // Non-matching search input
      const searchInput = { value: "xyz" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual([]);
    });

    it("should handle whitespace in search query", () => {
      // Search input with whitespace
      const searchInput = { value: "  tomato  " };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(["tomato"]);
    });

    it("should filter appliances", () => {
      // Search input for appliances
      const searchInput = { value: "ov" };
      // Filtered items
      const result = getFilteredItems("appliances", dropdownData, searchInput);
      expect(result).toEqual(["oven", "stove"]);
    });

    it("should filter ustensils", () => {
      // Search input for ustensils
      const searchInput = { value: "oo" };
      // Filtered items
      const result = getFilteredItems("ustensils", dropdownData, searchInput);
      expect(result).toEqual(["spoon"]);
    });
  });
});
