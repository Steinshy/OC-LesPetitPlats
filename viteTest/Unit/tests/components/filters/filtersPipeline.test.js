import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { filtersPipeline } from "@/components/filters/filtersPipeline.js";
import { filtersState } from "@/components/filters/filtersState.js";
import { eventBus } from "@/utils/eventBus.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

vi.mock("@/components/dropdowns/manager.js", () => ({
  dropdownTypes: ["ingredients", "appliances", "utensils"],
}));

describe("filtersPipeline", () => {
  const mockRecipes = [
    {
      name: "Recipe 1",
      description: "Test recipe",
      ingredients: [{ ingredient: "Tomato" }],
      appliance: "Oven",
      utensils: ["Spoon"],
    },
    {
      name: "Recipe 2",
      description: "Another recipe",
      ingredients: [{ ingredient: "Onion" }],
      appliance: "Stove",
      utensils: ["Fork"],
    },
  ];

  beforeEach(() => {
    filtersState.search = "";
    filtersState.ingredients.clear();
    filtersState.appliances.clear();
    filtersState.utensils.clear();
    filtersState.filtered = [];
    filtersPipeline.recipes = [];
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("should initialize recipes array", () => {
      filtersPipeline.init(mockRecipes);
      expect(filtersPipeline.recipes).toEqual(mockRecipes);
    });

    it("should handle empty array", () => {
      filtersPipeline.init([]);
      expect(filtersPipeline.recipes).toEqual([]);
    });

    it("should handle non-array input", () => {
      filtersPipeline.init(null);
      expect(filtersPipeline.recipes).toEqual([]);
    });

    it("should replace existing recipes", () => {
      filtersPipeline.init(mockRecipes);
      const newRecipes = [{ name: "New Recipe" }];
      filtersPipeline.init(newRecipes);
      expect(filtersPipeline.recipes).toEqual(newRecipes);
    });
  });

  describe("apply", () => {
    beforeEach(() => {
      filtersPipeline.init(mockRecipes);
    });

    it("should filter recipes and update state", () => {
      const result = filtersPipeline.apply();
      expect(result).toEqual(mockRecipes);
      expect(filtersState.filtered).toEqual(mockRecipes);
    });

    it("should apply search filter", () => {
      filtersState.search = "Recipe 1";
      const result = filtersPipeline.apply();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 1");
      expect(filtersState.filtered).toEqual(result);
    });

    it("should apply ingredient filter", () => {
      filtersState.ingredients.add("Tomato");
      const result = filtersPipeline.apply();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 1");
      expect(filtersState.filtered).toEqual(result);
    });

    it("should apply appliance filter", () => {
      filtersState.appliances.add("Oven");
      const result = filtersPipeline.apply();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 1");
      expect(filtersState.filtered).toEqual(result);
    });

    it("should apply utensil filter", () => {
      filtersState.utensils.add("Spoon");
      const result = filtersPipeline.apply();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 1");
      expect(filtersState.filtered).toEqual(result);
    });

    it("should apply multiple filters", () => {
      filtersState.search = "Recipe";
      filtersState.ingredients.add("Tomato");
      filtersState.appliances.add("Oven");
      const result = filtersPipeline.apply();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Recipe 1");
    });

    it("should return empty array when no matches", () => {
      filtersState.search = "Nonexistent";
      const result = filtersPipeline.apply();
      expect(result).toHaveLength(0);
      expect(filtersState.filtered).toEqual([]);
    });

    it("should emit filters:updated event", () => {
      const emitSpy = vi.spyOn(eventBus, "emit");
      filtersPipeline.apply();
      expect(emitSpy).toHaveBeenCalledWith("filters:updated", {
        filtered: expect.any(Array),
      });
    });
  });

  describe("notifyUpdate", () => {
    it("should emit filters:updated event with filtered recipes", () => {
      const emitSpy = vi.spyOn(eventBus, "emit");
      const filtered = [{ name: "Filtered Recipe" }];
      filtersPipeline.notifyUpdate(filtered);
      expect(emitSpy).toHaveBeenCalledWith("filters:updated", { filtered });
    });
  });

  afterAll(() => {
    logCategorySummary("filtersPipeline", "Filters Pipeline", "All filters pipeline tests");
  });
});

