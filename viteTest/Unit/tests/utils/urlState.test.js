import { afterAll, describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { logCategorySummary } from "@viteTest-helper/message.js";

// Unmock urlState to test the actual implementation
vi.unmock("@/utils/urlState.js");
const { parseURLState, updateURLState, clearURLState } = await import("@/utils/urlState.js");

describe("urlState", () => {
  let originalLocation;
  let originalHistory;

  beforeEach(() => {
    // Save original values
    originalLocation = window.location;
    originalHistory = window.history;

    // Mock window.location
    delete window.location;
    window.location = {
      pathname: "/test",
      search: "",
    };

    // Mock window.history.pushState
    window.history.pushState = vi.fn();
  });

  afterEach(() => {
    // Restore original values
    window.location = originalLocation;
    window.history = originalHistory;
    vi.clearAllMocks();
  });

  describe("parseURLState", () => {
    it("should parse empty URL state", () => {
      window.location.search = "";

      const result = parseURLState();

      expect(result.search).toBe("");
      expect(result.ingredients).toBeInstanceOf(Set);
      expect(result.ingredients.size).toBe(0);
      expect(result.appliances).toBeInstanceOf(Set);
      expect(result.appliances.size).toBe(0);
      expect(result.utensils).toBeInstanceOf(Set);
      expect(result.utensils.size).toBe(0);
    });

    it("should parse search parameter", () => {
      window.location.search = "?search=test+query";

      const result = parseURLState();

      expect(result.search).toBe("test query");
    });

    it("should parse single ingredient", () => {
      window.location.search = "?ingredients=Tomato";

      const result = parseURLState();

      expect(result.ingredients).toBeInstanceOf(Set);
      expect(result.ingredients.size).toBe(1);
      expect(result.ingredients.has("tomato")).toBe(true);
    });

    it("should parse multiple ingredients as comma-separated", () => {
      window.location.search = "?ingredients=Tomato,Onion,Potato";

      const result = parseURLState();

      expect(result.ingredients).toBeInstanceOf(Set);
      expect(result.ingredients.size).toBe(3);
      expect(result.ingredients.has("tomato")).toBe(true);
      expect(result.ingredients.has("onion")).toBe(true);
      expect(result.ingredients.has("potato")).toBe(true);
    });

    it("should parse single appliance", () => {
      window.location.search = "?appliances=Oven";

      const result = parseURLState();

      expect(result.appliances).toBeInstanceOf(Set);
      expect(result.appliances.size).toBe(1);
      expect(result.appliances.has("oven")).toBe(true);
    });

    it("should parse multiple appliances", () => {
      window.location.search = "?appliances=Oven,Stove";

      const result = parseURLState();

      expect(result.appliances).toBeInstanceOf(Set);
      expect(result.appliances.size).toBe(2);
      expect(result.appliances.has("oven")).toBe(true);
      expect(result.appliances.has("stove")).toBe(true);
    });

    it("should parse single utensil", () => {
      window.location.search = "?utensils=Spoon";

      const result = parseURLState();

      expect(result.utensils).toBeInstanceOf(Set);
      expect(result.utensils.size).toBe(1);
      expect(result.utensils.has("spoon")).toBe(true);
    });

    it("should parse multiple utensils", () => {
      window.location.search = "?utensils=Spoon,Fork,Knife";

      const result = parseURLState();

      expect(result.utensils).toBeInstanceOf(Set);
      expect(result.utensils.size).toBe(3);
      expect(result.utensils.has("spoon")).toBe(true);
      expect(result.utensils.has("fork")).toBe(true);
      expect(result.utensils.has("knife")).toBe(true);
    });

    it("should parse all parameters together", () => {
      window.location.search =
        "?search=recipe&ingredients=Tomato,Onion&appliances=Oven&utensils=Spoon";

      const result = parseURLState();

      expect(result.search).toBe("recipe");
      expect(result.ingredients.size).toBe(2);
      expect(result.appliances.size).toBe(1);
      expect(result.utensils.size).toBe(1);
    });

    it("should filter out empty values", () => {
      window.location.search = "?ingredients=Tomato,,Onion,";

      const result = parseURLState();

      expect(result.ingredients.size).toBe(2);
      expect(result.ingredients.has("tomato")).toBe(true);
      expect(result.ingredients.has("onion")).toBe(true);
    });

    it("should handle missing parameters", () => {
      window.location.search = "?search=test";

      const result = parseURLState();

      expect(result.search).toBe("test");
      expect(result.ingredients.size).toBe(0);
      expect(result.appliances.size).toBe(0);
      expect(result.utensils.size).toBe(0);
    });
  });

  describe("updateURLState", () => {
    it("should update URL with search parameter", () => {
      const state = {
        search: "test query",
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };

      updateURLState(state);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("search=test"),
      );
      const callArgs = window.history.pushState.mock.calls[0];
      expect(callArgs[2]).toMatch(/search=test-query/);
    });

    it("should update URL with ingredients", () => {
      const state = {
        search: "",
        ingredients: new Set(["Tomato", "Onion"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      updateURLState(state);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("ingredients=Tomato"),
      );
    });

    it("should update URL with appliances", () => {
      const state = {
        search: "",
        ingredients: new Set(),
        appliances: new Set(["Oven"]),
        utensils: new Set(),
      };

      updateURLState(state);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("appliances=Oven"),
      );
    });

    it("should update URL with utensils", () => {
      const state = {
        search: "",
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(["Spoon", "Fork"]),
      };

      updateURLState(state);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("utensils="),
      );
    });

    it("should update URL with all parameters", () => {
      const state = {
        search: "recipe",
        ingredients: new Set(["Tomato"]),
        appliances: new Set(["Oven"]),
        utensils: new Set(["Spoon"]),
      };

      updateURLState(state);

      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("search=recipe"),
      );
      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("ingredients=Tomato"),
      );
      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("appliances=Oven"),
      );
      expect(window.history.pushState).toHaveBeenCalledWith(
        { filters: state },
        "",
        expect.stringContaining("utensils=Spoon"),
      );
    });

    it("should not include empty search string", () => {
      const state = {
        search: "",
        ingredients: new Set(["Tomato"]),
        appliances: new Set(),
        utensils: new Set(),
      };

      updateURLState(state);

      const callArgs = window.history.pushState.mock.calls[0];
      expect(callArgs[2]).not.toContain("search=");
    });

    it("should not include empty Sets", () => {
      const state = {
        search: "test",
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };

      updateURLState(state);

      const callArgs = window.history.pushState.mock.calls[0];
      expect(callArgs[2]).not.toContain("ingredients=");
      expect(callArgs[2]).not.toContain("appliances=");
      expect(callArgs[2]).not.toContain("utensils=");
    });

    it("should use pathname only when no parameters", () => {
      const state = {
        search: "",
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };

      updateURLState(state);

      expect(window.history.pushState).toHaveBeenCalledWith({ filters: state }, "", "/test");
    });

    it("should handle special characters in search", () => {
      const state = {
        search: "test & query",
        ingredients: new Set(),
        appliances: new Set(),
        utensils: new Set(),
      };

      updateURLState(state);

      expect(window.history.pushState).toHaveBeenCalled();
      const callArgs = window.history.pushState.mock.calls[0];
      expect(callArgs[2]).toContain("search=");
    });
  });

  describe("clearURLState", () => {
    it("should clear URL state and keep pathname", () => {
      window.location.search = "?search=test&ingredients=Tomato";

      clearURLState();

      expect(window.history.pushState).toHaveBeenCalledWith({}, "", "/test");
    });

    it("should work with empty search string", () => {
      window.location.search = "";

      clearURLState();

      expect(window.history.pushState).toHaveBeenCalledWith({}, "", "/test");
    });

    it("should preserve pathname when clearing", () => {
      window.location.pathname = "/custom/path";
      window.location.search = "?search=test";

      clearURLState();

      expect(window.history.pushState).toHaveBeenCalledWith({}, "", "/custom/path");
    });
  });

  afterAll(() => {
    logCategorySummary("urlState", "URL State", "All urlState tests");
  });
});
