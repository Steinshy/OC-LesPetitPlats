import { afterAll, describe, it, expect, vi } from "vitest";
import {
  ingredientsDropdown,
  ustensilsDropdown,
  appliancesDropdown,
  renderEmptyStateItem,
  renderDropdownItem,
} from "@/components/dropdown/render.js";
import { logCategorySummary } from "@tests-logging/console.js";

vi.mock("@/components/search/render.js", () => ({
  renderDropdownSearch: vi.fn(
    type =>
      `<div class="dropdown-search" id="dropdown-${type}-search"><input id="search-${type}" /></div>`,
  ),
}));

const DROPDOWN_INGREDIENTS_CONTAINER_SELECTOR = "dropdown-ingredients-container";
const DROPDOWN_SEARCH_STRING = "dropdown-search";
const DATA_TYPE_INGREDIENTS_ATTR = 'data-type="ingredients"';
const DATA_TYPE_USTENSILS_ATTR = 'data-type="ustensils"';
const DATA_TYPE_APPLIANCES_ATTR = 'data-type="appliances"';
const LABEL_INGREDIENTS = "Ingrédients";
const LABEL_USTENSILS = "Ustensiles";
const LABEL_APPLIANCES = "Appareils";

describe("dropdown render", () => {
  describe("ingredientsDropdown", () => {
    it("should render ingredients dropdown", () => {
      const html = ingredientsDropdown();

      expect(html).toContain(DROPDOWN_INGREDIENTS_CONTAINER_SELECTOR);
      expect(html).toContain(DATA_TYPE_INGREDIENTS_ATTR);
      expect(html).toContain(LABEL_INGREDIENTS);
      expect(html).toContain(DROPDOWN_SEARCH_STRING);
    });

    it("should include button with correct attributes", () => {
      const html = ingredientsDropdown([]);
      expect(html).toContain('id="dropdown-ingredients-button"');
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('aria-controls="menu-ingredients"');
    });

    it("should include backdrop and menu elements", () => {
      const html = ingredientsDropdown([]);
      expect(html).toContain("dropdown-ingredients-backdrop");
      expect(html).toContain('id="menu-ingredients"');
      expect(html).toContain('aria-hidden="true"');
    });

    it("should include dropdown search", () => {
      const html = ingredientsDropdown([]);
      expect(html).toContain('id="dropdown-ingredients-search"');
    });
  });

  describe("ustensilsDropdown", () => {
    it("should render ustensils dropdown", () => {
      const html = ustensilsDropdown();

      expect(html).toContain("dropdown-ustensils-container");
      expect(html).toContain(DATA_TYPE_USTENSILS_ATTR);
      expect(html).toContain(LABEL_USTENSILS);
    });
  });

  describe("appliancesDropdown", () => {
    it("should render appliances dropdown", () => {
      const html = appliancesDropdown();

      expect(html).toContain("dropdown-appliances-container");
      expect(html).toContain(DATA_TYPE_APPLIANCES_ATTR);
      expect(html).toContain(LABEL_APPLIANCES);
    });
  });

  describe("renderDropdownItem", () => {
    const DROPDOWN_TYPE_INGREDIENTS = "ingredients";
    const ITEM_ID_PREFIX = "dropdown-item-ingredients-Tomato";
    const BUTTON_ID_PREFIX = "item-btn-ingredients-Tomato";

    it("should render dropdown item with correct structure", () => {
      const item = { label: "Tomato", value: "Tomato" };
      const html = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item,
        ITEM_ID_PREFIX,
        BUTTON_ID_PREFIX,
      );

      expect(html).toContain('role="option"');
      expect(html).toContain(`id="${ITEM_ID_PREFIX}"`);
      expect(html).toContain(`id="${BUTTON_ID_PREFIX}"`);
      expect(html).toContain('data-value="Tomato"');
      expect(html).toContain(`data-type="${DROPDOWN_TYPE_INGREDIENTS}"`);
    });

    it("should include correct data attributes on items", () => {
      const item = { label: "Onion", value: "Onion" };
      const html = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item,
        "dropdown-item-ingredients-Onion",
        "item-btn-ingredients-Onion",
      );

      expect(html).toContain('data-value="Onion"');
      expect(html).toContain(`data-type="${DROPDOWN_TYPE_INGREDIENTS}"`);
    });

    it("should include item labels", () => {
      const item = { label: "Potato", value: "Potato" };
      const html = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item,
        "dropdown-item-ingredients-Potato",
        "item-btn-ingredients-Potato",
      );

      expect(html).toContain("dropdown-item-label");
      expect(html).toContain("Potato");
    });

    it("should include check icon in items", () => {
      const item = { label: "Tomato", value: "Tomato" };
      const html = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item,
        ITEM_ID_PREFIX,
        BUTTON_ID_PREFIX,
      );

      expect(html).toContain("dropdown-item-check");
      expect(html).toContain("ri-check-line");
    });

    it("should set aria-pressed to false by default", () => {
      const item = { label: "Tomato", value: "Tomato" };
      const html = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item,
        ITEM_ID_PREFIX,
        BUTTON_ID_PREFIX,
      );

      expect(html).toContain('aria-pressed="false"');
    });

    it("should include role attributes", () => {
      const item = { label: "Tomato", value: "Tomato" };
      const html = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item,
        ITEM_ID_PREFIX,
        BUTTON_ID_PREFIX,
      );

      expect(html).toContain('role="option"');
    });

    it("should generate unique IDs for items", () => {
      const item1 = { label: "Tomato", value: "Tomato" };
      const item2 = { label: "Onion", value: "Onion" };
      const html1 = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item1,
        ITEM_ID_PREFIX,
        BUTTON_ID_PREFIX,
      );
      const html2 = renderDropdownItem(
        DROPDOWN_TYPE_INGREDIENTS,
        item2,
        "dropdown-item-ingredients-Onion",
        "item-btn-ingredients-Onion",
      );

      expect(html1).toContain('id="dropdown-item-ingredients-Tomato"');
      expect(html2).toContain('id="dropdown-item-ingredients-Onion"');
    });
  });

  describe("renderEmptyStateItem", () => {
    it("should render empty state item", () => {
      const html = renderEmptyStateItem("ingredients");

      expect(html).toContain("dropdown-empty-state");
      expect(html).toContain("Aucun résultat trouvé");
      expect(html).toContain('role="option"');
    });

    it("should include correct ID with dropdown type", () => {
      const html = renderEmptyStateItem("ingredients");
      expect(html).toContain('id="dropdown-ingredients-empty-state"');
    });
  });

  afterAll(() => {
    logCategorySummary("dropdownRender", "Dropdown Render", "All dropdown render tests");
  });
});
