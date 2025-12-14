import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { eventBus } from "@/utils/eventBus.js";
import { logCategorySummary } from "@viteTest-helper/message.js";
import { filtersInteractions } from "~/src/components/filters/interactions.js";
import { filtersState, updateFilterState } from "~/src/components/filters/state.js";

vi.mock("@/components/filters/elements.js", () => ({
  filtersElements: vi.fn(() => ({
    clearBtn: document.getElementById("clear-tags-button"),
    tagsList: document.getElementById("tags-list"),
  })),
}));

vi.mock("@/components/filters/ui.js", () => ({
  filtersUi: {
    updateTagList: vi.fn(),
    updateFiltersCounter: vi.fn(),
  },
}));

vi.mock("@/components/filters/pipeline.js", () => ({
  filtersPipeline: {
    apply: vi.fn(),
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
  });

  describe("clear all functionality", () => {
    beforeEach(() => {
      filtersInteractions.init();
    });

    it("should clear all filters when clear button is clicked", async () => {
      const { filtersPipeline } = await import("@/components/filters/pipeline.js");
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

    it("should remove filter when tag is clicked", async () => {
      const { filtersPipeline } = await import("@/components/filters/pipeline.js");
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

    it("should add filter when item is not selected", async () => {
      const { filtersPipeline } = await import("@/components/filters/pipeline.js");
      const addSpy = vi.spyOn(updateFilterState, "add");
      eventBus.emit("dropdown:itemToggled", { type: "ingredients", value: "Tomato" });
      expect(addSpy).toHaveBeenCalledWith("ingredients", "Tomato");
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });

    it("should remove filter when item is already selected", async () => {
      const { filtersPipeline } = await import("@/components/filters/pipeline.js");
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

    it("should update search state when search changes", async () => {
      const { filtersPipeline } = await import("@/components/filters/pipeline.js");
      const setSearchSpy = vi.spyOn(updateFilterState, "setSearch");
      eventBus.emit("filters:searchChanged", { query: "test query" });
      expect(setSearchSpy).toHaveBeenCalledWith("test query");
      expect(filtersPipeline.apply).toHaveBeenCalled();
    });
  });

  describe("cleanup", () => {
    beforeEach(() => {
      filtersInteractions.init();
    });

    it("should remove event listeners on cleanup", () => {
      const removeEventListenerSpy = vi.spyOn(
        document.getElementById("clear-tags-button"),
        "removeEventListener",
      );

      filtersInteractions.cleanup();

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it("should unregister event bus handlers on cleanup", () => {
      const offSpy = vi.spyOn(eventBus, "off");

      filtersInteractions.cleanup();

      expect(offSpy).toHaveBeenCalledWith("dropdown:itemToggled", expect.any(Function));
      expect(offSpy).toHaveBeenCalledWith("filters:searchChanged", expect.any(Function));
    });
  });

  afterAll(() => {
    logCategorySummary(
      "filtersInteraction",
      "Filters Interaction",
      "All filters interactions tests",
    );
  });
});
