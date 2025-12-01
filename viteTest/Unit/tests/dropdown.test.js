import { afterAll, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  DROPDOWN_TYPES,
  formatDropdownData,
  getFilteredItems,
  getDropdownElements,
} from "../helpers/utils.js";
import { logCategorySummary } from "../logging/console.js";

describe("dropdown utils", () => {
  describe("DROPDOWN_TYPES", () => {
    it("should export the correct dropdown types", () => {
      expect(DROPDOWN_TYPES).toBeDefined();
      expect(Array.isArray(DROPDOWN_TYPES)).toBe(true);
      expect(DROPDOWN_TYPES).toHaveLength(3);
      expect(DROPDOWN_TYPES[0]).toEqual({ name: "Ingredients", type: "ingredients" });
      expect(DROPDOWN_TYPES[1]).toEqual({ name: "Appliances", type: "appliances" });
      expect(DROPDOWN_TYPES[2]).toEqual({ name: "utensils", type: "utensils" });
    });
  });
  describe("formatDropdownData", () => {
    it("should capitalize first letter of each item", () => {
      // Dropdown data with normalized values
      const dropdownData = {
        ingredients: ["tomato", "onion", "potato"],
        appliances: ["oven", "stove"],
        utensils: ["fork", "knife", "spoon"],
      };
      // Formatted dropdown data
      const result = formatDropdownData(dropdownData);
      expect(result.ingredients).toEqual(["Tomato", "Onion", "Potato"]);
      expect(result.appliances).toEqual(["Oven", "Stove"]);
      expect(result.utensils).toEqual(["Fork", "Knife", "Spoon"]);
    });

    it("should handle empty arrays", () => {
      // Dropdown data with empty arrays
      const dropdownData = {
        ingredients: [],
        appliances: [],
        utensils: [],
      };
      // Formatted dropdown data
      const result = formatDropdownData(dropdownData);
      expect(result.ingredients).toEqual([]);
      expect(result.appliances).toEqual([]);
      expect(result.utensils).toEqual([]);
    });

    it("should preserve casing after first letter", () => {
      // Dropdown data with mixed casing
      const dropdownData = {
        ingredients: ["tOmAtO", "onION"],
        appliances: ["oVeN"],
        utensils: ["fOrK"],
      };
      // Formatted dropdown data
      const result = formatDropdownData(dropdownData);
      expect(result.ingredients).toEqual(["TOmAtO", "OnION"]);
      expect(result.appliances).toEqual(["OVeN"]);
      expect(result.utensils).toEqual(["FOrK"]);
    });

    it("should handle undefined or null values in arrays", () => {
      // Dropdown data with null/undefined values
      const dropdownData = {
        ingredients: ["tomato", null, undefined, "onion"],
        appliances: [],
        utensils: [null],
      };
      // Formatted dropdown data
      const result = formatDropdownData(dropdownData);
      expect(result.ingredients).toHaveLength(4);
      expect(result.ingredients[0]).toBe("Tomato");
      expect(result.ingredients[3]).toBe("Onion");
      expect(result.appliances).toEqual([]);
      expect(result.utensils).toHaveLength(1);
    });
  });

  describe("getFilteredItems", () => {
    // Dropdown data for testing (normalized values as used in production)
    const dropdownData = {
      ingredients: ["carrot", "onion", "potato", "tomato"],
      appliances: ["oven", "stove"],
      utensils: ["fork", "knife", "spoon"],
    };

    it("should return all items when search input is empty", () => {
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, null);
      expect(result).toEqual(dropdownData.ingredients);
    });

    it("should return all items when search input value is empty", () => {
      // Empty search input
      const filterBysearchInput = { value: "" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, filterBysearchInput);
      expect(result).toEqual(dropdownData.ingredients);
    });

    it("should filter items by search query (case insensitive)", () => {
      // Search input (uppercase)
      const filterBysearchInput = { value: "TO" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, filterBysearchInput);
      expect(result).toEqual(["potato", "tomato"]);
    });

    it("should filter items by partial match", () => {
      // Partial search input
      const filterBysearchInput = { value: "ato" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, filterBysearchInput);
      expect(result).toEqual(["potato", "tomato"]);
    });

    it("should return empty array when no match found", () => {
      // Non-matching search input
      const filterBysearchInput = { value: "xyz" };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, filterBysearchInput);
      expect(result).toEqual([]);
    });

    it("should handle whitespace in search query", () => {
      // Search input with whitespace
      const filterBysearchInput = { value: "  tomato  " };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, filterBysearchInput);
      expect(result).toEqual(["tomato"]);
    });

    it("should filter appliances", () => {
      // Search input for appliances
      const filterBysearchInput = { value: "ov" };
      // Filtered items
      const result = getFilteredItems("appliances", dropdownData, filterBysearchInput);
      expect(result).toEqual(["oven", "stove"]);
    });

    it("should filter utensils", () => {
      // Search input for utensils
      const filterBysearchInput = { value: "oo" };
      // Filtered items
      const result = getFilteredItems("utensils", dropdownData, filterBysearchInput);
      expect(result).toEqual(["spoon"]);
    });

    it("should handle undefined type in dropdownData", () => {
      // Dropdown data with missing type
      const incompleteData = {
        ingredients: ["tomato"],
        // appliances missing
        utensils: ["fork"],
      };
      // Filtered items for missing type
      const result = getFilteredItems("appliances", incompleteData, null);
      expect(result).toBeUndefined();
    });

    it("should handle filterBysearchInput with null value property", () => {
      // Search input with null value
      const filterBysearchInput = { value: null };
      // Filtered items
      const result = getFilteredItems("ingredients", dropdownData, filterBysearchInput);
      expect(result).toEqual(dropdownData.ingredients);
    });
  });

  describe("getDropdownElements", () => {
    const createDropdownElements = type => {
      const button = document.createElement("button");
      button.id = `dropdown-${type}-button`;
      const filterBysearchInput = document.createElement("input");
      filterBysearchInput.id = `search-${type}`;
      const searchIcon = document.createElement("span");
      searchIcon.id = `search-icon-${type}`;
      const clearButton = document.createElement("button");
      clearButton.id = `clear-search-${type}`;
      const menu = document.createElement("div");
      menu.id = `menu-${type}`;
      const container = document.createElement("div");
      container.id = `dropdown-${type}-container`;
      const backdrop = document.createElement("div");
      backdrop.id = `dropdown-${type}-backdrop`;

      document.body.appendChild(button);
      document.body.appendChild(filterBysearchInput);
      document.body.appendChild(searchIcon);
      document.body.appendChild(clearButton);
      document.body.appendChild(menu);
      document.body.appendChild(container);
      document.body.appendChild(backdrop);
    };

    beforeEach(() => {
      document.body.innerHTML = "";
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("should retrieve all dropdown elements for ingredients type", () => {
      createDropdownElements("ingredients");
      const elements = getDropdownElements("ingredients");

      expect(elements.button).toBeTruthy();
      expect(elements.button.id).toBe("dropdown-ingredients-button");
      expect(elements.filterBysearchInput).toBeTruthy();
      expect(elements.filterBysearchInput.id).toBe("search-ingredients");
      expect(elements.searchIcon).toBeTruthy();
      expect(elements.searchIcon.id).toBe("search-icon-ingredients");
      expect(elements.clearButton).toBeTruthy();
      expect(elements.clearButton.id).toBe("clear-search-ingredients");
      expect(elements.menu).toBeTruthy();
      expect(elements.menu.id).toBe("menu-ingredients");
      expect(elements.container).toBeTruthy();
      expect(elements.container.id).toBe("dropdown-ingredients-container");
      expect(elements.backdrop).toBeTruthy();
      expect(elements.backdrop.id).toBe("dropdown-ingredients-backdrop");
    });

    it("should retrieve all dropdown elements for appliances type", () => {
      createDropdownElements("appliances");
      const elements = getDropdownElements("appliances");

      expect(elements.button).toBeTruthy();
      expect(elements.button.id).toBe("dropdown-appliances-button");
      expect(elements.filterBysearchInput).toBeTruthy();
      expect(elements.filterBysearchInput.id).toBe("search-appliances");
      expect(elements.searchIcon).toBeTruthy();
      expect(elements.searchIcon.id).toBe("search-icon-appliances");
      expect(elements.clearButton).toBeTruthy();
      expect(elements.clearButton.id).toBe("clear-search-appliances");
      expect(elements.menu).toBeTruthy();
      expect(elements.menu.id).toBe("menu-appliances");
      expect(elements.container).toBeTruthy();
      expect(elements.container.id).toBe("dropdown-appliances-container");
      expect(elements.backdrop).toBeTruthy();
      expect(elements.backdrop.id).toBe("dropdown-appliances-backdrop");
    });

    it("should retrieve all dropdown elements for utensils type", () => {
      createDropdownElements("utensils");
      const elements = getDropdownElements("utensils");

      expect(elements.button).toBeTruthy();
      expect(elements.button.id).toBe("dropdown-utensils-button");
      expect(elements.filterBysearchInput).toBeTruthy();
      expect(elements.filterBysearchInput.id).toBe("search-utensils");
      expect(elements.searchIcon).toBeTruthy();
      expect(elements.searchIcon.id).toBe("search-icon-utensils");
      expect(elements.clearButton).toBeTruthy();
      expect(elements.clearButton.id).toBe("clear-search-utensils");
      expect(elements.menu).toBeTruthy();
      expect(elements.menu.id).toBe("menu-utensils");
      expect(elements.container).toBeTruthy();
      expect(elements.container.id).toBe("dropdown-utensils-container");
      expect(elements.backdrop).toBeTruthy();
      expect(elements.backdrop.id).toBe("dropdown-utensils-backdrop");
    });

    it("should return null for missing elements", () => {
      const elements = getDropdownElements("ingredients");

      expect(elements.button).toBeNull();
      expect(elements.filterBysearchInput).toBeNull();
      expect(elements.searchIcon).toBeNull();
      expect(elements.clearButton).toBeNull();
      expect(elements.menu).toBeNull();
      expect(elements.container).toBeNull();
      expect(elements.backdrop).toBeNull();
    });
  });

  afterAll(() => {
    logCategorySummary("dropdown", "Dropdown", "All dropdown tests");
  });
});
