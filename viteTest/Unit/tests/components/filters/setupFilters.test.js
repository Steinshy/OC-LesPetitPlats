import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { searchUi } from "@/components/search/manager.js";
import { eventBus } from "@/utils/eventBus.js";
import { logCategorySummary } from "@viteTest-helper/message.js";
import { filtersInteractions } from "~/src/components/filters/interactions.js";
import { filtersState } from "~/src/components/filters/state.js";
import { filtersUi } from "~/src/components/filters/ui.js";

// Unmock setupFilters to test the actual implementation
vi.unmock("@/components/filters/setup.js");
const { setupFilters } = await import("~/src/components/filters/setup.js");

vi.mock("@/components/filters/interactions.js", () => ({
  filtersInteractions: {
    init: vi.fn(),
    cleanup: vi.fn(),
  },
  onPopState: vi.fn(),
}));

vi.mock("@/components/filters/ui.js", () => ({
  filtersUi: {
    updateTagList: vi.fn(),
    updateFiltersCounter: vi.fn(),
  },
}));

vi.mock("@/components/search/manager.js", () => ({
  searchUi: {
    syncFromState: vi.fn(),
  },
}));

describe("setupFilters", () => {
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
    vi.clearAllMocks();
    filtersState.search = "";
    filtersState.ingredients.clear();
    filtersState.appliances.clear();
    filtersState.utensils.clear();
    if (filtersState.filtered) {
      filtersState.filtered = [];
    }
    eventBus.events = {};
  });

  describe("initialization", () => {
    it("should sync search bar state", () => {
      setupFilters(mockRecipes);

      expect(searchUi.syncFromState).toHaveBeenCalled();
    });

    it("should initialize filter interactions", () => {
      setupFilters(mockRecipes);

      expect(filtersInteractions.init).toHaveBeenCalled();
    });

    it("should register filters:updated event handler", () => {
      setupFilters(mockRecipes);

      expect(eventBus.events["filters:updated"]).toBeDefined();
      expect(eventBus.events["filters:updated"].length).toBe(1);
    });

    it("should apply initial filtering", () => {
      setupFilters(mockRecipes);

      expect(filtersState.filtered).toBeDefined();
      expect(Array.isArray(filtersState.filtered)).toBe(true);
    });
  });

  describe("event handler", () => {
    it("should update tag list when filters:updated event is emitted", () => {
      setupFilters(mockRecipes);

      eventBus.emit("filters:updated", { filtered: [] });

      expect(filtersUi.updateTagList).toHaveBeenCalledWith(filtersState);
    });

    it("should update filters counter when filters:updated event is emitted", () => {
      setupFilters(mockRecipes);

      eventBus.emit("filters:updated", { filtered: [] });

      expect(filtersUi.updateFiltersCounter).toHaveBeenCalledWith(filtersState);
    });
  });

  describe("cleanup", () => {
    it("should return cleanup function", () => {
      const cleanup = setupFilters(mockRecipes);

      expect(typeof cleanup).toBe("function");
    });

    it("should unregister event handler on cleanup", () => {
      const cleanup = setupFilters(mockRecipes);

      expect(eventBus.events["filters:updated"].length).toBe(1);

      cleanup();

      const handlers = eventBus.events["filters:updated"];
      expect(handlers === undefined || handlers.length === 0).toBe(true);
    });

    it("should call filtersInteractions.cleanup on cleanup", () => {
      const cleanup = setupFilters(mockRecipes);

      cleanup();

      expect(filtersInteractions.cleanup).toHaveBeenCalled();
    });

    it("should allow multiple cleanup calls", () => {
      const cleanup = setupFilters(mockRecipes);

      cleanup();
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should return no-op cleanup function when recipes is null", () => {
      const cleanup = setupFilters(null);

      expect(typeof cleanup).toBe("function");
      expect(() => cleanup()).not.toThrow();
      expect(filtersInteractions.init).not.toHaveBeenCalled();
    });

    it("should return no-op cleanup function when recipes is undefined", () => {
      const cleanup = setupFilters(undefined);

      expect(typeof cleanup).toBe("function");
      expect(() => cleanup()).not.toThrow();
      expect(filtersInteractions.init).not.toHaveBeenCalled();
    });

    it("should handle empty recipes array", () => {
      setupFilters([]);

      expect(filtersInteractions.init).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    logCategorySummary("setupFilters", "Setup Filters", "All setupFilters tests");
  });
});
