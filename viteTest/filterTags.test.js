import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateFilterTags } from "../src/components/filterTags.js";
import { removeFilter } from "../src/components/search.js";

vi.mock("../src/components/search.js", () => ({
  removeFilter: vi.fn(),
}));

describe("filterTags", () => {
  const FILTER_TAG_SELECTOR = ".filter-tag";

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
    const activeFilters = {
      ingredients: new Set(["Tomato", "Onion"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(["Spoon"]),
    };

    updateFilterTags(activeFilters);

    const container = document.querySelector(".ingredients-list");
    const tags = container.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags).toHaveLength(4);
  });

  it("should add has-filters class when filters are active", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    const filtersBox = document.querySelector(".filters-box");
    expect(filtersBox.classList.contains("has-filters")).toBe(true);
  });

  it("should remove has-filters class when no filters", () => {
    const activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    const filtersBox = document.querySelector(".filters-box");
    expect(filtersBox.classList.contains("has-filters")).toBe(false);
  });

  it("should clear container when no filters", () => {
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
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    const ingredientTag = [...tags].find(tag => tag.dataset.type === "ingredients");
    const applianceTag = [...tags].find(tag => tag.dataset.type === "appliances");

    expect(ingredientTag).toBeDefined();
    expect(ingredientTag.dataset.value).toBe("Tomato");
    expect(applianceTag).toBeDefined();
    expect(applianceTag.dataset.value).toBe("Oven");
  });

  it("should render tags with correct aria-label", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    expect(tag.getAttribute("aria-label")).toContain("Ingrédient");
    expect(tag.getAttribute("aria-label")).toContain("Tomato");
  });

  it("should call removeFilter when tag is clicked", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    tag.click();

    expect(removeFilter).toHaveBeenCalledWith("ingredients", "Tomato");
  });

  it("should prevent default on tag click", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    updateFilterTags(activeFilters);

    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    const clickEvent = new MouseEvent("click", { cancelable: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

    tag.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should handle missing container gracefully", () => {
    document.body.innerHTML = "";

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

    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(),
      ustensils: new Set(),
    };

    expect(() => updateFilterTags(activeFilters)).not.toThrow();
  });

  it("should render all filter types correctly", () => {
    const activeFilters = {
      ingredients: new Set(["Tomato"]),
      appliances: new Set(["Oven"]),
      ustensils: new Set(["Spoon", "Fork"]),
    };

    updateFilterTags(activeFilters);

    const tags = document.querySelectorAll(FILTER_TAG_SELECTOR);
    expect(tags).toHaveLength(4);

    const types = [...tags].map(tag => tag.dataset.type);
    expect(types).toContain("ingredients");
    expect(types).toContain("appliances");
    expect(types).toContain("ustensils");
  });

  it("should handle invalid filter type with fallback", () => {
    const activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
      unknownType: new Set(["TestValue"]),
    };

    updateFilterTags(activeFilters);

    const tag = document.querySelector(FILTER_TAG_SELECTOR);
    expect(tag).toBeDefined();
    expect(tag.getAttribute("aria-label")).toContain("unknownType");
    expect(tag.getAttribute("aria-label")).toContain("TestValue");
  });
});
