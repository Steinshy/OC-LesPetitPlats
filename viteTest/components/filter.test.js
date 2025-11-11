import { describe, it, expect } from "vitest";
import {
  filterBySearchTerm,
  filterByIngredients,
  filterByAppliances,
  filterByUstensils,
  filterRecipes,
} from "../../src/components/search/filter.js";

describe("filter", () => {
  const mockRecipes = [
    {
      name: "Recipe One",
      description: "A recipe with one ingredient",
      ingredients: [{ ingredient: "Tomato" }, { ingredient: "Onion" }],
      appliance: "Oven",
      ustensils: ["Spoon", "Fork"],
    },
    {
      name: "Recipe 2",
      description: "A test recipe",
      ingredients: [{ ingredient: "Potato" }, { ingredient: "Onion" }],
      appliance: "Stove",
      ustensils: ["Knife", "Spoon"],
    },
    {
      name: "Recipe 3",
      description: "Another recipe",
      ingredients: [{ ingredient: "Carrot" }],
      appliance: "Oven",
      ustensils: ["Fork"],
    },
  ];

  describe("filterBySearchTerm", () => {
    it("should return all recipes when search term is empty", () => {
      const result = filterBySearchTerm(mockRecipes, "");
      expect(result).toEqual(mockRecipes);
    });

    it("should return all recipes when search term is whitespace", () => {
      const result = filterBySearchTerm(mockRecipes, "   ");
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by search term (case insensitive)", () => {
      const result = filterBySearchTerm(mockRecipes, "ONE");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should filter recipes by partial search term", () => {
      const result = filterBySearchTerm(mockRecipes, "test");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 2");
    });

    it("should return empty array when no match found", () => {
      const result = filterBySearchTerm(mockRecipes, "nonexistent");
      expect(result).toHaveLength(0);
    });

    it("should handle recipes without description property", () => {
      const recipesWithoutDescription = [{ name: "Recipe 1" }, { name: "Recipe 2", description: "test" }];
      const result = filterBySearchTerm(recipesWithoutDescription, "test");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 2");
    });
  });

  describe("filterByIngredients", () => {
    it("should return all recipes when no ingredients filter", () => {
      const result = filterByIngredients(mockRecipes, []);
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single ingredient", () => {
      const result = filterByIngredients(mockRecipes, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should filter recipes by multiple ingredients (AND logic)", () => {
      const result = filterByIngredients(mockRecipes, ["Onion", "Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should return empty array when no recipe matches all ingredients", () => {
      const result = filterByIngredients(mockRecipes, ["Tomato", "Carrot"]);
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      const result = filterByIngredients(mockRecipes, ["tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should handle recipes without ingredients", () => {
      const recipesWithoutIngredients = [
        { name: "Recipe 1", ingredients: [{ ingredient: "Tomato" }] },
        { name: "Recipe 2" },
      ];
      const result = filterByIngredients(recipesWithoutIngredients, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should handle recipes with null ingredients", () => {
      const recipesWithNullIngredients = [
        { name: "Recipe 1", ingredients: [{ ingredient: "Tomato" }] },
        { name: "Recipe 2", ingredients: null },
      ];
      const result = filterByIngredients(recipesWithNullIngredients, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should handle recipes with undefined ingredients", () => {
      const recipesWithUndefinedIngredients = [
        { name: "Recipe 1", ingredients: [{ ingredient: "Tomato" }] },
        { name: "Recipe 2", ingredients: undefined },
      ];
      const result = filterByIngredients(recipesWithUndefinedIngredients, ["Tomato"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });
  });

  describe("filterByAppliances", () => {
    it("should return all recipes when no appliances filter", () => {
      const result = filterByAppliances(mockRecipes, []);
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single appliance", () => {
      const result = filterByAppliances(mockRecipes, ["Oven"]));
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toEqual(["Recipe 1", "Recipe 3"]);
    });

    it("should filter recipes by multiple appliances (OR logic)", () => {
      const result = filterByAppliances(mockRecipes, ["Oven", "Stove"]));
      expect(result).toHaveLength(3);
    });

    it("should return empty array when no recipe matches", () => {
      const result = filterByAppliances(mockRecipes, ["Microwave"]));
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      const result = filterByAppliances(mockRecipes, ["oven"]));
      expect(result).toHaveLength(2);
    });

    it("should handle recipes without appliance", () => {
      const recipesWithoutAppliance = [
        { name: "Recipe 1", appliance: "Oven" },
        { name: "Recipe 2" },
      ];
      const result = filterByAppliances(recipesWithoutAppliance, ["Oven"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });
  });

  describe("filterByUstensils", () => {
    it("should return all recipes when no ustensils filter", () => {
      const result = filterByUstensils(mockRecipes, []);
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single ustensil", () => {
      const result = filterByUstensils(mockRecipes, ["Fork"]);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toEqual(["Recipe One", "Recipe 3"]);
    });

    it("should filter recipes by multiple ustensils (AND logic)", () => {
      const result = filterByUstensils(mockRecipes, ["Spoon", "Fork"]));
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should return empty array when no recipe matches all ustensils", () => {
      const result = filterByUstensils(mockRecipes, ["Fork", "Knife"]);
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      const result = filterByUstensils(mockRecipes, ["fork"]);
      expect(result).toHaveLength(2);
    });

    it("should handle recipes without ustensils", () => {
      const recipesWithoutUstensils = [
        { name: "Recipe 1", ustensils: ["Spoon"] },
        { name: "Recipe 2" },
      ];
      const result = filterByUstensils(recipesWithoutUstensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should handle recipes with null ustensils", () => {
      const recipesWithNullUstensils = [
        { name: "Recipe 1", ustensils: ["Spoon"] },
        { name: "Recipe 2", ustensils: null },
      ];
      const result = filterByUstensils(recipesWithNullUstensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should handle recipes with undefined ustensils", () => {
      const recipesWithUndefinedUstensils = [
        { name: "Recipe 1", ustensils: ["Spoon"] },
        { name: "Recipe 2", ustensils: undefined },
      ];
      const result = filterByUstensils(recipesWithUndefinedUstensils, ["Spoon"]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });
  });

  describe("filterRecipes", () => {
    it("should apply all filters together", () => {
      const activeFilters = {
        ingredients: new Set(["Onion"]),
        appliances: new Set(["Oven"]),
        ustensils: new Set(["Fork"]),
      };
      const result = filterRecipes(mockRecipes, "recipe", activeFilters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should return empty array when filters are too restrictive", () => {
      const activeFilters = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(["Stove"]),
        ustensils: new Set(),
      };
      const result = filterRecipes(mockRecipes, "recipe", activeFilters);
      expect(result).toHaveLength(0);
    });

    it("should work with only search term", () => {
      const activeFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      };
      const result = filterRecipes(mockRecipes, "one", activeFilters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should work with only ingredient filter", () => {
      const activeFilters = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        ustensils: new Set(),
      };
      const result = filterRecipes(mockRecipes, "", activeFilters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe One");
    });

    it("should return all recipes when no filters applied", () => {
      const activeFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      };
      const result = filterRecipes(mockRecipes, "", activeFilters);
      expect(result).toHaveLength(3);
    });
  });
});

