import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/components/skeletonsManager.js", () => ({
  searchSkeleton: vi.fn(() => ({
    show: vi.fn(),
    hide: vi.fn(),
  })),
}));

vi.mock("@/components/search/elements.js", () => ({
  searchElements: {
    get searchBar() {
      return document.getElementById("search-bar");
    },
    get searchInput() {
      return document.getElementById("search-input");
    },
    get clearButton() {
      return document.getElementById("search-clear-button");
    },
    get submitSearch() {
      return document.getElementById("search-submit-btn");
    },
  },
}));

import { setupSearchBar } from "@/components/search/manager.js";
import { logCategorySummary } from "../../utils/logging/console.js";

const SEARCH_INPUT_ID = "search-input";
const SEARCH_CLEAR_BTN_ID = "search-clear-button";
const SEARCH_SUBMIT_BTN_ID = "search-submit-btn";
const SEARCH_BAR_ID = "search-bar";

describe("search manager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("setupSearchBar", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="search-bar" class="main-search-bar">
          <div class="search-bar-container">
            <input type="text" id="search-input" />
            <button id="search-clear-button" class="hidden"></button>
            <button id="search-submit-btn" class="search-btn"></button>
          </div>
        </div>
      `;
    });

    it("should setup search section event handlers", () => {
      const eventSpy = vi.fn();
      document.addEventListener("filters:searchChanged", eventSpy);

      setupSearchBar();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));

      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.query).toBe("test");
    });

    it("should toggle clear button visibility on input", () => {
      setupSearchBar();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const clearButton = document.getElementById(SEARCH_CLEAR_BTN_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));

      expect(clearButton.classList.contains("hidden")).toBe(false);
      expect(searchButton.classList.contains("hidden")).toBe(true);
    });

    it("should clear search on clear button click", () => {
      setupSearchBar();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const clearButton = document.getElementById(SEARCH_CLEAR_BTN_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input")); // Trigger input to show clear button
      clearButton.click();

      expect(searchInput.value).toBe("");
      expect(clearButton.classList.contains("hidden")).toBe(true);
      expect(searchButton.classList.contains("hidden")).toBe(false);
    });

    it("should focus search input on search button click", () => {
      setupSearchBar();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      const focusSpy = vi.spyOn(searchInput, "focus");
      searchButton.click();

      expect(focusSpy).toHaveBeenCalled();
    });

    it("should dispatch searchChanged event on search button click", () => {
      const eventSpy = vi.fn();
      document.addEventListener("filters:searchChanged", eventSpy);

      setupSearchBar();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchInput.value = "query";
      searchButton.click();

      expect(eventSpy).toHaveBeenCalled();
    });

    it("should handle missing search elements gracefully", () => {
      document.body.innerHTML = "";

      expect(() => setupSearchBar()).not.toThrow();
    });

    it("should enable search section", () => {
      setupSearchBar();

      const root = document.getElementById(SEARCH_BAR_ID);
      expect(root.classList.contains("disabled")).toBe(false);
    });

    it("should handle empty input", () => {
      setupSearchBar();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const clearButton = document.getElementById(SEARCH_CLEAR_BTN_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

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

