import { afterAll, describe, expect, it } from "vitest";
import { mockRecipesWithSearch, RECIPE_1, RECIPE_2, RECIPE_ONE } from "@tests-data/data.js";
import { logCategorySummary } from "@viteTest-helper/message.js";
import { filtersEngine } from "~/src/components/filters/engine.js";

describe("filtersEngine", () => {
  const mockRecipes = mockRecipesWithSearch;

  describe("extract", () => {
    describe("ingredients", () => {
      it("should extract ingredients from recipe", () => {
        const recipe = {
          ingredients: [{ ingredient: "Tomato" }, { ingredient: "Onion" }],
        };
        const result = filtersEngine.extract.ingredients(recipe);
        expect(result).toEqual(["tomato", "onion"]);
      });

      it("should handle missing ingredients", () => {
        const recipe = {};
        const result = filtersEngine.extract.ingredients(recipe);
        expect(result).toEqual([]);
      });

      it("should handle null ingredients", () => {
        const recipe = { ingredients: null };
        const result = filtersEngine.extract.ingredients(recipe);
        expect(result).toEqual([]);
      });

      it("should filter out null/undefined ingredient values", () => {
        const recipe = {
          ingredients: [{ ingredient: "Tomato" }, { ingredient: null }, {}],
        };
        const result = filtersEngine.extract.ingredients(recipe);
        expect(result).toEqual(["tomato"]);
      });

      it("should normalize ingredient names", () => {
        const recipe = {
          ingredients: [{ ingredient: "  Tomato  " }, { ingredient: "OnION" }],
        };
        const result = filtersEngine.extract.ingredients(recipe);
        expect(result).toEqual(["tomato", "onion"]);
      });
    });

    describe("appliances", () => {
      it("should extract appliance from recipe", () => {
        const recipe = { appliance: "Oven" };
        const result = filtersEngine.extract.appliances(recipe);
        expect(result).toEqual(["oven"]);
      });

      it("should handle missing appliance", () => {
        const recipe = {};
        const result = filtersEngine.extract.appliances(recipe);
        expect(result).toEqual([]);
      });

      it("should normalize appliance name", () => {
        const recipe = { appliance: "  OVEN  " };
        const result = filtersEngine.extract.appliances(recipe);
        expect(result).toEqual(["oven"]);
      });
    });

    describe("utensils", () => {
      it("should extract utensils from recipe", () => {
        const recipe = { utensils: ["Spoon", "Fork"] };
        const result = filtersEngine.extract.utensils(recipe);
        expect(result).toEqual(["spoon", "fork"]);
      });

      it("should handle missing utensils", () => {
        const recipe = {};
        const result = filtersEngine.extract.utensils(recipe);
        expect(result).toEqual([]);
      });

      it("should handle null utensils", () => {
        const recipe = { utensils: null };
        const result = filtersEngine.extract.utensils(recipe);
        expect(result).toEqual([]);
      });

      it("should filter out null/undefined utensil values", () => {
        const recipe = { utensils: ["Spoon", null, undefined, ""] };
        const result = filtersEngine.extract.utensils(recipe);
        expect(result).toEqual(["spoon"]);
      });

      it("should normalize utensil names", () => {
        const recipe = { utensils: ["  Spoon  ", "FORK"] };
        const result = filtersEngine.extract.utensils(recipe);
        expect(result).toEqual(["spoon", "fork"]);
      });
    });
  });

  describe("buildSearchText", () => {
    it("should build search text from recipe", () => {
      const recipe = {
        name: "Recipe One",
        description: "A test recipe",
        appliance: "Oven",
        ingredients: [{ ingredient: "Tomato" }],
        utensils: ["Spoon"],
      };
      const result = filtersEngine.buildSearchText(recipe);
      expect(result).toContain("recipe one");
      expect(result).toContain("test recipe");
      expect(result).toContain("oven");
      expect(result).toContain("tomato");
      expect(result).toContain("spoon");
    });

    it("should handle missing fields", () => {
      const recipe = { name: "Recipe" };
      const result = filtersEngine.buildSearchText(recipe);
      expect(result).toBe("recipe");
    });

    it("should normalize the search text", () => {
      const recipe = {
        name: "  Recipe  ONE  ",
        description: "Test",
      };
      const result = filtersEngine.buildSearchText(recipe);
      expect(result).toContain("recipe");
      expect(result).toContain("one");
      expect(result).toContain("test");
      expect(result.trim()).toBe(result);
    });
  });

  describe("onSearch", () => {
    it("should return all recipes when search term is empty", () => {
      const result = filtersEngine.onSearch(mockRecipes, "");
      expect(result).toEqual(mockRecipes);
    });

    it("should return all recipes when search term is whitespace", () => {
      const result = filtersEngine.onSearch(mockRecipes, "   ");
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by search term (case insensitive)", () => {
      const result = filtersEngine.onSearch(mockRecipes, "ONE");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should filter recipes by partial search term", () => {
      const result = filtersEngine.onSearch(mockRecipes, "potato");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_2)).toBe(true);
    });

    it("should return empty array when no match found", () => {
      const result = filtersEngine.onSearch(mockRecipes, "nonexistent");
      expect(result).toHaveLength(0);
    });

    it("should search in name, description, ingredients, appliances, and utensils", () => {
      const result = filtersEngine.onSearch(mockRecipes, "tomato");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });
  });

  describe("onFilter", () => {
    it("should return all recipes when no filter selected", () => {
      const result = filtersEngine.onFilter(mockRecipes, new Set(), "ingredients");
      expect(result).toEqual(mockRecipes);
    });

    it("should filter recipes by single ingredient", () => {
      const result = filtersEngine.onFilter(mockRecipes, new Set(["Tomato"]), "ingredients");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should filter recipes by multiple ingredients (AND logic)", () => {
      const result = filtersEngine.onFilter(
        mockRecipes,
        new Set(["Onion", "Tomato"]),
        "ingredients",
      );
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should return empty array when no recipe matches all ingredients", () => {
      const result = filtersEngine.onFilter(
        mockRecipes,
        new Set(["Tomato", "Carrot"]),
        "ingredients",
      );
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive", () => {
      const result = filtersEngine.onFilter(mockRecipes, new Set(["tomato"]), "ingredients");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should filter by appliances", () => {
      const result = filtersEngine.onFilter(mockRecipes, new Set(["Oven"]), "appliances");
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should filter by utensils", () => {
      const result = filtersEngine.onFilter(mockRecipes, new Set(["Fork"]), "utensils");
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should filter by multiple utensils (AND logic)", () => {
      const result = filtersEngine.onFilter(mockRecipes, new Set(["Spoon", "Fork"]), "utensils");
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });
  });

  describe("filterDropdownItems", () => {
    it("should return all items when search term is empty", () => {
      const items = ["Tomato", "Onion", "Carrot"];
      const result = filtersEngine.filterDropdownItems(items, "");
      expect(result).toEqual(items);
    });

    it("should filter items by search term", () => {
      const items = ["Tomato", "Onion", "Carrot"];
      const result = filtersEngine.filterDropdownItems(items, "tom");
      expect(result).toEqual(["Tomato"]);
    });

    it("should be case insensitive", () => {
      const items = ["Tomato", "Onion", "Carrot"];
      const result = filtersEngine.filterDropdownItems(items, "TOMATO");
      expect(result).toEqual(["Tomato"]);
    });

    it("should handle items with label property", () => {
      const items = [{ label: "Tomato" }, { label: "Onion" }];
      const result = filtersEngine.filterDropdownItems(items, "tom");
      expect(result).toEqual([{ label: "Tomato" }]);
    });

    it("should handle items with value property", () => {
      const items = [{ value: "Tomato" }, { value: "Onion" }];
      const result = filtersEngine.filterDropdownItems(items, "tom");
      expect(result).toEqual([{ value: "Tomato" }]);
    });

    it("should return empty array when no match found", () => {
      const items = ["Tomato", "Onion", "Carrot"];
      const result = filtersEngine.filterDropdownItems(items, "nonexistent");
      expect(result).toHaveLength(0);
    });
  });

  describe("applyAll", () => {
    it("should apply all filters together", () => {
      const filters = {
        search: "recipe",
        ingredients: new Set(["Onion"]),
        appliances: new Set(["Oven"]),
        utensils: new Set(["Fork"]),
      };
      const types = ["ingredients", "appliances", "utensils"];
      const result = filtersEngine.applyAll(mockRecipes, filters, types);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should return empty array when filters are too restrictive", () => {
      const filters = {
        search: "recipe",
        ingredients: new Set(["Tomato"]),
        appliances: new Set(["Stove"]),
        utensils: new Set(),
      };
      const types = ["ingredients", "appliances", "utensils"];
      const result = filtersEngine.applyAll(mockRecipes, filters, types);
      expect(result).toHaveLength(0);
    });

    it("should work with only search term", () => {
      const filters = {
        search: "one",
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };
      const types = ["ingredients", "appliances", "utensils"];
      const result = filtersEngine.applyAll(mockRecipes, filters, types);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should work with only ingredient filter", () => {
      const filters = {
        search: "",
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };
      const types = ["ingredients", "appliances", "utensils"];
      const result = filtersEngine.applyAll(mockRecipes, filters, types);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some(r => r.name === RECIPE_ONE)).toBe(true);
    });

    it("should return all recipes when no filters applied", () => {
      const filters = {
        search: "",
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };
      const types = ["ingredients", "appliances", "utensils"];
      const result = filtersEngine.applyAll(mockRecipes, filters, types);
      expect(result).toHaveLength(10);
    });
  });

  afterAll(() => {
    logCategorySummary("filtersEngine", "Filters Engine", "All filters engine tests");
  });
});
