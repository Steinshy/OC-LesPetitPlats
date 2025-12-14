import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { eventBus } from "@/utils/eventBus.js";
import { logCategorySummary } from "@viteTest-helper/message.js";
import { filtersPipeline } from "~/src/components/filters/pipeline.js";
import { filtersState } from "~/src/components/filters/state.js";

vi.mock("@/components/dropdowns/setup.js", () => ({
  dropdownTypes: ["ingredients", "appliances", "utensils"],
}));

vi.mock("@/utils/urlState.js", () => ({
  updateURLState: vi.fn(),
  clearURLState: vi.fn(),
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
    if (filtersState.filtered) {
      filtersState.filtered = [];
    }
    filtersPipeline.recipes = [];
    eventBus.events = {};
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("should initialize recipes array", () => {
      filtersPipeline.init(mockRecipes);
      expect(filtersPipeline.recipes).toEqual(mockRecipes);
    });

    it("should handle non-array input by converting to empty array", () => {
      filtersPipeline.init(null);
      expect(filtersPipeline.recipes).toEqual([]);
    });

    it("should handle empty array", () => {
      filtersPipeline.init([]);
      expect(filtersPipeline.recipes).toEqual([]);
    });
  });

  describe("apply", () => {
    beforeEach(() => {
      filtersPipeline.init(mockRecipes);
    });

    it("should filter recipes and store in filtersState.filtered", () => {
      const result = filtersPipeline.apply();
      expect(filtersState.filtered).toBeDefined();
      expect(Array.isArray(filtersState.filtered)).toBe(true);
      expect(result).toEqual(filtersState.filtered);
    });

    it("should return filtered recipes", () => {
      const result = filtersPipeline.apply();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
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
    beforeEach(() => {
      filtersPipeline.init(mockRecipes);
    });

    it("should emit filters:updated event", () => {
      const emitSpy = vi.spyOn(eventBus, "emit");
      filtersPipeline.notifyUpdate([]);
      expect(emitSpy).toHaveBeenCalledWith("filters:updated", { filtered: [] });
    });
  });

  afterAll(() => {
    logCategorySummary("filtersPipeline", "Filters Pipeline", "All filters pipeline tests");
  });
});
