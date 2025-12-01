import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { logCategorySummary } from "../../Benchmarks/utils/console.js";
import {
  FILTER_TAG_SELECTOR,
  FILTERS_SELECTOR,
  FILTERS_TAGS_SELECTOR,
} from "../data/testData.js";
import { updateFilterTags } from "../helpers/utils.js";

// Mock removeFilter and clearAllFilters for the tests
const removeFilter = vi.fn();
const clearAllFilters = vi.fn();

// Mock dropdownTypes to ensure buildActiveFilters works
vi.mock("@/components/dropdowns/manager.js", async () => {
  const actual = await vi.importActual("@/components/dropdowns/manager.js");
  return {
    ...actual,
    dropdownTypes: ["ingredients", "appliances", "utensils"],
  };
});

// Helper to call updateFilterTags with mocked callbacks
const updateFilterTagsWithMocks = activeFilters => {
  updateFilterTags(activeFilters, { removeFilter, clearAllFilters });
};

describe("filterTags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `
      <aside class="filters" id="filters">
        <div id="filters-container" class="filters-container">
          <ul class="lists-container" id="filters-tags"></ul>
        </div>
      </aside>
    `;
  });

  it("should render filter tags for active filters", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato", "Onion"]),
      appliances: new Set(["Oven"]),
      utensils: new Set(["Spoon"]),
    };

    updateFilterTagsWithMocks(activeFilters);

    const container = document.querySelector(FILTERS_TAGS_SELECTOR);
    const tags = container.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags).toHaveLength(4);
  });

  it("should add has-filters class when filters are active", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    const filtersSection = document.querySelector(FILTERS_SELECTOR);
    expect(filtersSection.classList.contains("has-filters")).toBe(true);
  });

  it("should remove has-filters class when no filters", () => {
    const activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      utensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    const filtersSection = document.querySelector(FILTERS_SELECTOR);
    expect(filtersSection.classList.contains("has-filters")).toBe(false);
  });

  it("should clear container when no filters", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
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
      utensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filter tags
    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    // Ingredient tag
    const ingredientTag = [...tags].find(tag => tag.dataset.type === "ingredients");
    // Appliance tag
    const applianceTag = [...tags].find(tag => tag.dataset.type === "appliances");

    expect(ingredientTag).toBeDefined();
    // buildActiveFilters uses the original value from Set, not normalized
    expect(ingredientTag.dataset.value).toBe("Tomato");
    expect(applianceTag).toBeDefined();
    expect(applianceTag.dataset.value).toBe("Oven");
  });

  it("should render tags with correct aria-label", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    // renderFilterTag uses capitalized label for aria-label
    expect(tag.getAttribute("aria-label")).toContain("Tomato");
    expect(tag.getAttribute("aria-label")).toContain("Retirer le filtre");
  });

  it("should call removeFilter when tag is clicked", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filter tag
    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    tag.click();

    // removeFilter is called with the original value from dataset, which is the Set value
    expect(removeFilter).toHaveBeenCalledWith("ingredients", "Tomato");
  });

  it("should prevent default on tag click", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
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
      utensils: new Set(),
    };

    expect(() => updateFilterTagsWithMocks(activeFilters)).not.toThrow();
  });

  it("should handle missing filters section gracefully", () => {
    document.body.innerHTML = `
      <ul class="lists-container" id="filters-tags"></ul>
    `;

    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
    };

    expect(() => updateFilterTagsWithMocks(activeFilters)).not.toThrow();
  });

  it("should render all filter types correctly", () => {
    // Active filters with all types
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(["Oven"]),
      utensils: new Set(["Spoon", "Fork"]),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Filter tags
    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags).toHaveLength(4);

    // Filter types
    const types = [...tags].map(tag => tag.dataset.type);
    expect(types).toContain("ingredients");
    expect(types).toContain("appliances");
    expect(types).toContain("utensils");
  });

  it("should handle invalid filter type with fallback", () => {
    // Active filters with unknown type - unknown types are ignored
    const activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      utensils: new Set(),
      unknownType: new Set(["TestValue"]),
    };

    updateFilterTagsWithMocks(activeFilters);

    // Unknown filter types are not processed, so no tag should be created
    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags.length).toBe(0);
  });

  it("should handle missing filters-count element gracefully", () => {
    document.body.innerHTML = `
      <aside class="filters" id="filters">
        <div id="filters-container" class="filters-container">
          <ul class="lists-container" id="filters-tags"></ul>
        </div>
      </aside>
    `;

    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
    };

    expect(() => updateFilterTagsWithMocks(activeFilters)).not.toThrow();
  });

  it("should call clearAllFilters when clear all button is clicked", () => {
    document.body.innerHTML = `
      <aside class="filters" id="filters">
        <div id="filters-container" class="filters-container">
          <div class="filters-header">
            <h3 class="filters-title">
              Filtres sélectionnés
              <span class="filters-count" id="filters-count"></span>
            </h3>
            <button type="button" id="clear-filters-btn" class="clear-filters-btn">Tout effacer</button>
          </div>
          <ul class="lists-container" id="filters-tags"></ul>
        </div>
      </aside>
    `;

    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      utensils: new Set(),
    };

    updateFilterTagsWithMocks(activeFilters);

    const clearAllButton = document.getElementById("clear-filters-btn");
    expect(clearAllButton).toBeDefined();
    clearAllButton.click();

    expect(clearAllFilters).toHaveBeenCalled();
  });

  afterAll(() => {
    logCategorySummary("filterTags", "Filter Tags", "All filter tags tests");
  });
});
