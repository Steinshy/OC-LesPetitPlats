import { afterAll, describe, it, expect } from "vitest";
import { logCategorySummary } from "../../utils/logging/console.js";
import {
  ingredientsDropdown,
  ustensilsDropdown,
  appliancesDropdown,
  renderDropdownList,
  renderEmptyStateItem,
  renderDropdownSkeleton,
  renderDropdownsSkeletons,
} from "@/components/dropdown/render.js";

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
    it("should render ingredients dropdown with items", () => {
      const items = ["Tomato", "Onion", "Potato"];
      const html = ingredientsDropdown(items);

      expect(html).toContain(DROPDOWN_INGREDIENTS_CONTAINER_SELECTOR);
      expect(html).toContain(DATA_TYPE_INGREDIENTS_ATTR);
      expect(html).toContain(LABEL_INGREDIENTS);
      expect(html).toContain(DROPDOWN_SEARCH_STRING);
    });

    it("should handle empty items array", () => {
      const html = ingredientsDropdown([]);
      expect(html).toContain(DROPDOWN_INGREDIENTS_CONTAINER_SELECTOR);
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
    it("should render ustensils dropdown with items", () => {
      const items = ["Spoon", "Fork", "Knife"];
      const html = ustensilsDropdown(items);

      expect(html).toContain("dropdown-ustensils-container");
      expect(html).toContain(DATA_TYPE_USTENSILS_ATTR);
      expect(html).toContain(LABEL_USTENSILS);
    });

    it("should handle empty items array", () => {
      const html = ustensilsDropdown([]);
      expect(html).toContain("dropdown-ustensils-container");
    });
  });

  describe("appliancesDropdown", () => {
    it("should render appliances dropdown with items", () => {
      const items = ["Oven", "Stove"];
      const html = appliancesDropdown(items);

      expect(html).toContain("dropdown-appliances-container");
      expect(html).toContain(DATA_TYPE_APPLIANCES_ATTR);
      expect(html).toContain(LABEL_APPLIANCES);
    });

    it("should handle empty items array", () => {
      const html = appliancesDropdown([]);
      expect(html).toContain("dropdown-appliances-container");
    });
  });

  describe("renderDropdownList", () => {
    it("should render dropdown list with items", () => {
      const items = ["Tomato", "Onion"];
      const html = renderDropdownList(items, "ingredients");

      expect(html).toContain('id="dropdown-ingredients-list"');
      expect(html).toContain("Tomato");
      expect(html).toContain("Onion");
    });

    it("should include correct data attributes on items", () => {
      const items = ["Tomato"];
      const html = renderDropdownList(items, "ingredients");

      expect(html).toContain('data-value="Tomato"');
      expect(html).toContain(DATA_TYPE_INGREDIENTS_ATTR);
    });

    it("should include item labels", () => {
      const items = ["Tomato", "Onion"];
      const html = renderDropdownList(items, "ingredients");

      expect(html).toContain("dropdown-item-label");
      expect(html).toContain("Tomato");
      expect(html).toContain("Onion");
    });

    it("should include check icon in items", () => {
      const items = ["Tomato"];
      const html = renderDropdownList(items, "ingredients");

      expect(html).toContain("dropdown-item-check");
      expect(html).toContain("ri-check-line");
    });

    it("should set aria-pressed to false by default", () => {
      const items = ["Tomato"];
      const html = renderDropdownList(items, "ingredients");

      expect(html).toContain('aria-pressed="false"');
    });

    it("should handle empty items array", () => {
      const html = renderDropdownList([], "ingredients");
      expect(html).toContain('id="dropdown-ingredients-list"');
      expect(html).not.toContain("dropdown-item");
    });

    it("should include role attributes", () => {
      const items = ["Tomato"];
      const html = renderDropdownList(items, "ingredients");

      expect(html).toContain('role="listbox"');
      expect(html).toContain('role="option"');
    });

    it("should generate unique IDs for items", () => {
      const items = ["Tomato", "Onion"];
      const html = renderDropdownList(items, "ingredients");

      expect(html).toContain('id="dropdown-item-ingredients-Tomato"');
      expect(html).toContain('id="dropdown-item-ingredients-Onion"');
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
      expect(html).toContain('id="dropdown-empty-state-ingredients"');
    });
  });

  describe("renderDropdownSkeleton", () => {
    it("should render dropdown skeleton", () => {
      const html = renderDropdownSkeleton("ingredients", LABEL_INGREDIENTS);

      expect(html).toContain("dropdown-container");
      expect(html).toContain("skeleton");
      expect(html).toContain(DATA_TYPE_INGREDIENTS_ATTR);
    });

    it("should include disabled button", () => {
      const html = renderDropdownSkeleton("ingredients", LABEL_INGREDIENTS);
      expect(html).toContain("disabled");
    });

    it("should include aria-label for loading", () => {
      const html = renderDropdownSkeleton("ingredients", LABEL_INGREDIENTS);
      expect(html).toContain(`Chargement ${LABEL_INGREDIENTS}`);
    });

    it("should include correct ID", () => {
      const html = renderDropdownSkeleton("ingredients", LABEL_INGREDIENTS);
      expect(html).toContain('id="dropdown-ingredients-container"');
    });
  });

  describe("renderDropdownsSkeletons", () => {
    it("should render all three dropdown skeletons", () => {
      const html = renderDropdownsSkeletons();

      expect(html).toContain(DROPDOWN_INGREDIENTS_CONTAINER_SELECTOR);
      expect(html).toContain("dropdown-ustensils-container");
      expect(html).toContain("dropdown-appliances-container");
    });

    it("should include skeleton loading class", () => {
      const html = renderDropdownsSkeletons();
      const skeletonCount = (html.match(/skeleton/g) || []).length;
      expect(skeletonCount).toBe(3);
    });
  });

  afterAll(() => {
    logCategorySummary("dropdownRender", "Dropdown Render", "All dropdown render tests");
  });
});
