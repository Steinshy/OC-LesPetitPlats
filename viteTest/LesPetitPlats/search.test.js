import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderRecipes } from "../../src/card.js";
import {
  updateCount,
  enableSearch,
  addFilter,
  removeFilter,
  getActiveFilters,
  clearAllFilters,
  renderSearch,
} from "../../src/components/search.js";
import {
  mockRecipesForSearch,
  RESULTS_COUNTER_SELECTOR,
  SEARCH_INPUT_SELECTOR,
  SEARCH_BUTTON_SELECTOR,
} from "./test-data.js";

vi.mock("../../src/card.js", () => ({
  renderRecipes: vi.fn(),
}));

vi.mock("../../src/components/dropdown.js", () => ({
  updateDropdownsSelection: vi.fn(),
}));

vi.mock("../../src/components/filterTags.js", () => ({
  updateFilterTags: vi.fn(),
}));

describe("search", () => {
  // Mock recipes for testing
  const mockRecipes = mockRecipesForSearch;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `
      <div class="results-counter">
        <h2>0 résultats</h2>
      </div>
      <div class="search-bar-group">
        <input type="text" />
        <button class="search-btn"></button>
      </div>
    `;
  });

  describe("renderSearch", () => {
    it("should disable search input and button", () => {
      document.body.innerHTML = `
        <input type="text" id="recipe-search" />
        <div class="search-bar-group">
          <button class="search-btn"></button>
        </div>
      `;

      renderSearch();

      const input = document.getElementById("recipe-search");
      const button = document.querySelector(".search-btn");

      expect(input.disabled).toBe(true);
      expect(input.classList.contains("disabled")).toBe(true);
      expect(input.getAttribute("aria-disabled")).toBe("true");
      expect(button.disabled).toBe(true);
      expect(button.classList.contains("disabled")).toBe(true);
      expect(button.getAttribute("aria-disabled")).toBe("true");
    });

    it("should handle missing input element gracefully", () => {
      document.body.innerHTML = `
        <div class="search-bar-group">
          <button class="search-btn"></button>
        </div>
      `;

      expect(() => renderSearch()).not.toThrow();
    });

    it("should handle missing button element gracefully", () => {
      document.body.innerHTML = `
        <input type="text" id="recipe-search" />
      `;

      expect(() => renderSearch()).not.toThrow();
    });
  });

  describe("updateCount", () => {
    it("should update counter with correct count", () => {
      // Count value
      updateCount(5);
      // Counter element
      const counter = document.querySelector(RESULTS_COUNTER_SELECTOR);
      expect(counter.textContent).toBe("5 résultats");
    });

    it("should handle zero count", () => {
      // Zero count
      updateCount(0);
      // Counter element
      const counter = document.querySelector(RESULTS_COUNTER_SELECTOR);
      expect(counter.textContent).toBe("0 résultats");
    });

    it("should handle negative count by converting to zero", () => {
      // Negative count
      updateCount(-5);
      // Counter element
      const counter = document.querySelector(RESULTS_COUNTER_SELECTOR);
      expect(counter.textContent).toBe("0 résultats");
    });

    it("should use default value of 0 when no count provided", () => {
      // No count provided
      updateCount();
      // Counter element
      const counter = document.querySelector(RESULTS_COUNTER_SELECTOR);
      expect(counter.textContent).toBe("0 résultats");
    });

    it("should handle missing counter element gracefully", () => {
      document.body.innerHTML = "";
      expect(() => updateCount(5)).not.toThrow();
    });
  });

  describe("enableSearch", () => {
    it("should set up search input listener", () => {
      // Search input element
      const input = document.querySelector(SEARCH_INPUT_SELECTOR);
      enableSearch(mockRecipes);

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

    it("should handle clear button click", () => {
      document.body.innerHTML = `
        <div class="results-counter">
          <h2>0 résultats</h2>
        </div>
        <div class="search-bar-group">
          <input type="text" id="recipe-search" value="test" />
          <button id="clear-recipe-search" class="search-clear-btn"></button>
          <button class="search-btn"></button>
        </div>
      `;

      enableSearch(mockRecipes);

      return new Promise(resolve => {
        setTimeout(() => {
          // Clear button
          const clearButton = document.getElementById("clear-recipe-search");
          // Search input
          const input = document.getElementById("recipe-search");
          expect(input.value).toBe("test");

          clearButton.click();

          setTimeout(() => {
            expect(input.value).toBe("");
            expect(renderRecipes).toHaveBeenCalled();
            resolve();
          }, 350);
        }, 10);
      });
    });

    it("should set up search button click listener", () => {
      // Search button element
      const button = document.querySelector(SEARCH_BUTTON_SELECTOR);
      enableSearch(mockRecipes);

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
      expect(() => enableSearch(mockRecipes)).not.toThrow();
    });

    it("should filter recipes by search term", async () => {
      // Search input element
      const input = document.querySelector(SEARCH_INPUT_SELECTOR);
      enableSearch(mockRecipes);

      await new Promise(resolve => setTimeout(resolve, 10));
      input.value = "one";
      input.dispatchEvent(new Event("input"));

      await new Promise(resolve => setTimeout(resolve, 350));
      // Last render call
      const lastCall = renderRecipes.mock.calls[renderRecipes.mock.calls.length - 1];
      expect(lastCall).toBeDefined();
      expect(lastCall[0]).toBeDefined();
      expect(lastCall[0].some(recipe => recipe.search && recipe.search.includes("one"))).toBe(true);
    });

    it("should return all recipes when search is empty", () => {
      // Search input element
      const input = document.querySelector(SEARCH_INPUT_SELECTOR);
      enableSearch(mockRecipes);

      return new Promise(resolve => {
        setTimeout(() => {
          input.value = "";
          input.dispatchEvent(new Event("input"));

          setTimeout(() => {
            // Last render call
            const lastCall = renderRecipes.mock.calls[renderRecipes.mock.calls.length - 1];
            expect(lastCall[0]).toHaveLength(3);
            resolve();
          }, 350);
        }, 10);
      });
    });

    it("should use requestIdleCallback when available", () => {
      // Callback execution flag
      let callbackExecuted = false;
      // Mock requestIdleCallback
      const mockRequestIdleCallback = vi.fn((callback, _options) => {
        setTimeout(() => {
          callback({ didTimeout: false, timeRemaining: () => 50 });
          callbackExecuted = true;
        }, 0);
        return 1;
      });
      window.requestIdleCallback = mockRequestIdleCallback;

      enableSearch(mockRecipes);

      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockRequestIdleCallback).toHaveBeenCalled();
          expect(mockRequestIdleCallback.mock.calls[0][1]).toEqual({ timeout: 2000 });
          expect(callbackExecuted).toBe(true);
          // Search input element
          const input = document.querySelector(SEARCH_INPUT_SELECTOR);
          expect(input).toBeDefined();
          delete window.requestIdleCallback;
          resolve();
        }, 50);
      });
    });
  });

  describe("addFilter", () => {
    beforeEach(() => {
      enableSearch(mockRecipes);
    });

    it("should add ingredient filter", () => {
      addFilter("ingredients", "Tomato");
      // Active filters
      const filters = getActiveFilters();
      expect(filters.ingredients.has("Tomato")).toBe(true);
    });

    it("should add appliance filter", () => {
      addFilter("appliances", "Oven");
      // Active filters
      const filters = getActiveFilters();
      expect(filters.appliances.has("Oven")).toBe(true);
    });

    it("should add ustensil filter", () => {
      addFilter("ustensils", "Spoon");
      // Active filters
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
      enableSearch(mockRecipes);
      addFilter("ingredients", "Tomato");
      vi.clearAllMocks();
    });

    it("should remove ingredient filter", () => {
      removeFilter("ingredients", "Tomato");
      // Active filters
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
      enableSearch(mockRecipes);
    });

    it("should return empty filters initially", () => {
      // Active filters
      const filters = getActiveFilters();
      expect(filters.ingredients.size).toBe(0);
      expect(filters.appliances.size).toBe(0);
      expect(filters.ustensils.size).toBe(0);
    });

    it("should return current active filters", () => {
      addFilter("ingredients", "Tomato");
      addFilter("appliances", "Oven");
      addFilter("ustensils", "Spoon");

      // Active filters
      const filters = getActiveFilters();
      expect(filters.ingredients.has("Tomato")).toBe(true);
      expect(filters.appliances.has("Oven")).toBe(true);
      expect(filters.ustensils.has("Spoon")).toBe(true);
    });

    it("should return a copy of filters (not reference)", () => {
      // First filters snapshot
      const filters1 = getActiveFilters();
      addFilter("ingredients", "Tomato");
      // Second filters snapshot
      const filters2 = getActiveFilters();

      expect(filters1.ingredients.size).toBe(0);
      expect(filters2.ingredients.size).toBe(1);
    });
  });

  describe("clearAllFilters", () => {
    beforeEach(() => {
      enableSearch(mockRecipes);
      addFilter("ingredients", "Tomato");
      addFilter("appliances", "Oven");
      addFilter("ustensils", "Spoon");
      vi.clearAllMocks();
    });

    it("should clear all active filters", () => {
      clearAllFilters();

      // Active filters
      const filters = getActiveFilters();
      expect(filters.ingredients.size).toBe(0);
      expect(filters.appliances.size).toBe(0);
      expect(filters.ustensils.size).toBe(0);
    });

    it("should trigger applyFilters when clearing all filters", () => {
      clearAllFilters();

      expect(renderRecipes).toHaveBeenCalled();
    });
  });
});
