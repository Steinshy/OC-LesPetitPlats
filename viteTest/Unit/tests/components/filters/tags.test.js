import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { FILTER_TAG_SELECTOR, FILTERS_SELECTOR, FILTERS_TAGS_SELECTOR } from "@tests-data/data.js";
import { logCategorySummary } from "@viteTest-helper/message.js";
import { filtersUi } from "~/src/components/filters/ui.js";

vi.mock("@/components/dropdowns/setup.js", async () => {
  const actual = await vi.importActual("@/components/dropdowns/setup.js");
  return {
    ...actual,
    dropdownTypes: ["ingredients", "appliances", "utensils"],
  };
});

vi.mock("@/components/filters/render.js", async () => {
  const actual = await vi.importActual("@/components/filters/render.js");
  return actual;
});

describe("filterTags", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <aside class="filters" id="filters">
        <div id="tags-container" class="filters-container">
          <div class="filters-header">
            <h2 class="filters-title">
              <span class="filters-count-text" id="tags-count-text"></span>
            </h2>
            <button type="button" id="clear-tags-button" class="clear-tags-button" aria-hidden="true">Tout effacer</button>
          </div>
          <ul class="lists-container" id="tags-list"></ul>
        </div>
      </aside>
    `;
  });

  describe("updateTagList", () => {
    it("should render filter tags for active filters", () => {
      const filtersState = {
        ingredients: new Set(["Tomato", "Onion"]),
        appliances: new Set(["Oven"]),
        utensils: new Set(["Spoon"]),
      };

      filtersUi.updateTagList(filtersState);

      const container = document.querySelector(FILTERS_TAGS_SELECTOR);
      const tags = container.querySelectorAll(FILTER_TAG_SELECTOR);
      expect(tags).toHaveLength(4);
    });

    it("should clear container when no filters", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateTagList(filtersState);
      expect(document.querySelectorAll(FILTER_TAG_SELECTOR)).toHaveLength(1);

      filtersState.ingredients.clear();
      filtersUi.updateTagList(filtersState);
      expect(document.querySelectorAll(FILTER_TAG_SELECTOR)).toHaveLength(0);
    });

    it("should render tags with correct data attributes", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(["Oven"]),
        utensils: new Set(),
      };

      filtersUi.updateTagList(filtersState);

      const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
      const ingredientTag = [...tags].find(tag => tag.dataset.type === "ingredients");
      const applianceTag = [...tags].find(tag => tag.dataset.type === "appliances");

      expect(ingredientTag).toBeDefined();
      expect(ingredientTag.dataset.value).toBe("Tomato");
      expect(applianceTag).toBeDefined();
      expect(applianceTag.dataset.value).toBe("Oven");
    });

    it("should render tags with correct aria-label", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateTagList(filtersState);

      const tag = document.querySelector(FILTER_TAG_SELECTOR);
      expect(tag.getAttribute("aria-label")).toContain("Tomato");
      expect(tag.getAttribute("aria-label")).toContain("Retirer le tag");
    });

    it("should handle missing container gracefully", () => {
      document.body.innerHTML = "";

      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      expect(() => filtersUi.updateTagList(filtersState)).not.toThrow();
    });

    it("should render all filter types correctly", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(["Oven"]),
        utensils: new Set(["Spoon", "Fork"]),
      };

      filtersUi.updateTagList(filtersState);

      const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
      expect(tags).toHaveLength(4);

      const types = [...tags].map(tag => tag.dataset.type);
      expect(types).toContain("ingredients");
      expect(types).toContain("appliances");
      expect(types).toContain("utensils");
    });

    it("should ignore unknown filter types", () => {
      const filtersState = {
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
        unknownType: new Set(["TestValue"]),
      };

      filtersUi.updateTagList(filtersState);

      const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
      expect(tags.length).toBe(0);
    });
  });

  describe("updateFiltersCounter", () => {
    it("should add has-filters class when filters are active", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const filtersSection = document.querySelector(FILTERS_SELECTOR);
      expect(filtersSection.classList.contains("has-filters")).toBe(true);
    });

    it("should remove has-filters class when no filters", () => {
      const filtersState = {
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const filtersSection = document.querySelector(FILTERS_SELECTOR);
      expect(filtersSection.classList.contains("has-filters")).toBe(false);
    });

    it("should display correct count text for no filters", () => {
      const filtersState = {
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const count = document.getElementById("tags-count-text");
      expect(count.textContent).toBe("Aucun filtre sélectionné");
    });

    it("should display correct count text for one filter", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const count = document.getElementById("tags-count-text");
      expect(count.textContent).toBe("1 filtre sélectionné");
    });

    it("should display correct count text for multiple filters", () => {
      const filtersState = {
        ingredients: new Set(["Tomato", "Onion"]),
        appliances: new Set(["Oven"]),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const count = document.getElementById("tags-count-text");
      expect(count.textContent).toBe("3 filtres sélectionnés");
    });

    it("should toggle clear button visibility", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const clearBtn = document.getElementById("clear-tags-button");
      expect(clearBtn.classList.contains("visible")).toBe(true);
      expect(clearBtn.getAttribute("aria-hidden")).toBe("false");
    });

    it("should hide clear button when no filters", () => {
      const filtersState = {
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const clearBtn = document.getElementById("clear-tags-button");
      expect(clearBtn.classList.contains("visible")).toBe(false);
      expect(clearBtn.getAttribute("aria-hidden")).toBe("true");
    });

    it("should set aria-hidden on count text", () => {
      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      filtersUi.updateFiltersCounter(filtersState);

      const count = document.getElementById("tags-count-text");
      expect(count.getAttribute("aria-hidden")).toBe("false");
    });

    it("should handle missing elements gracefully", () => {
      document.body.innerHTML = `
        <aside class="filters" id="filters">
        </aside>
      `;

      const filtersState = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      expect(() => filtersUi.updateFiltersCounter(filtersState)).not.toThrow();
    });
  });

  afterAll(() => {
    logCategorySummary("filterTags", "Filter Tags", "All filter tags tests");
  });
});
