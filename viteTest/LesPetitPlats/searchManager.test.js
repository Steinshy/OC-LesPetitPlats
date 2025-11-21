import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { setupMainHeader, setupSearchSection } from "../../src/components/search/manager.js";
import { logCategorySummary } from "./utils/logging/console.js";

vi.mock("../../src/components/skeletons.js", () => ({
  showSearchSkeleton: vi.fn(),
  hideSearchSkeleton: vi.fn(),
}));

const MAIN_SEARCH_INPUT_ID = "main-search-input";
const MAIN_CLEAR_SEARCH_BTN_ID = "main-clear-search-btn";
const MAIN_SEARCH_BTN_ID = "main-search-btn";

describe("search manager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("setupMainHeader", () => {
    it("should setup main header with recipe data", () => {
      document.body.innerHTML = '<div id="header"></div>';

      const recipesData = [
        {
          images: {
            jpgUrl: "/recipes/test1.jpg",
            webpUrl: "/recipes/test1.webp",
            alt: "Test 1",
          },
        },
        {
          images: {
            jpgUrl: "/recipes/test2.jpg",
            webpUrl: "/recipes/test2.webp",
            alt: "Test 2",
          },
        },
      ];

      setupMainHeader(recipesData);

      const header = document.getElementById("header");
      expect(header.innerHTML).toContain("main-header");
      expect(header.innerHTML).toContain("Cherchez parmi plus de 1500 recettes");
    });

    it("should handle null recipes data", () => {
      document.body.innerHTML = '<div id="header"></div>';

      expect(() => setupMainHeader(null)).not.toThrow();
    });

    it("should handle missing header element", () => {
      document.body.innerHTML = "";

      expect(() => setupMainHeader([{ images: {} }])).not.toThrow();
    });

    it("should handle recipes without images", () => {
      document.body.innerHTML = '<div id="header"></div>';

      const recipesData = [{ name: "Recipe 1" }, { name: "Recipe 2" }];
      setupMainHeader(recipesData);

      const header = document.getElementById("header");
      expect(header.innerHTML).toBe("");
    });

    it("should select random image from recipes", () => {
      document.body.innerHTML = '<div id="header"></div>';

      const recipesData = [
        { images: { jpgUrl: "/recipes/1.jpg" } },
        { images: { jpgUrl: "/recipes/2.jpg" } },
        { images: { jpgUrl: "/recipes/3.jpg" } },
      ];

      setupMainHeader(recipesData);

      const header = document.getElementById("header");
      const hasImage = header.innerHTML.includes("/recipes/1.jpg") ||
        header.innerHTML.includes("/recipes/2.jpg") ||
        header.innerHTML.includes("/recipes/3.jpg");

      expect(hasImage).toBe(true);
    });
  });

  describe("setupSearchSection", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="main-search-bar" id="main-search-bar">
          <div class="search-bar-container" id="search-bar-container">
            <input type="text" id="main-search-input" />
            <button id="main-clear-search-btn" class="hidden"></button>
            <button id="main-search-btn" class="search-btn"></button>
          </div>
        </div>
      `;
    });

    it("should setup search section event handlers", () => {
      setupSearchSection();

      const searchInput = document.getElementById("main-search-input");
      const eventSpy = vi.fn();
      document.addEventListener("filters:searchChanged", eventSpy);

      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));

      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.query).toBe("test");
    });

    it("should toggle clear button visibility on input", () => {
      setupSearchSection();

      const searchInput = document.getElementById(MAIN_SEARCH_INPUT_ID);
      const clearButton = document.getElementById(MAIN_CLEAR_SEARCH_BTN_ID);
      const searchButton = document.getElementById(MAIN_SEARCH_BTN_ID);

      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));

      expect(clearButton.classList.contains("hidden")).toBe(false);
      expect(searchButton.classList.contains("hidden")).toBe(true);
    });

    it("should clear search on clear button click", () => {
      setupSearchSection();

      const searchInput = document.getElementById(MAIN_SEARCH_INPUT_ID);
      const clearButton = document.getElementById(MAIN_CLEAR_SEARCH_BTN_ID);
      const searchButton = document.getElementById(MAIN_SEARCH_BTN_ID);

      searchInput.value = "test";
      clearButton.click();

      expect(searchInput.value).toBe("");
      expect(clearButton.classList.contains("hidden")).toBe(true);
      expect(searchButton.classList.contains("hidden")).toBe(false);
    });

    it("should focus search input on search button click", () => {
      setupSearchSection();

      const searchInput = document.getElementById("main-search-input");
      const searchButton = document.getElementById("main-search-btn");

      const focusSpy = vi.spyOn(searchInput, "focus");
      searchButton.click();

      expect(focusSpy).toHaveBeenCalled();
    });

    it("should dispatch searchChanged event on search button click", () => {
      setupSearchSection();

      const searchInput = document.getElementById("main-search-input");
      const searchButton = document.getElementById("main-search-btn");
      const eventSpy = vi.fn();

      document.addEventListener("filters:searchChanged", eventSpy);

      searchInput.value = "query";
      searchButton.click();

      expect(eventSpy).toHaveBeenCalled();
    });

    it("should handle missing search elements gracefully", () => {
      document.body.innerHTML = "";

      expect(() => setupSearchSection()).not.toThrow();
    });

    it("should enable search section", () => {
      setupSearchSection();

      const root = document.getElementById("main-search-bar");
      expect(root.classList.contains("disabled")).toBe(false);
    });

    it("should handle empty input", () => {
      setupSearchSection();

      const searchInput = document.getElementById(MAIN_SEARCH_INPUT_ID);
      const clearButton = document.getElementById(MAIN_CLEAR_SEARCH_BTN_ID);
      const searchButton = document.getElementById(MAIN_SEARCH_BTN_ID);

      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));

      expect(clearButton.classList.contains("hidden")).toBe(true);
      expect(searchButton.classList.contains("hidden")).toBe(false);
    });
  });

  afterAll(() => {
    logCategorySummary("searchManager", "Search Manager", "All search manager tests");
  });
});

