import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateFilterTags } from "../../src/components/filterTags.js";
import { removeFilter } from "../../src/components/search.js";
import {
  FILTER_TAG_SELECTOR,
  FILTERS_BOX_SELECTOR,
  INGREDIENTS_LIST_SELECTOR,
} from "./test-data.js";

vi.mock("../../src/components/search.js", () => ({
  removeFilter: vi.fn(),
}));

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

    updateFilterTags(activeFilters);

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

    updateFilterTags(activeFilters);

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

    updateFilterTags(activeFilters);

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

    updateFilterTags(activeFilters);
    expect(document.querySelectorAll(FILTER_TAG_SELECTOR)).toHaveLength(1);

    activeFilters.ingredients.clear();
    updateFilterTags(activeFilters);
    expect(document.querySelectorAll(FILTER_TAG_SELECTOR)).toHaveLength(0);
  });

  it("should render tags with correct data attributes", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    // Filter tags
    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    // Ingredient tag
    const ingredientTag = [...tags].find(tag => tag.dataset.type === "ingredients");
    // Appliance tag
    const applianceTag = [...tags].find(tag => tag.dataset.type === "appliances");

    expect(ingredientTag).toBeDefined();
    expect(ingredientTag.dataset.value).toBe("Tomato");
    expect(applianceTag).toBeDefined();
    expect(applianceTag.dataset.value).toBe("Oven");
  });

  it("should render tags with correct aria-label", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    // Filter tag
    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    expect(tag.getAttribute("aria-label")).toContain("Ingrédient");
    expect(tag.getAttribute("aria-label")).toContain("Tomato");
  });

  it("should call removeFilter when tag is clicked", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    // Filter tag
    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    tag.click();

    expect(removeFilter).toHaveBeenCalledWith("ingredients", "Tomato");
  });

  it("should prevent default on tag click", () => {
    // Active filters
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

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

    expect(() => updateFilterTags(activeFilters)).not.toThrow();
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

    expect(() => updateFilterTags(activeFilters)).not.toThrow();
  });

  it("should render all filter types correctly", () => {
    // Active filters with all types
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(["Spoon", "Fork"]),
    };

    updateFilterTags(activeFilters);

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
    // Active filters with unknown type
    const activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
      unknownType: new Set(["TestValue"]),
    };

    updateFilterTags(activeFilters);

    // Filter tag
    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    expect(tag).toBeDefined();
    expect(tag.getAttribute("aria-label")).toContain("unknownType");
    expect(tag.getAttribute("aria-label")).toContain("TestValue");
  });
});
