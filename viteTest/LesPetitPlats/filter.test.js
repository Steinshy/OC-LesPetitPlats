import { describe, it, expect } from "vitest";
import {
  filterBySearchTerm,
  filterByIngredients,
  filterByAppliances,
  filterByUstensils,
  filterRecipes,
} from "../../../src/components/search/filter.js";
import { mockRecipesWithSearch, RECIPE_1, RECIPE_2, RECIPE_ONE } from "./test-data.js";

describe("filter", () => {
  // Mock recipes for testing
  const mockRecipes = mockRecipesWithSearch;

  describe("filterBySearchTerm", () => {
    it("should return all recipes when search term is empty", () => {
      // Empty search term
      const result = filterBySearchTerm(mockRecipes, "");
      expect(result).toEqual(mockRecipes);
    });

    it("should return all recipes when search term is whitespace", () => {
      // Whitespace search term
      const result = filterBySearchTerm(mockRecipes, "   ");
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by search term (case insensitive)", () => {
      // Search term (uppercase)
      const result = filterBySearchTerm(mockRecipes, "ONE");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should filter recipes by partial search term", () => {
      // Partial search term
      const result = filterBySearchTerm(mockRecipes, "potato");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 2");
    });

    it("should return empty array when no match found", () => {
      // Non-matching search term
      const result = filterBySearchTerm(mockRecipes, "nonexistent");
      expect(result).toHaveLength(0);
    });

    it("should handle recipes without description property", () => {
      // Recipes without description
      const recipesWithoutDescription = [
        { name: RECIPE_1, search: "recipe 1" },
        { name: RECIPE_2, description: "test", search: "recipe 2 test" },
      ];
      // Filter result
      const result = filterBySearchTerm(recipesWithoutDescription, "test");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_2);
    });
  });

  describe("filterByIngredients", () => {
    it("should return all recipes when no ingredients filter", () => {
      // Empty ingredients array
      const result = filterByIngredients(mockRecipes, []);
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single ingredient", () => {
      // Single ingredient filter
      const result = filterByIngredients(mockRecipes, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should filter recipes by multiple ingredients (AND logic)", () => {
      // Multiple ingredients filter
      const result = filterByIngredients(mockRecipes, ["Onion", "Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should return empty array when no recipe matches all ingredients", () => {
      // Non-matching ingredients filter
      const result = filterByIngredients(mockRecipes, ["Tomato", "Carrot"]);
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      // Lowercase ingredient filter
      const result = filterByIngredients(mockRecipes, ["tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should handle recipes without ingredients", () => {
      // Recipes without ingredients property
      const recipesWithoutIngredients = [
        { name: RECIPE_1, ingredients: [{ name: "Tomato" }] },
        { name: RECIPE_2 },
      ];
      // Filter result
      const result = filterByIngredients(recipesWithoutIngredients, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });

    it("should handle recipes with null ingredients", () => {
      // Recipes with null ingredients
      const recipesWithNullIngredients = [
        { name: RECIPE_1, ingredients: [{ name: "Tomato" }] },
        { name: RECIPE_2, ingredients: null },
      ];
      // Filter result
      const result = filterByIngredients(recipesWithNullIngredients, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });

    it("should handle recipes with undefined ingredients", () => {
      // Recipes with undefined ingredients
      const recipesWithUndefinedIngredients = [
        { name: RECIPE_1, ingredients: [{ name: "Tomato" }] },
        { name: RECIPE_2, ingredients: undefined },
      ];
      // Filter result
      const result = filterByIngredients(recipesWithUndefinedIngredients, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });
  });

  describe("filterByAppliances", () => {
    it("should return all recipes when no appliances filter", () => {
      // Empty appliances array
      const result = filterByAppliances(mockRecipes, []);
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single appliance", () => {
      // Single appliance filter
      const result = filterByAppliances(mockRecipes, ["Oven"]);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toEqual(["Recipe One", "Recipe 3"]);
    });

    it("should filter recipes by multiple appliances (OR logic)", () => {
      // Multiple appliances filter
      const result = filterByAppliances(mockRecipes, ["Oven", "Stove"]);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when no recipe matches", () => {
      // Non-matching appliance filter
      const result = filterByAppliances(mockRecipes, ["Microwave"]);
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      // Lowercase appliance filter
      const result = filterByAppliances(mockRecipes, ["oven"]);
      expect(result).toHaveLength(2);
    });

    it("should handle recipes without appliance", () => {
      // Recipes without appliance property
      const recipesWithoutAppliance = [{ name: RECIPE_1, appliance: "Oven" }, { name: RECIPE_2 }];
      // Filter result
      const result = filterByAppliances(recipesWithoutAppliance, ["Oven"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });
  });

  describe("filterByUstensils", () => {
    it("should return all recipes when no ustensils filter", () => {
      // Empty ustensils array
      const result = filterByUstensils(mockRecipes, []);
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single ustensil", () => {
      // Single ustensil filter
      const result = filterByUstensils(mockRecipes, ["Fork"]);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toEqual(["Recipe One", "Recipe 3"]);
    });

    it("should filter recipes by multiple ustensils (AND logic)", () => {
      // Multiple ustensils filter
      const result = filterByUstensils(mockRecipes, ["Spoon", "Fork"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should return empty array when no recipe matches all ustensils", () => {
      // Non-matching ustensils filter
      const result = filterByUstensils(mockRecipes, ["Fork", "Knife"]);
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      // Lowercase ustensil filter
      const result = filterByUstensils(mockRecipes, ["fork"]);
      expect(result).toHaveLength(2);
    });

    it("should handle recipes without ustensils", () => {
      // Recipes without ustensils property
      const recipesWithoutUstensils = [
        { name: RECIPE_1, ustensils: ["Spoon"] },
        { name: RECIPE_2 },
      ];
      // Filter result
      const result = filterByUstensils(recipesWithoutUstensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });

    it("should handle recipes with null ustensils", () => {
      // Recipes with null ustensils
      const recipesWithNullUstensils = [
        { name: RECIPE_1, ustensils: ["Spoon"] },
        { name: RECIPE_2, ustensils: null },
      ];
      // Filter result
      const result = filterByUstensils(recipesWithNullUstensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });

    it("should handle recipes with undefined ustensils", () => {
      // Recipes with undefined ustensils
      const recipesWithUndefinedUstensils = [
        { name: RECIPE_1, ustensils: ["Spoon"] },
        { name: RECIPE_2, ustensils: undefined },
      ];
      // Filter result
      const result = filterByUstensils(recipesWithUndefinedUstensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });
  });

  describe("filterRecipes", () => {
    it("should apply all filters together", () => {
      // Active filters with all types
      const activeFilters = {
        ingredients: new Set(["Onion"]),
        appliances: new Set(["Oven"]),
        ustensils: new Set(["Fork"]),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, "recipe", activeFilters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should return empty array when filters are too restrictive", () => {
      // Restrictive filters
      const activeFilters = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(["Stove"]),
        ustensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, "recipe", activeFilters);
      expect(result).toHaveLength(0);
    });

    it("should work with only search term", () => {
      // Empty filters
      const activeFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, "one", activeFilters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should work with only ingredient filter", () => {
      // Only ingredient filter
      const activeFilters = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        ustensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, "", activeFilters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should return all recipes when no filters applied", () => {
      // Empty filters
      const activeFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, "", activeFilters);
      expect(result).toHaveLength(3);
    });
  });
});
