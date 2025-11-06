import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderRecipes } from "../src/card.js";
import {
  updateCount,
  initSearch,
  addFilter,
  removeFilter,
  getActiveFilters,
} from "../src/components/search.js";

vi.mock("../src/card.js", () => ({
  renderRecipes: vi.fn(),
}));

vi.mock("../src/components/dropdown.js", () => ({
  updateDropdownsSelection: vi.fn(),
}));

vi.mock("../src/components/filterTags.js", () => ({
  updateFilterTags: vi.fn(),
}));

describe("search", () => {
  const mockRecipes = [
    { name: "Recipe 1", search: "recipe one test" },
    { name: "Recipe 2", search: "recipe two test" },
    { name: "Recipe 3", search: "recipe three test" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `
      <div class="results-counter">
        <h2>0 Résultats</h2>
      </div>
      <div class="search-bar-group">
        <input type="text" />
        <button class="search-btn"></button>
      </div>
    `;
  });

  describe("updateCount", () => {
    it("should update counter with correct count", () => {
      updateCount(5);
      const counter = document.querySelector(".results-counter h2");
      expect(counter.textContent).toBe("5 Résultats");
    });

    it("should handle zero count", () => {
      updateCount(0);
      const counter = document.querySelector(".results-counter h2");
      expect(counter.textContent).toBe("0 Résultats");
    });

    it("should handle negative count by converting to zero", () => {
      updateCount(-5);
      const counter = document.querySelector(".results-counter h2");
      expect(counter.textContent).toBe("0 Résultats");
    });

    it("should use default value of 0 when no count provided", () => {
      updateCount();
      const counter = document.querySelector(".results-counter h2");
      expect(counter.textContent).toBe("0 Résultats");
    });

    it("should handle missing counter element gracefully", () => {
      document.body.innerHTML = "";
      expect(() => updateCount(5)).not.toThrow();
    });
  });

  describe("initSearch", () => {
    it("should set up search input listener", () => {
      const input = document.querySelector(".search-bar-group input");
      initSearch(mockRecipes);

      // Wait for async initialization
      return new Promise(resolve => {
        setTimeout(() => {
          input.value = "one";
          input.dispatchEvent(new Event("input"));

          setTimeout(() => {
            expect(renderRecipes).toHaveBeenCalled();
            resolve();
          }, 350);
        }, 10);
      });
    });

    it("should set up search button click listener", () => {
      const button = document.querySelector(".search-bar-group .search-btn");
      initSearch(mockRecipes);

      return new Promise(resolve => {
        setTimeout(() => {
          button.click();
          expect(renderRecipes).toHaveBeenCalled();
          resolve();
        }, 10);
      });
    });

    it("should handle missing input element", () => {
      document.body.innerHTML = "";
      expect(() => initSearch(mockRecipes)).not.toThrow();
    });

    it("should filter recipes by search term", () => {
      const input = document.querySelector(".search-bar-group input");
      initSearch(mockRecipes);

      return new Promise(resolve => {
        setTimeout(() => {
          input.value = "one";
          input.dispatchEvent(new Event("input"));

          setTimeout(() => {
            const filteredCalls = renderRecipes.mock.calls.filter(call =>
              call[0].some(recipe => recipe.name === "Recipe 1"),
            );
            expect(filteredCalls.length).toBeGreaterThan(0);
            resolve();
          }, 350);
        }, 10);
      });
    });

    it("should return all recipes when search is empty", () => {
      const input = document.querySelector(".search-bar-group input");
      initSearch(mockRecipes);

      return new Promise(resolve => {
        setTimeout(() => {
          input.value = "";
          input.dispatchEvent(new Event("input"));

          setTimeout(() => {
            const lastCall = renderRecipes.mock.calls[renderRecipes.mock.calls.length - 1];
            expect(lastCall[0]).toHaveLength(3);
            resolve();
          }, 350);
        }, 10);
      });
    });

    it("should use requestIdleCallback when available", () => {
      let callbackExecuted = false;
      const mockRequestIdleCallback = vi.fn((callback, options) => {
        setTimeout(() => {
          callback({ didTimeout: false, timeRemaining: () => 50 });
          callbackExecuted = true;
        }, 0);
        return 1;
      });
      window.requestIdleCallback = mockRequestIdleCallback;

      initSearch(mockRecipes);

      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockRequestIdleCallback).toHaveBeenCalled();
          expect(mockRequestIdleCallback.mock.calls[0][1]).toEqual({ timeout: 2000 });
          expect(callbackExecuted).toBe(true);
          const input = document.querySelector(".search-bar-group input");
          expect(input).toBeDefined();
          delete window.requestIdleCallback;
          resolve();
        }, 50);
      });
    });
  });

  describe("addFilter", () => {
    beforeEach(() => {
      initSearch(mockRecipes);
    });

    it("should add ingredient filter", () => {
      addFilter("ingredients", "Tomato");
      const filters = getActiveFilters();
      expect(filters.ingredients.has("Tomato")).toBe(true);
    });

    it("should add appliance filter", () => {
      addFilter("appliances", "Oven");
      const filters = getActiveFilters();
      expect(filters.appliances.has("Oven")).toBe(true);
    });

    it("should add ustensil filter", () => {
      addFilter("ustensils", "Spoon");
      const filters = getActiveFilters();
      expect(filters.ustensils.has("Spoon")).toBe(true);
    });

    it("should trigger applyFilters when filter is added", () => {
      addFilter("ingredients", "Tomato");
      expect(renderRecipes).toHaveBeenCalled();
    });

    it("should handle invalid filter type gracefully", () => {
      expect(() => addFilter("invalid", "value")).not.toThrow();
    });
  });

  describe("removeFilter", () => {
    beforeEach(() => {
      initSearch(mockRecipes);
      addFilter("ingredients", "Tomato");
      vi.clearAllMocks();
    });

    it("should remove ingredient filter", () => {
      removeFilter("ingredients", "Tomato");
      const filters = getActiveFilters();
      expect(filters.ingredients.has("Tomato")).toBe(false);
    });

    it("should trigger applyFilters when filter is removed", () => {
      removeFilter("ingredients", "Tomato");
      expect(renderRecipes).toHaveBeenCalled();
    });

    it("should handle removing non-existent filter", () => {
      expect(() => removeFilter("ingredients", "NonExistent")).not.toThrow();
    });

    it("should handle invalid filter type gracefully", () => {
      expect(() => removeFilter("invalid", "value")).not.toThrow();
    });
  });

  describe("getActiveFilters", () => {
    beforeEach(() => {
      initSearch(mockRecipes);
    });

    it("should return empty filters initially", () => {
      const filters = getActiveFilters();
      expect(filters.ingredients.size).toBe(0);
      expect(filters.appliances.size).toBe(0);
      expect(filters.ustensils.size).toBe(0);
    });

    it("should return current active filters", () => {
      addFilter("ingredients", "Tomato");
      addFilter("appliances", "Oven");
      addFilter("ustensils", "Spoon");

      const filters = getActiveFilters();
      expect(filters.ingredients.has("Tomato")).toBe(true);
      expect(filters.appliances.has("Oven")).toBe(true);
      expect(filters.ustensils.has("Spoon")).toBe(true);
    });

    it("should return a copy of filters (not reference)", () => {
      const filters1 = getActiveFilters();
      addFilter("ingredients", "Tomato");
      const filters2 = getActiveFilters();

      expect(filters1.ingredients.size).toBe(0);
      expect(filters2.ingredients.size).toBe(1);
    });
  });
});
