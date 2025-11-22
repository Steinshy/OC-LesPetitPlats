import { afterAll, describe, it, expect } from "vitest";
import { logCategorySummary } from "../../utils/logging/console.js";
import { mainHeader, mainSearchBar, renderDropdownSearch } from "@/components/search/render.js";

describe("search render", () => {
  describe("mainHeader", () => {
    it("should render main header with image data", () => {
      const imageData = {
        jpgUrl: "/recipes/test.jpg",
        webpUrl: "/recipes/test.webp",
      };

      const html = mainHeader(imageData);

      expect(html).toContain("main-header");
      expect(html).toContain("header-title");
      expect(html).toContain("Cherchez parmi plus de 1500 recettes");
      expect(html).toContain("/recipes/test.webp");
      expect(html).toContain("main-search-bar");
    });

    it("should use jpgUrl when webpUrl is not available", () => {
      const imageData = {
        jpgUrl: "/recipes/test.jpg",
      };

      const html = mainHeader(imageData);
      expect(html).toContain("/recipes/test.jpg");
    });

    it("should handle null image data", () => {
      const html = mainHeader(null);
      expect(html).toContain("main-header");
      expect(html).toContain("style=\"background-image: url()\"");
    });

    it("should include search bar in header", () => {
      const imageData = { jpgUrl: "/recipes/test.jpg" };
      const html = mainHeader(imageData);
      expect(html).toContain("main-search-bar");
    });
  });

  describe("mainSearchBar", () => {
    it("should render search bar HTML", () => {
      const html = mainSearchBar();

      expect(html).toContain("main-search-bar");
      expect(html).toContain("main-search-input");
      expect(html).toContain("main-search-btn");
      expect(html).toContain("main-clear-search-btn");
    });

    it("should include accessibility attributes", () => {
      const html = mainSearchBar();

      expect(html).toContain("sr-only");
      expect(html).toContain("aria-label");
      expect(html).toContain("Rechercher une recette, un ingrédient");
    });

    it("should include search input with correct ID", () => {
      const html = mainSearchBar();
      expect(html).toContain('id="main-search-input"');
    });

    it("should include clear button with hidden class", () => {
      const html = mainSearchBar();
      expect(html).toContain("main-clear-search-btn");
      expect(html).toContain("hidden");
    });

    it("should include search button", () => {
      const html = mainSearchBar();
      expect(html).toContain("main-search-btn");
      expect(html).toContain("ri-search-line");
    });
  });

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

    it("should include search input with aria-hidden", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain('aria-hidden="true"');
    });

    it("should include search icon", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain("search-icon");
      expect(html).toContain("ri-search-line");
    });

    it("should include clear button with hidden class", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain("clear-search");
      expect(html).toContain("hidden");
    });

    it("should include clear button with aria-label", () => {
      const html = renderDropdownSearch("ingredients");
      expect(html).toContain("Effacer la recherche");
    });
  });

  afterAll(() => {
    logCategorySummary("searchRender", "Search Render", "All search render tests");
  });
});

