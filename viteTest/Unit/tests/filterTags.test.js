import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import {
  FILTER_TAG_SELECTOR,
  FILTERS_BOX_SELECTOR,
  INGREDIENTS_LIST_SELECTOR,
} from "../data/testData.js";
import { updateFilterTags } from "../helpers/utils.js";
import { logCategorySummary } from "../logging/console.js";

// Mock removeFilter and clearAllFilters for the tests
const removeFilter = vi.fn();
const clearAllFilters = vi.fn();

// Helper to call updateFilterTags with mocked callbacks
const updateFilterTagsWithMocks = activeFilters => {
  updateFilterTags(activeFilters, { removeFilter, clearAllFilters });
};

describe("filterTags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `
      <aside class="filters-box">
        <section class="filter-box">
          <div class="ingredients-list-wrapper">
            <div class="ingredients-list"></div>
          </div>
        </section>
      </aside>
    `;
  });

  it("should render filter tags for active filters", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato", "Onion"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(["Spoon"]),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Container element
    const container = document.querySelector(INGREDIENTS_LIST_SELECTOR);
    // Filter tags
    const tags = container.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags).toHaveLength(4);
  });

  it("should add has-filters class when filters are active", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filters box element
    const filtersBox = document.querySelector(FILTERS_BOX_SELECTOR);
    expect(filtersBox.classList.contains("has-filters")).toBe(true);
  });

  it("should remove has-filters class when no filters", () => {
    // Empty filters
    const activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filters box element
    const filtersBox = document.querySelector(FILTERS_BOX_SELECTOR);
    expect(filtersBox.classList.contains("has-filters")).toBe(false);
  });

  it("should clear container when no filters", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);
    expect(document.querySelectorAll(FILTER_TAG_SELECTOR)).toHaveLength(1);

    activeFilters.ingredients.clear();
    updateFilterTagsWithMocks(activeFilters);
    expect(document.querySelectorAll(FILTER_TAG_SELECTOR)).toHaveLength(0);
  });

  it("should render tags with correct data attributes", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filter tags
    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    // Ingredient tag
    const ingredientTag = [...tags].find(tag => tag.dataset.type === "ingredients");
    // Appliance tag
    const applianceTag = [...tags].find(tag => tag.dataset.type === "appliances");

    expect(ingredientTag).toBeDefined();
    expect(ingredientTag.dataset.value).toBe("tomato");
    expect(applianceTag).toBeDefined();
    expect(applianceTag.dataset.value).toBe("oven");
  });

    it("should render tags with correct aria-label", () => {
      // Active filters
      const activeFilters = {
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        ustensils: new Set(),
      };

      updateFilterTagsWithMocks(activeFilters);

      // Filter tag
      const tag = document.querySelector(FILTER_TAG_SELECTOR);
      // renderFilterTag uses normalizeString which lowercases, so "tomato" not "Tomato"
      expect(tag.getAttribute("aria-label")).toContain("tomato");
      expect(tag.getAttribute("aria-label")).toContain("Retirer le filtre");
    });

  it("should call removeFilter when tag is clicked", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filter tag
    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    tag.click();

    expect(removeFilter).toHaveBeenCalledWith("ingredients", "tomato");
  });

  it("should prevent default on tag click", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filter tag
    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    // Click event
    const clickEvent = new MouseEvent("click", { cancelable: true });
    // Prevent default spy
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

    tag.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should handle missing container gracefully", () => {
    document.body.innerHTML = "";

    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    expect(() => updateFilterTagsWithMocks(activeFilters)).not.toThrow();
  });

  it("should handle missing filters-box gracefully", () => {
    document.body.innerHTML = `
      <div class="ingredients-list"></div>
    `;

    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    expect(() => updateFilterTagsWithMocks(activeFilters)).not.toThrow();
  });

  it("should render all filter types correctly", () => {
    // Active filters with all types
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(["Spoon", "Fork"]),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filter tags
    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags).toHaveLength(4);

    // Filter types
    const types = [...tags].map(tag => tag.dataset.type);
    expect(types).toContain("ingredients");
    expect(types).toContain("appliances");
    expect(types).toContain("ustensils");
  });

  it("should handle invalid filter type with fallback", () => {
    // Active filters with unknown type - unknown types are ignored
    const activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
      unknownType: new Set(["TestValue"]),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Unknown filter types are not processed, so no tag should be created
    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags.length).toBe(0);
  });

  it("should handle missing filter-count element gracefully", () => {
    document.body.innerHTML = `
      <aside class="filters-box">
        <section class="filter-box">
          <div class="ingredients-list-wrapper">
            <div class="ingredients-list"></div>
          </div>
        </section>
      </aside>
    `;

    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    expect(() => updateFilterTagsWithMocks(activeFilters)).not.toThrow();
  });

  it("should call clearAllFilters when clear all button is clicked", () => {
    document.body.innerHTML = `
      <aside class="filters-box">
        <section class="filter-box">
          <div class="filter-box-header">
            <h3 class="filter-box-title">
              Filtres sélectionnés
              <span class="filter-count" id="filter-count">(0)</span>
            </h3>
            <button type="button" id="clear-all-filters" class="clear-all-btn">Tout effacer</button>
          </div>
          <div class="ingredients-list-wrapper">
            <div class="ingredients-list"></div>
          </div>
        </section>
      </aside>
    `;

    // Add clear button to HTML
    document.body.innerHTML = `
      <aside class="filters-box">
        <section class="filter-box">
          <div class="ingredients-list-wrapper">
            <div class="ingredients-list"></div>
          </div>
        </section>
        <button id="clear-filters-btn" class="clear-filters-btn"></button>
      </aside>
    `;

    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Clear all button
    const clearAllButton = document.getElementById("clear-filters-btn");
    expect(clearAllButton).toBeDefined();
    clearAllButton.click();

    expect(clearAllFilters).toHaveBeenCalled();
  });

  afterAll(() => {
    logCategorySummary("filterTags", "Filter Tags", "All filter tags tests");
  });
});
