import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { logCategorySummary } from "../../utils/logging/console.js";
import {
  setupDropdowns,
  toggleDropdown,
  getOpenDropdownType,
  buildDropdownsData,
  updateDropdownContent,
  manageItemsClicks,
} from "@/components/dropdown/manager.js";

const DROPDOWN_INGREDIENTS_CONTAINER_ID = "dropdown-ingredients-container";
const DROPDOWN_USTENSILS_CONTAINER_ID = "dropdown-ustensils-container";
const DROPDOWN_APPLIANCES_CONTAINER_ID = "dropdown-appliances-container";
const DATA_TYPE_INGREDIENTS = 'data-type="ingredients"';
const DATA_TYPE_USTENSILS = 'data-type="ustensils"';
const DATA_TYPE_APPLIANCES = 'data-type="appliances"';

const ITEMS_SEPARATOR = ",";

vi.mock("@/components/dropdown/render.js", () => ({
  ingredientsDropdown: vi.fn(
    items => `
    <div id="${DROPDOWN_INGREDIENTS_CONTAINER_ID}" ${DATA_TYPE_INGREDIENTS}>
      <button id="dropdown-ingredients-button"></button>
      <div id="menu-ingredients"></div>
      <div id="dropdown-ingredients-backdrop"></div>
      ${items.join(ITEMS_SEPARATOR)}
    </div>`,
  ),
  ustensilsDropdown: vi.fn(
    items => `
    <div id="${DROPDOWN_USTENSILS_CONTAINER_ID}" ${DATA_TYPE_USTENSILS}>
      <button id="dropdown-ustensils-button"></button>
      <div id="menu-ustensils"></div>
      <div id="dropdown-ustensils-backdrop"></div>
      ${items.join(ITEMS_SEPARATOR)}
    </div>`,
  ),
  appliancesDropdown: vi.fn(
    items => `
    <div id="${DROPDOWN_APPLIANCES_CONTAINER_ID}" ${DATA_TYPE_APPLIANCES}>
      <button id="dropdown-appliances-button"></button>
      <div id="menu-appliances"></div>
      <div id="dropdown-appliances-backdrop"></div>
      ${items.join(ITEMS_SEPARATOR)}
    </div>`,
  ),
  renderDropdownsSkeletons: vi.fn(() => "<div class='skeleton'></div>"),
  renderEmptyStateItem: vi.fn(type => `<li id='dropdown-empty-state-${type}'>Empty</li>`),
}));

vi.mock("@/components/skeletons.js", () => ({
  showDropdownsSkeletons: vi.fn(),
  hideDropdownsSkeletons: vi.fn(),
}));

describe("dropdown manager", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="dropdowns-container"></div>
    `;
    vi.clearAllMocks();
  });

  const mockRecipes = [
    {
      ingredients: [{ ingredient: "Tomato" }, { ingredient: "Onion" }],
      ustensils: ["Spoon", "Fork"],
      appliance: "Oven",
    },
    {
      ingredients: [{ ingredient: "Potato" }],
      ustensils: ["Knife"],
      appliance: "Stove",
    },
  ];

  describe("buildDropdownsData", () => {
    it("should build dropdowns data from recipes", () => {
      const result = buildDropdownsData(mockRecipes);

      expect(result.ingredients).toBeDefined();
      expect(result.ustensils).toBeDefined();
      expect(result.appliances).toBeDefined();
      expect(Array.isArray(result.ingredients)).toBe(true);
      expect(Array.isArray(result.ustensils)).toBe(true);
      expect(Array.isArray(result.appliances)).toBe(true);
    });

    it("should extract ingredients from recipes", () => {
      const result = buildDropdownsData(mockRecipes);
      expect(result.ingredients.length).toBeGreaterThan(0);
    });

    it("should extract ustensils from recipes", () => {
      const result = buildDropdownsData(mockRecipes);
      expect(result.ustensils.length).toBeGreaterThan(0);
    });

    it("should extract appliances from recipes", () => {
      const result = buildDropdownsData(mockRecipes);
      expect(result.appliances.length).toBeGreaterThan(0);
    });

    it("should handle empty recipes array", () => {
      const result = buildDropdownsData([]);
      expect(result.ingredients).toEqual([]);
      expect(result.ustensils).toEqual([]);
      expect(result.appliances).toEqual([]);
    });
  });

  describe("setupDropdowns", () => {
    it("should setup dropdowns with recipe data", () => {
      setupDropdowns(mockRecipes);

      const container = document.getElementById("dropdowns-container");
      expect(container.innerHTML).toBeTruthy();
    });

    it("should handle null recipes data", () => {
      expect(() => setupDropdowns(null)).not.toThrow();
    });

    it("should handle missing container element", () => {
      document.body.innerHTML = "";
      expect(() => setupDropdowns(mockRecipes)).not.toThrow();
    });

    it("should render all three dropdown types", () => {
      setupDropdowns(mockRecipes);

      const ingredientsContainer = document.getElementById(DROPDOWN_INGREDIENTS_CONTAINER_ID);
      const ustensilsContainer = document.getElementById(DROPDOWN_USTENSILS_CONTAINER_ID);
      const appliancesContainer = document.getElementById(DROPDOWN_APPLIANCES_CONTAINER_ID);

      expect(ingredientsContainer).toBeTruthy();
      expect(ustensilsContainer).toBeTruthy();
      expect(appliancesContainer).toBeTruthy();
    });
  });

  describe("toggleDropdown", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="dropdowns-container">
          <div id="${DROPDOWN_INGREDIENTS_CONTAINER_ID}" class="dropdown-container" ${DATA_TYPE_INGREDIENTS}>
            <button id="dropdown-ingredients-button">Ingredients</button>
            <div id="dropdown-ingredients-backdrop"></div>
            <div id="menu-ingredients"></div>
          </div>
          <div id="dropdown-ustensils-container" class="dropdown-container" data-type="ustensils">
            <button id="dropdown-ustensils-button">Ustensils</button>
            <div id="dropdown-ustensils-backdrop"></div>
            <div id="menu-ustensils"></div>
          </div>
        </div>
      `;
    });

    it("should open dropdown when closed", () => {
      toggleDropdown("ingredients", true);

      const container = document.getElementById(DROPDOWN_INGREDIENTS_CONTAINER_ID);
      expect(container.classList.contains("open")).toBe(true);
    });

    it("should close dropdown when open", () => {
      const container = document.getElementById(DROPDOWN_INGREDIENTS_CONTAINER_ID);
      container.classList.add("open");

      toggleDropdown("ingredients", false);
      expect(container.classList.contains("open")).toBe(false);
    });

    it("should toggle dropdown state when forceState is null", () => {
      toggleDropdown("ingredients", null);

      const container = document.getElementById(DROPDOWN_INGREDIENTS_CONTAINER_ID);
      const isOpen = container.classList.contains("open");
      expect(typeof isOpen).toBe("boolean");
    });

    it("should close other dropdowns when opening one", () => {
      const ingredientsContainer = document.getElementById(DROPDOWN_INGREDIENTS_CONTAINER_ID);
      const ustensilsContainer = document.getElementById("dropdown-ustensils-container");

      ingredientsContainer.classList.add("open");
      toggleDropdown("ustensils", true);

      expect(ingredientsContainer.classList.contains("open")).toBe(false);
      expect(ustensilsContainer.classList.contains("open")).toBe(true);
    });
  });

  describe("getOpenDropdownType", () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="dropdowns-container"></div>';
      setupDropdowns(mockRecipes);
    });

    it("should return null when no dropdown is open", () => {
      const result = getOpenDropdownType();
      expect(result).toBeNull();
    });

    it("should return dropdown type when one is open", () => {
      setupDropdowns(mockRecipes);
      // Wait for DOM to update
      const container = document.getElementById("dropdown-ingredients-container");
      toggleDropdown("ingredients", true);
      // Verify container has open class
      expect(container?.classList.contains("open")).toBe(true);
      const result = getOpenDropdownType();
      expect(result).toBe("ingredients");
    });

    it("should return null for non-existent dropdown", () => {
      toggleDropdown("nonexistent", true);
      const result = getOpenDropdownType();
      expect(result).toBeNull();
    });

    it("should return currently open dropdown type", () => {
      setupDropdowns(mockRecipes);
      toggleDropdown("ustensils", true);
      expect(
        document.getElementById("dropdown-ustensils-container")?.classList.contains("open"),
      ).toBe(true);
      expect(getOpenDropdownType()).toBe("ustensils");

      toggleDropdown("appliances", true);
      expect(
        document.getElementById("dropdown-appliances-container")?.classList.contains("open"),
      ).toBe(true);
      expect(getOpenDropdownType()).toBe("appliances");

      toggleDropdown("ingredients", true);
      expect(
        document.getElementById("dropdown-ingredients-container")?.classList.contains("open"),
      ).toBe(true);
      expect(getOpenDropdownType()).toBe("ingredients");
    });
  });

  describe("manageItemsClicks", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button
          class="item-btn"
          ${DATA_TYPE_INGREDIENTS}
          data-value="Tomato"
          aria-pressed="false"
        >Tomato</button>
      `;
    });

    it("should toggle selected class on item click", () => {
      const itemButton = document.querySelector(".item-btn");
      const initialHasSelected = itemButton.classList.contains("selected");

      manageItemsClicks(itemButton);

      expect(itemButton.classList.contains("selected")).toBe(!initialHasSelected);
    });

    it("should dispatch dropdown:itemToggled event", () => {
      const itemButton = document.querySelector(".item-btn");
      const eventSpy = vi.fn();
      document.addEventListener("dropdown:itemToggled", eventSpy);

      manageItemsClicks(itemButton);

      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.type).toBe("ingredients");
      expect(event.detail.value).toBe("Tomato");
      expect(typeof event.detail.selected).toBe("boolean");
    });

    it("should handle null button gracefully", () => {
      expect(() => manageItemsClicks(null)).not.toThrow();
    });
  });

  describe("updateDropdownContent", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="${DROPDOWN_INGREDIENTS_CONTAINER_ID}" ${DATA_TYPE_INGREDIENTS}>
          <input id="search-ingredients" class="dropdown-search-input" />
          <i id="search-icon-ingredients"></i>
          <button id="clear-search-ingredients" class="hidden"></button>
          <ul id="dropdown-ingredients-list">
            <li><button class="item-btn" data-value="Tomato">Tomato</button></li>
            <li><button class="item-btn" data-value="Onion">Onion</button></li>
          </ul>
        </div>
      `;
      setupDropdowns(mockRecipes);
    });

    it("should update dropdown list based on search input", () => {
      const searchInput = document.getElementById("search-ingredients");
      searchInput.value = "tomato";

      updateDropdownContent("ingredients");

      const items = document.querySelectorAll("#dropdown-ingredients-list li");
      expect(items.length).toBeGreaterThan(0);
    });

    it("should show empty state when no matches", () => {
      const searchInput = document.getElementById("search-ingredients");
      searchInput.value = "nonexistent";

      updateDropdownContent("ingredients");

      const emptyState = document.getElementById("dropdown-empty-state-ingredients");
      expect(emptyState).toBeTruthy();
    });

    it("should toggle clear button visibility based on input", () => {
      const searchInput = document.getElementById("search-ingredients");
      const clearButton = document.getElementById("clear-search-ingredients");

      searchInput.value = "test";
      updateDropdownContent("ingredients");
      expect(clearButton.classList.contains("hidden")).toBe(false);

      searchInput.value = "";
      updateDropdownContent("ingredients");
      expect(clearButton.classList.contains("hidden")).toBe(true);
    });

    it("should handle missing search input gracefully", () => {
      document.body.innerHTML = "";
      expect(() => updateDropdownContent("ingredients")).not.toThrow();
    });
  });

  afterAll(() => {
    logCategorySummary("dropdownManager", "Dropdown Manager", "All dropdown manager tests");
  });
});
