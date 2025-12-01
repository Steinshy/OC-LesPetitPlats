import { afterAll, describe, expect, it } from "vitest";
import { logCategorySummary } from "../../Benchmarks/utils/console.js";
import {
  mockRecipesWithSearch,
  RECIPE_1,
  RECIPE_2,
  RECIPE_ONE,
} from "../data/testData.js";
import {
  filterBySearchTerm,
  filterByIngredients,
  filterByAppliances,
  filterByutensils,
  filterRecipes,
} from "../mocks/filtersBy.js";

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
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should filter recipes by partial search term", () => {
      // Partial search term
      const result = filterBySearchTerm(mockRecipes, "potato");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === "Recipe 2")).toBe(true);
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
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(r => r.name === "Recipe One")).toBe(true);
      expect(result.some(r => r.name === "Recipe 3")).toBe(true);
    });

    it("should filter recipes by multiple appliances (OR logic)", () => {
      // Multiple appliances filter
      const result = filterByAppliances(mockRecipes, ["Oven", "Stove"]);
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it("should return empty array when no recipe matches", () => {
      // Non-matching appliance filter
      const result = filterByAppliances(mockRecipes, ["Microwave"]);
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      // Lowercase appliance filter
      const result = filterByAppliances(mockRecipes, ["oven"]);
      expect(result.length).toBeGreaterThanOrEqual(2);
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

  describe("filterByutensils", () => {
    it("should return all recipes when no utensils filter", () => {
      // Empty utensils array
      const result = filterByutensils(mockRecipes, []);
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single ustensil", () => {
      // Single ustensil filter
      const result = filterByutensils(mockRecipes, ["Fork"]);
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(r => r.name === "Recipe One")).toBe(true);
      expect(result.some(r => r.name === "Recipe 3")).toBe(true);
    });

    it("should filter recipes by multiple utensils (AND logic)", () => {
      // Multiple utensils filter
      const result = filterByutensils(mockRecipes, ["Spoon", "Fork"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should return empty array when no recipe matches all utensils", () => {
      // Non-matching utensils filter
      const result = filterByutensils(mockRecipes, ["Fork", "Knife"]);
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      // Lowercase ustensil filter
      const result = filterByutensils(mockRecipes, ["fork"]);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it("should handle recipes without utensils", () => {
      // Recipes without utensils property
      const recipesWithoututensils = [
        { name: RECIPE_1, utensils: ["Spoon"] },
        { name: RECIPE_2 },
      ];
      // Filter result
      const result = filterByutensils(recipesWithoututensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });

    it("should handle recipes with null utensils", () => {
      // Recipes with null utensils
      const recipesWithNullutensils = [
        { name: RECIPE_1, utensils: ["Spoon"] },
        { name: RECIPE_2, utensils: null },
      ];
      // Filter result
      const result = filterByutensils(recipesWithNullutensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_1);
    });

    it("should handle recipes with undefined utensils", () => {
      // Recipes with undefined utensils
      const recipesWithUndefinedutensils = [
        { name: RECIPE_1, utensils: ["Spoon"] },
        { name: RECIPE_2, utensils: undefined },
      ];
      // Filter result
      const result = filterByutensils(recipesWithUndefinedutensils, ["Spoon"]);
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
        utensils: new Set(["Fork"]),
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
        utensils: new Set(),
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
        utensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, "one", activeFilters);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should work with only ingredient filter", () => {
      // Only ingredient filter
      const activeFilters = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
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
        utensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, "", activeFilters);
      expect(result).toHaveLength(10);
    });

    it("should handle object signature with filters object", () => {
      // Filters object signature
      const filters = {
        searchTerm: "one",
        ingredients: new Set(["Onion"]),
        appliances: new Set(["Oven"]),
        utensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should handle object signature without searchTerm", () => {
      // Filters object without searchTerm
      const filters = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(RECIPE_ONE);
    });

    it("should handle null searchTermOrFilters", () => {
      // Null searchTermOrFilters
      const activeFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, null, activeFilters);
      expect(result).toHaveLength(10);
    });

    it("should handle undefined searchTermOrFilters", () => {
      // Undefined searchTermOrFilters
      const activeFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };
      // Filter result
      const result = filterRecipes(mockRecipes, undefined, activeFilters);
      expect(result).toHaveLength(10);
    });
  });

  afterAll(() => {
    logCategorySummary("filter", "Filter", "All filter tests");
  });
});
