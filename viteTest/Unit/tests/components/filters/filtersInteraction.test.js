import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { filtersInteractions } from "@/components/filters/filtersInteraction.js";
import { filtersPipeline } from "@/components/filters/filtersPipeline.js";
import { filtersState, updateFilterState } from "@/components/filters/filtersState.js";
import { eventBus } from "@/utils/eventBus.js";
import { parseURLState } from "@/utils/urlState.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

vi.mock("@/components/filters/filtersUi.js", () => ({
  filtersElements: vi.fn(() => ({
    clearBtn: document.getElementById("clear-tags-button"),
    tagsList: document.getElementById("tags-list"),
  })),
  filtersUi: {
    updateTagList: vi.fn(),
    updateFiltersCounter: vi.fn(),
  },
}));

vi.mock("@/utils/urlState.js", () => ({
  parseURLState: vi.fn(() => ({
    search: "",
    ingredients: [],
    appliances: [],
    utensils: [],
  })),
}));

vi.mock("@/components/filters/filtersPipeline.js", () => ({
  filtersPipeline: {
    apply: vi.fn(),
  },
}));

describe("filtersInteractions", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="clear-tags-button">Clear All</button>
      <ul id="tags-list"></ul>
    `;
    filtersState.search = "";
    filtersState.ingredients.clear();
    filtersState.appliances.clear();
    filtersState.utensils.clear();
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("should attach event listeners", () => {
      const addEventListenerSpy = vi.spyOn(
        document.getElementById("clear-tags-button"),
        "addEventListener",
      );
      filtersInteractions.init();
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it("should listen to dropdown:itemToggled event", () => {
      const onSpy = vi.spyOn(eventBus, "on");
      filtersInteractions.init();
      expect(onSpy).toHaveBeenCalledWith("dropdown:itemToggled", expect.any(Function));
    });

    it("should listen to filters:searchChanged event", () => {
      const onSpy = vi.spyOn(eventBus, "on");
      filtersInteractions.init();
      expect(onSpy).toHaveBeenCalledWith("filters:searchChanged", expect.any(Function));
    });

    it("should listen to popstate event", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      filtersInteractions.init();
      expect(addEventListenerSpy).toHaveBeenCalledWith("popstate", expect.any(Function));
    });
  });

  describe("clear all functionality", () => {
    beforeEach(() => {
      filtersInteractions.init();
    });

    it("should clear all filters when clear button is clicked", () => {
      updateFilterState.setSearch("test");
      updateFilterState.add("ingredients", "Tomato");
      updateFilterState.add("appliances", "Oven");

      const clearBtn = document.getElementById("clear-tags-button");
      clearBtn.click();

      expect(filtersState.search).toBe("");
      expect(filtersState.ingredients.size).toBe(0);
      expect(filtersState.appliances.size).toBe(0);
      expect(filtersState.utensils.size).toBe(0);
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });
  });

  describe("tag removal", () => {
    beforeEach(() => {
      filtersInteractions.init();
    });

    it("should remove filter when tag is clicked", () => {
      updateFilterState.add("ingredients", "Tomato");
      const tagsList = document.getElementById("tags-list");
      tagsList.innerHTML = `
        <li>
          <button class="filter-tag" data-type="ingredients" data-value="Tomato">Tomato</button>
        </li>
      `;

      const tag = tagsList.querySelector(".filter-tag");
      tag.click();

      expect(filtersState.ingredients.has("Tomato")).toBe(false);
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });

    it("should handle missing tag gracefully", () => {
      const tagsList = document.getElementById("tags-list");
      tagsList.innerHTML = "<li><button>Not a tag</button></li>";
      const button = tagsList.querySelector("button");
      expect(() => button.click()).not.toThrow();
    });
  });

  describe("dropdown item toggled", () => {
    beforeEach(() => {
      filtersInteractions.init();
    });

    it("should add filter when item is not selected", () => {
      const addSpy = vi.spyOn(updateFilterState, "add");
      eventBus.emit("dropdown:itemToggled", { type: "ingredients", value: "Tomato" });
      expect(addSpy).toHaveBeenCalledWith("ingredients", "Tomato");
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });

    it("should remove filter when item is already selected", () => {
      updateFilterState.add("ingredients", "Tomato");
      const removeSpy = vi.spyOn(updateFilterState, "remove");
      eventBus.emit("dropdown:itemToggled", { type: "ingredients", value: "Tomato" });
      expect(removeSpy).toHaveBeenCalledWith("ingredients", "Tomato");
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });
  });

  describe("search input", () => {
    beforeEach(() => {
      filtersInteractions.init();
    });

    it("should update search state when search changes", () => {
      const setSearchSpy = vi.spyOn(updateFilterState, "setSearch");
      eventBus.emit("filters:searchChanged", { query: "test query" });
      expect(setSearchSpy).toHaveBeenCalledWith("test query");
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });
  });

  describe("popstate handling", () => {
    beforeEach(() => {
      filtersInteractions.init();
    });

    it("should restore filters from URL state on popstate", () => {
      parseURLState.mockReturnValue({
        search: "restored search",
        ingredients: ["Tomato", "Onion"],
        appliances: ["Oven"],
        utensils: ["Spoon"],
      });

      window.dispatchEvent(new PopStateEvent("popstate"));

      expect(filtersState.search).toBe("restored search");
      expect(filtersState.ingredients.has("Tomato")).toBe(true);
      expect(filtersState.ingredients.has("Onion")).toBe(true);
      expect(filtersState.appliances.has("Oven")).toBe(true);
      expect(filtersState.utensils.has("Spoon")).toBe(true);
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });

    it("should clear existing filters before restoring from URL", () => {
      updateFilterState.add("ingredients", "Existing");
      parseURLState.mockReturnValue({
        search: "",
        ingredients: [],
        appliances: [],
        utensils: [],
      });

      window.dispatchEvent(new PopStateEvent("popstate"));

      expect(filtersState.ingredients.size).toBe(0);
    });
  });

  afterAll(() => {
    logCategorySummary(
      "filtersInteraction",
      "Filters Interaction",
      "All filters interaction tests",
    );
  });
});
