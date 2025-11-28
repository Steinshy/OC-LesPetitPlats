import { afterAll, describe, it, expect } from "vitest";
import { renderDropdownSearch } from "@/components/search/render.js";
import { logCategorySummary } from "../logging/console.js";

describe("search render", () => {

  describe("renderDropdownSearch", () => {
    it("should render dropdown search for ingredients", () => {
      const html = renderDropdownSearch("ingredients");

      expect(html).toContain("dropdown-search");
      expect(html).toContain('id="dropdown-ingredients-search"');
      expect(html).toContain('id="search-ingredients"');
      expect(html).toContain("Rechercher un ingredients");
    });

    it("should render dropdown search for ustensils", () => {
      const html = renderDropdownSearch("ustensils");

      expect(html).toContain('id="dropdown-ustensils-search"');
      expect(html).toContain('id="search-ustensils"');
      expect(html).toContain("Rechercher un ustensils");
    });

    it("should render dropdown search for appliances", () => {
      const html = renderDropdownSearch("appliances");

      expect(html).toContain('id="dropdown-appliances-search"');
      expect(html).toContain('id="search-appliances"');
      expect(html).toContain("Rechercher un appliances");
    });

    it("should include search input with correct attributes", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain('type="text"');
      expect(html).toContain('name="search-ingredients"');
      expect(html).toContain('placeholder="Rechercher un ingredients..."');
    });

    it("should include search icon in submit button", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain("ri-search-line");
      expect(html).toContain('id="dropdown-ingredients-search-submit-btn"');
    });

    it("should include clear button with hidden class", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain("search-clear-btn");
      expect(html).toContain("hidden");
      expect(html).toContain('id="dropdown-ingredients-search-clear-button"');
    });

    it("should include clear button with aria-label", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain("Effacer la recherche");
    });

    it("should include search bar container", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain('id="dropdown-ingredients-search"');
      expect(html).toContain("dropdown-search");
    });

    it("should include submit button with aria-label", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain("Lancer la recherche");
    });
  });

  afterAll(() => {
    logCategorySummary("searchRender", "Search Render", "All search render tests");
  });
});
