import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { logCategorySummary } from "@viteTest-helper/message.js";

// Unmock searchElements to test the actual implementation
vi.unmock("@/components/search/elements.js");
const { searchElements } = await import("@/components/search/elements.js");

describe("searchElements", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("element retrieval", () => {
    it("should return all search elements when they exist", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <div id="search-bar-container">
            <input id="search-input" />
            <button id="search-clear-button"></button>
            <button id="search-submit-button"></button>
          </div>
        </div>
      `;

      const elements = searchElements();

      expect(elements.search).toBeTruthy();
      expect(elements.search.id).toBe("search-bar");
      expect(elements.container).toBeTruthy();
      expect(elements.container.id).toBe("search-bar-container");
      expect(elements.input).toBeTruthy();
      expect(elements.input.id).toBe("search-input");
      expect(elements.clear).toBeTruthy();
      expect(elements.clear.id).toBe("search-clear-button");
      expect(elements.submit).toBeTruthy();
      expect(elements.submit.id).toBe("search-submit-button");
    });

    it("should return null for missing search element", () => {
      document.body.innerHTML = `
        <div id="search-bar-container">
          <input id="search-input" />
        </div>
      `;

      const elements = searchElements();

      expect(elements.search).toBeNull();
      expect(elements.container).toBeTruthy();
      expect(elements.input).toBeTruthy();
    });

    it("should return null for missing container element", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <input id="search-input" />
        </div>
      `;

      const elements = searchElements();

      expect(elements.search).toBeTruthy();
      expect(elements.container).toBeNull();
      expect(elements.input).toBeTruthy();
    });

    it("should return null for missing input element", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <div id="search-bar-container">
            <button id="search-clear-button"></button>
          </div>
        </div>
      `;

      const elements = searchElements();

      expect(elements.search).toBeTruthy();
      expect(elements.container).toBeTruthy();
      expect(elements.input).toBeNull();
    });

    it("should return null for missing clear button", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <div id="search-bar-container">
            <input id="search-input" />
            <button id="search-submit-button"></button>
          </div>
        </div>
      `;

      const elements = searchElements();

      expect(elements.search).toBeTruthy();
      expect(elements.container).toBeTruthy();
      expect(elements.input).toBeTruthy();
      expect(elements.clear).toBeNull();
      expect(elements.submit).toBeTruthy();
    });

    it("should return null for missing submit button", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <div id="search-bar-container">
            <input id="search-input" />
            <button id="search-clear-button"></button>
          </div>
        </div>
      `;

      const elements = searchElements();

      expect(elements.search).toBeTruthy();
      expect(elements.container).toBeTruthy();
      expect(elements.input).toBeTruthy();
      expect(elements.clear).toBeTruthy();
      expect(elements.submit).toBeNull();
    });

    it("should return null for all elements when DOM is empty", () => {
      document.body.innerHTML = "";

      const elements = searchElements();

      expect(elements.search).toBeNull();
      expect(elements.container).toBeNull();
      expect(elements.input).toBeNull();
      expect(elements.clear).toBeNull();
      expect(elements.submit).toBeNull();
    });

    it("should return correct elements when called multiple times", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <div id="search-bar-container">
            <input id="search-input" />
            <button id="search-clear-button"></button>
            <button id="search-submit-button"></button>
          </div>
        </div>
      `;

      const elements1 = searchElements();
      const elements2 = searchElements();

      expect(elements1.search).toBe(elements2.search);
      expect(elements1.container).toBe(elements2.container);
      expect(elements1.input).toBe(elements2.input);
      expect(elements1.clear).toBe(elements2.clear);
      expect(elements1.submit).toBe(elements2.submit);
    });
  });

  afterAll(() => {
    logCategorySummary("searchElements", "Search Elements", "All search elements tests");
  });
});

