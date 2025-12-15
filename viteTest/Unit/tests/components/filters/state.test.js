import { afterAll, describe, it, expect, beforeEach } from "vitest";
import { logCategorySummary } from "@viteTest-helper/message.js";
import { filtersState, updateFilterState } from "~/src/components/filters/state.js";

describe("filtersState", () => {
  beforeEach(() => {
    filtersState.search = "";
    filtersState.ingredients.clear();
    filtersState.appliances.clear();
    filtersState.utensils.clear();
  });

  describe("initial state", () => {
    it("should have empty search string", () => {
      expect(filtersState.search).toBe("");
    });

    it("should have empty Sets for all filter types", () => {
      expect(filtersState.ingredients).toBeInstanceOf(Set);
      expect(filtersState.appliances).toBeInstanceOf(Set);
      expect(filtersState.utensils).toBeInstanceOf(Set);
      expect(filtersState.ingredients.size).toBe(0);
      expect(filtersState.appliances.size).toBe(0);
      expect(filtersState.utensils.size).toBe(0);
    });
  });

  describe("updateFilterState.setSearch", () => {
    it("should set search value", () => {
      updateFilterState.setSearch("test query");
      expect(filtersState.search).toBe("test query");
    });

    it("should update existing search value", () => {
      updateFilterState.setSearch("first");
      updateFilterState.setSearch("second");
      expect(filtersState.search).toBe("second");
    });

    it("should handle empty string", () => {
      updateFilterState.setSearch("test");
      updateFilterState.setSearch("");
      expect(filtersState.search).toBe("");
    });
  });

  describe("updateFilterState.add", () => {
    it("should add value to ingredients", () => {
      updateFilterState.add("ingredients", "Tomato");
      expect(filtersState.ingredients.has("Tomato")).toBe(true);
    });

    it("should add value to appliances", () => {
      updateFilterState.add("appliances", "Oven");
      expect(filtersState.appliances.has("Oven")).toBe(true);
    });

    it("should add value to utensils", () => {
      updateFilterState.add("utensils", "Spoon");
      expect(filtersState.utensils.has("Spoon")).toBe(true);
    });

    it("should add multiple values", () => {
      updateFilterState.add("ingredients", "Tomato");
      updateFilterState.add("ingredients", "Onion");
      expect(filtersState.ingredients.size).toBe(2);
      expect(filtersState.ingredients.has("Tomato")).toBe(true);
      expect(filtersState.ingredients.has("Onion")).toBe(true);
    });

    it("should not add duplicate values", () => {
      updateFilterState.add("ingredients", "Tomato");
      updateFilterState.add("ingredients", "Tomato");
      expect(filtersState.ingredients.size).toBe(1);
    });

    it("should handle undefined type gracefully", () => {
      expect(() => updateFilterState.add("unknown", "value")).not.toThrow();
    });
  });

  describe("updateFilterState.remove", () => {
    it("should remove value from ingredients", () => {
      updateFilterState.add("ingredients", "Tomato");
      updateFilterState.remove("ingredients", "Tomato");
      expect(filtersState.ingredients.has("Tomato")).toBe(false);
    });

    it("should remove value from appliances", () => {
      updateFilterState.add("appliances", "Oven");
      updateFilterState.remove("appliances", "Oven");
      expect(filtersState.appliances.has("Oven")).toBe(false);
    });

    it("should remove value from utensils", () => {
      updateFilterState.add("utensils", "Spoon");
      updateFilterState.remove("utensils", "Spoon");
      expect(filtersState.utensils.has("Spoon")).toBe(false);
    });

    it("should handle removing non-existent value", () => {
      expect(() => updateFilterState.remove("ingredients", "NonExistent")).not.toThrow();
      expect(filtersState.ingredients.size).toBe(0);
    });

    it("should handle undefined type gracefully", () => {
      expect(() => updateFilterState.remove("unknown", "value")).not.toThrow();
    });
  });

  describe("updateFilterState.clear", () => {
    it("should clear ingredients", () => {
      updateFilterState.add("ingredients", "Tomato");
      updateFilterState.add("ingredients", "Onion");
      updateFilterState.clear("ingredients");
      expect(filtersState.ingredients.size).toBe(0);
    });

    it("should clear appliances", () => {
      updateFilterState.add("appliances", "Oven");
      updateFilterState.clear("appliances");
      expect(filtersState.appliances.size).toBe(0);
    });

    it("should clear utensils", () => {
      updateFilterState.add("utensils", "Spoon");
      updateFilterState.clear("utensils");
      expect(filtersState.utensils.size).toBe(0);
    });

    it("should handle clearing empty Set", () => {
      expect(() => updateFilterState.clear("ingredients")).not.toThrow();
      expect(filtersState.ingredients.size).toBe(0);
    });

    it("should handle undefined type gracefully", () => {
      expect(() => updateFilterState.clear("unknown")).not.toThrow();
    });
  });

  afterAll(() => {
    logCategorySummary("filtersState", "Filters State", "All filters state tests");
  });
});
