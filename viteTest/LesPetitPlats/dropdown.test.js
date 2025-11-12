import { describe, it, expect } from "vitest";
import {
  extractDropdownData,
  getFilteredItems,
  normalize,
} from "../../src/components/dropdown/utils.js";
import { mockRecipesForDropdown } from "./test-data.js";

describe("dropdown utils", () => {
  // Mock recipes for testing
  const mockRecipes = mockRecipesForDropdown;

  describe("normalize", () => {
    it("should convert string to lowercase and trim", () => {
      // String with whitespace
      expect(normalize("  TEST  ")).toBe("test");
    });

    it("should return empty string for non-string values", () => {
      expect(normalize(null)).toBe("");
      expect(normalize(undefined)).toBe("");
      expect(normalize(123)).toBe("");
      expect(normalize({})).toBe("");
    });

    it("should handle empty string", () => {
      // Empty string
      expect(normalize("")).toBe("");
    });
  });

  describe("extractDropdownData", () => {
    it("should extract ingredients from recipes", () => {
      // Extracted ingredients
      const result = extractDropdownData(mockRecipes, "ingredients");
      expect(result).toEqual(["Carrot", "Onion", "Potato", "Tomato"]);
    });

    it("should extract appliances from recipes", () => {
      // Extracted appliances
      const result = extractDropdownData(mockRecipes, "appliances");
      expect(result).toEqual(["Oven", "Stove"]);
    });

    it("should extract ustensils from recipes", () => {
      // Extracted ustensils
      const result = extractDropdownData(mockRecipes, "ustensils");
      expect(result).toEqual(["Fork", "Knife", "Spoon"]);
    });

    it("should return empty array for empty recipes", () => {
      // Empty recipes array
      const result = extractDropdownData([], "ingredients");
      expect(result).toEqual([]);
    });

    it("should handle recipes without ingredients", () => {
      // Recipes without ingredients property
      const recipesWithoutIngredients = [
        { name: "Recipe 1" },
        { ingredients: [{ name: "Tomato" }] },
      ];
      // Extracted ingredients
      const result = extractDropdownData(recipesWithoutIngredients, "ingredients");
      expect(result).toEqual(["Tomato"]);
    });

    it("should handle recipes with null/undefined ingredients", () => {
      // Recipes with null/undefined ingredients
      const recipesWithNull = [
        { ingredients: null },
        { ingredients: [{ name: "Tomato" }, { name: null }] },
        { ingredients: [{ name: undefined }] },
      ];
      // Extracted ingredients
      const result = extractDropdownData(recipesWithNull, "ingredients");
      expect(result).toEqual(["Tomato"]);
    });

    it("should handle recipes without appliance", () => {
      // Recipes without appliance property
      const recipesWithoutAppliance = [{ name: "Recipe 1" }, { appliance: "Oven" }];
      // Extracted appliances
      const result = extractDropdownData(recipesWithoutAppliance, "appliances");
      expect(result).toEqual(["Oven"]);
    });

    it("should handle recipes without ustensils", () => {
      // Recipes without ustensils property
      const recipesWithoutUstensils = [{ name: "Recipe 1" }, { ustensils: ["Spoon"] }];
      // Extracted ustensils
      const result = extractDropdownData(recipesWithoutUstensils, "ustensils");
      expect(result).toEqual(["Spoon"]);
    });

    it("should remove duplicates", () => {
      // Recipes with duplicate ingredients
      const recipesWithDuplicates = [
        { ingredients: [{ name: "Tomato" }, { name: "Tomato" }] },
        { ingredients: [{ name: "Tomato" }] },
      ];
      // Extracted ingredients
      const result = extractDropdownData(recipesWithDuplicates, "ingredients");
      expect(result).toEqual(["Tomato"]);
    });
  });

  describe("getFilteredItems", () => {
    // Dropdown data for testing
    const dropdownData = {
      ingredients: ["Carrot", "Onion", "Potato", "Tomato"],
      appliances: ["Oven", "Stove"],
      ustensils: ["Fork", "Knife", "Spoon"],
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
      expect(result).toEqual(["Potato", "Tomato"]);
    });

    it("should filter items by partial match", () => {
      // Partial search input
      const searchInput = { value: "ato" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(["Potato", "Tomato"]);
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
      expect(result).toEqual(["Tomato"]);
    });

    it("should filter appliances", () => {
      // Search input for appliances
      const searchInput = { value: "ov" };
      // Filtered items
      const result = getFilteredItems("appliances", dropdownData, searchInput);
      expect(result).toEqual(["Oven", "Stove"]);
    });

    it("should filter ustensils", () => {
      // Search input for ustensils
      const searchInput = { value: "oo" };
      // Filtered items
      const result = getFilteredItems("ustensils", dropdownData, searchInput);
      expect(result).toEqual(["Spoon"]);
    });
  });
});
