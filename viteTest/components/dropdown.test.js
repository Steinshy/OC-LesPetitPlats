import { describe, it, expect } from "vitest";
import {
  extractDropdownData,
  getFilteredItems,
  normalize,
} from "../../src/components/dropdown/utils.js";

describe("dropdown utils", () => {
  const mockRecipes = [
    {
      ingredients: [{ name: "Tomato" }, { name: "Onion" }],
      appliance: "Oven",
      ustensils: ["Spoon", "Fork"],
    },
    {
      ingredients: [{ name: "Potato" }, { name: "Onion" }],
      appliance: "Stove",
      ustensils: ["Knife", "Spoon"],
    },
    {
      ingredients: [{ name: "Carrot" }],
      appliance: "Oven",
      ustensils: ["Fork"],
    },
  ];

  describe("normalize", () => {
    it("should convert string to lowercase and trim", () => {
      expect(normalize("  TEST  ")).toBe("test");
    });

    it("should return empty string for non-string values", () => {
      expect(normalize(null)).toBe("");
      expect(normalize(undefined)).toBe("");
      expect(normalize(123)).toBe("");
      expect(normalize({})).toBe("");
    });

    it("should handle empty string", () => {
      expect(normalize("")).toBe("");
    });
  });

  describe("extractDropdownData", () => {
    it("should extract ingredients from recipes", () => {
      const result = extractDropdownData(mockRecipes, "ingredients");
      expect(result).toEqual(["Carrot", "Onion", "Potato", "Tomato"]);
    });

    it("should extract appliances from recipes", () => {
      const result = extractDropdownData(mockRecipes, "appliances");
      expect(result).toEqual(["Oven", "Stove"]);
    });

    it("should extract ustensils from recipes", () => {
      const result = extractDropdownData(mockRecipes, "ustensils");
      expect(result).toEqual(["Fork", "Knife", "Spoon"]);
    });

    it("should return empty array for empty recipes", () => {
      const result = extractDropdownData([], "ingredients");
      expect(result).toEqual([]);
    });

    it("should handle recipes without ingredients", () => {
      const recipesWithoutIngredients = [
        { name: "Recipe 1" },
        { ingredients: [{ name: "Tomato" }] },
      ];
      const result = extractDropdownData(recipesWithoutIngredients, "ingredients");
      expect(result).toEqual(["Tomato"]);
    });

    it("should handle recipes with null/undefined ingredients", () => {
      const recipesWithNull = [
        { ingredients: null },
        { ingredients: [{ name: "Tomato" }, { name: null }] },
        { ingredients: [{ name: undefined }] },
      ];
      const result = extractDropdownData(recipesWithNull, "ingredients");
      expect(result).toEqual(["Tomato"]);
    });

    it("should handle recipes without appliance", () => {
      const recipesWithoutAppliance = [{ name: "Recipe 1" }, { appliance: "Oven" }];
      const result = extractDropdownData(recipesWithoutAppliance, "appliances");
      expect(result).toEqual(["Oven"]);
    });

    it("should handle recipes without ustensils", () => {
      const recipesWithoutUstensils = [{ name: "Recipe 1" }, { ustensils: ["Spoon"] }];
      const result = extractDropdownData(recipesWithoutUstensils, "ustensils");
      expect(result).toEqual(["Spoon"]);
    });

    it("should remove duplicates", () => {
      const recipesWithDuplicates = [
        { ingredients: [{ name: "Tomato" }, { name: "Tomato" }] },
        { ingredients: [{ name: "Tomato" }] },
      ];
      const result = extractDropdownData(recipesWithDuplicates, "ingredients");
      expect(result).toEqual(["Tomato"]);
    });
  });

  describe("getFilteredItems", () => {
    const dropdownData = {
      ingredients: ["Carrot", "Onion", "Potato", "Tomato"],
      appliances: ["Oven", "Stove"],
      ustensils: ["Fork", "Knife", "Spoon"],
    };

    it("should return all items when search input is empty", () => {
      const result = getFilteredItems("ingredients", dropdownData, null);
      expect(result).toEqual(dropdownData.ingredients);
    });

    it("should return all items when search input value is empty", () => {
      const searchInput = { value: "" };
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(dropdownData.ingredients);
    });

    it("should filter items by search query (case insensitive)", () => {
      const searchInput = { value: "TO" };
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(["Potato", "Tomato"]);
    });

    it("should filter items by partial match", () => {
      const searchInput = { value: "ato" };
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(["Potato", "Tomato"]);
    });

    it("should return empty array when no match found", () => {
      const searchInput = { value: "xyz" };
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual([]);
    });

    it("should handle whitespace in search query", () => {
      const searchInput = { value: "  tomato  " };
      const result = getFilteredItems("ingredients", dropdownData, searchInput);
      expect(result).toEqual(["Tomato"]);
    });

    it("should filter appliances", () => {
      const searchInput = { value: "ov" };
      const result = getFilteredItems("appliances", dropdownData, searchInput);
      expect(result).toEqual(["Oven", "Stove"]);
    });

    it("should filter ustensils", () => {
      const searchInput = { value: "oo" };
      const result = getFilteredItems("ustensils", dropdownData, searchInput);
      expect(result).toEqual(["Spoon"]);
    });
  });
});
