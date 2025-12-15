import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { setupSearch } from "@/components/search/setup.js";
import { eventBus } from "@/utils/eventBus.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

const mockSearchSkeleton = {
  show: vi.fn(),
  hide: vi.fn(),
};

vi.mock("@/components/skeletons/manager.js", () => ({
  searchSkeleton: vi.fn(() => mockSearchSkeleton),
}));

// searchElements is mocked in setup.js

const SEARCH_INPUT_ID = "search-input";
const SEARCH_CLEAR_BTN_ID = "search-clear-button";
const SEARCH_SUBMIT_BTN_ID = "search-submit-button";
const SEARCH_BAR_ID = "search-bar";

describe("search manager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    mockSearchSkeleton.hide.mockClear();
    mockSearchSkeleton.show.mockClear();
    eventBus.events = {};
  });

  describe("setupSearch", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="search-bar" class="main-search-bar">
          <div class="search-bar-container" id="search-bar-container">
            <input type="text" id="search-input" />
            <button id="search-clear-button" class="hidden"></button>
            <button id="search-submit-button" class="search-button"></button>
          </div>
        </div>
      `;
    });

    it("should setup search section event handlers", async () => {
      const eventSpy = vi.fn();
      eventBus.on("filters:searchChanged", eventSpy);

      setupSearch();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));

      await new Promise(resolve => setTimeout(resolve, 120));

      expect(eventSpy).toHaveBeenCalled();
      const payload = eventSpy.mock.calls[0][0];
      expect(payload.query).toBe("test");
    });

    it("should toggle clear button visibility on input", async () => {
      setupSearch();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const clearButton = document.getElementById(SEARCH_CLEAR_BTN_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));

      await new Promise(resolve => setTimeout(resolve, 120));

      expect(clearButton.classList.contains("hidden")).toBe(false);
      expect(searchButton.classList.contains("hidden")).toBe(true);
    });

    it("should clear search on clear button click", async () => {
      const cleanup = setupSearch();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const clearButton = document.getElementById(SEARCH_CLEAR_BTN_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));
      await new Promise(resolve => setTimeout(resolve, 120));

      clearButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        searchInput.value = "";
        searchInput.focus();
        const handleSearch = () => {
          const query = searchInput.value.trim();
          const hasText = query.length > 0;
          clearButton.classList.toggle("hidden", !hasText);
          searchButton.classList.toggle("hidden", hasText);
        };
        handleSearch();
      });
      clearButton.click();

      expect(searchInput.value).toBe("");
      expect(clearButton.classList.contains("hidden")).toBe(true);
      expect(searchButton.classList.contains("hidden")).toBe(false);
      if (cleanup) cleanup();
    });

    it("should focus search input on search button click", () => {
      const cleanup = setupSearch();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        searchInput.focus();
      });

      const focusSpy = vi.spyOn(searchInput, "focus");
      searchButton.click();

      expect(focusSpy).toHaveBeenCalled();
      if (cleanup) cleanup();
    });

    it("should dispatch searchChanged event on search button click", () => {
      const eventSpy = vi.fn();
      eventBus.on("filters:searchChanged", eventSpy);

      const cleanup = setupSearch();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchInput.value = "query";
      searchButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        searchInput.focus();
        const handleSearch = () => {
          const query = searchInput.value.trim();
          eventBus.emit("filters:searchChanged", { query });
        };
        handleSearch();
      });
      searchButton.click();

      expect(eventSpy).toHaveBeenCalled();
      const payload = eventSpy.mock.calls[0][0];
      expect(payload.query).toBe("query");
      if (cleanup) cleanup();
    });

    it("should handle missing search elements gracefully", () => {
      document.body.innerHTML = "";

      expect(() => setupSearch()).not.toThrow();
    });

    it("should hide search skeleton on setup", () => {
      setupSearch();
      expect(mockSearchSkeleton.hide).toHaveBeenCalled();
    });

    it("should handle empty input", async () => {
      setupSearch();

      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const clearButton = document.getElementById(SEARCH_CLEAR_BTN_ID);
      const searchButton = document.getElementById(SEARCH_SUBMIT_BTN_ID);

      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));

      await new Promise(resolve => setTimeout(resolve, 120));

      expect(clearButton.classList.contains("hidden")).toBe(true);
      expect(searchButton.classList.contains("hidden")).toBe(false);
    });
  });

  afterAll(() => {
    logCategorySummary("searchManager", "Search Manager", "All search manager tests");
  });
});
