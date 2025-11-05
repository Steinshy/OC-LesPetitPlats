import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderRecipes } from "../src/card.js";
import { updateCount, initSearch } from "../src/search.js";

vi.mock("../src/card.js", () => ({
  renderRecipes: vi.fn(),
}));

describe("search", () => {
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
    const mockRecipes = [
      { name: "Recipe 1", search: "recipe one test" },
      { name: "Recipe 2", search: "recipe two test" },
      { name: "Recipe 3", search: "recipe three test" },
    ];

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
  });
});
