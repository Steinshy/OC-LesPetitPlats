import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import {
  searchSkeleton,
  dropdownsSkeleton,
  cardsSkeletons,
} from "@/components/skeletons/manager.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

vi.mock("@/components/dropdowns/elements.js", async () => {
  const actual = await vi.importActual("@/components/dropdowns/elements.js");
  return {
    ...actual,
    dropdownsElements: () => {
      const result = actual.dropdownsElements();
      return result;
    },
  };
});

const MAIN_SEARCH_BAR_SELECTOR = "#search-bar";
const SKELETON_LOADING_CLASS = "skeleton";
const CARDS_CONTAINER_ID = "cards-container";
const CARD_SKELETON_SELECTOR = ".card.skeleton";
const EMPTY_HTML = "";
const DROPDOWN_INGREDIENTS_ID = "dropdown-ingredients-container";
const DROPDOWN_utensils_ID = "dropdown-utensils-container";
const DROPDOWN_APPLIANCES_ID = "dropdown-appliances-container";

describe("skeletons", () => {
  beforeEach(() => {
    document.body.innerHTML = EMPTY_HTML;
  });

  describe("searchSkeleton", () => {
    it(`should add ${SKELETON_LOADING_CLASS} class to search bar`, () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <input id="search-input" />
          <button id="search-clear-button"></button>
          <button id="search-submit-button"></button>
        </div>
      `;

      searchSkeleton().show();

      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
    });

    it("should handle missing search bar gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      // searchSkeleton().show() will try to access search.classList which will throw if search is null
      // The actual code doesn't check for null, so it will throw
      // This test verifies the current behavior (throws error when element is missing)
      expect(() => searchSkeleton().show()).toThrow();
    });

    it("should add class if not already present", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <input id="search-input" />
          <button id="search-clear-button"></button>
          <button id="search-submit-button"></button>
        </div>
      `;

      searchSkeleton().show();
      searchSkeleton().show(); // Call twice

      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
    });

    it(`should remove ${SKELETON_LOADING_CLASS} class from search bar`, () => {
      document.body.innerHTML = `
        <div id="search-bar" class="${SKELETON_LOADING_CLASS}">
          <input id="search-input" />
          <button id="search-clear-button"></button>
          <button id="search-submit-button"></button>
        </div>
      `;

      searchSkeleton().hide();

      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
    });

    it("should handle missing search bar gracefully on hide", () => {
      document.body.innerHTML = EMPTY_HTML;

      // searchSkeleton().hide() will try to access search.classList which will throw if search is null
      // The actual code doesn't check for null, so it will throw
      // This test verifies the current behavior (throws error when element is missing)
      expect(() => searchSkeleton().hide()).toThrow();
    });
  });

  describe("dropdownsSkeleton", () => {
    it(`should add skeleton HTML to dropdowns container`, () => {
      document.body.innerHTML = `
        <div id="dropdowns-container"></div>
      `;

      dropdownsSkeleton().show();

      const container = document.getElementById("dropdowns-container");
      expect(container).toBeTruthy();
      expect(container.innerHTML).toContain("dropdown-container");
      expect(container.innerHTML).toContain(SKELETON_LOADING_CLASS);
    });

    it("should handle missing containers gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => dropdownsSkeleton().show()).not.toThrow();
    });

    it(`should remove skeleton dropdown containers`, () => {
      document.body.innerHTML = `
        <div id="dropdowns-container">
          <div class="dropdown-container skeleton"></div>
          <div class="dropdown-container skeleton"></div>
          <div class="dropdown-container skeleton"></div>
        </div>
      `;

      dropdownsSkeleton().hide();

      const container = document.getElementById("dropdowns-container");
      const skeletons = container.querySelectorAll(".dropdown-container.skeleton");
      expect(skeletons.length).toBe(0);
    });

    it("should handle missing containers gracefully on hide", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => dropdownsSkeleton().hide()).not.toThrow();
    });
  });

  describe("cardsSkeletons", () => {
    it("should build card skeletons in container", () => {
      document.body.innerHTML = `<div id="${CARDS_CONTAINER_ID}"></div>`;

      cardsSkeletons().show(3);

      const container = document.getElementById(CARDS_CONTAINER_ID);
      const skeletons = container.querySelectorAll(CARD_SKELETON_SELECTOR);
      expect(skeletons.length).toBe(3);
    });

    it("should clear container before building skeletons", () => {
      document.body.innerHTML = `<div id="${CARDS_CONTAINER_ID}"><div>Old content</div></div>`;

      cardsSkeletons().show(2);

      const container = document.getElementById(CARDS_CONTAINER_ID);
      expect(container.innerHTML).not.toContain("Old content");
      expect(container.querySelectorAll(CARD_SKELETON_SELECTOR).length).toBe(2);
    });

    it("should not modify container when length is zero", () => {
      document.body.innerHTML = `<div id="${CARDS_CONTAINER_ID}">Content</div>`;

      cardsSkeletons().show(0);

      const container = document.getElementById(CARDS_CONTAINER_ID);
      expect(container.innerHTML).toBeTruthy();
    });

    it("should handle null container gracefully", () => {
      document.body.innerHTML = "";
      expect(() => cardsSkeletons().show(3)).not.toThrow();
    });

    it("should remove skeleton class from all card skeletons", () => {
      document.body.innerHTML = `
        <div id="${CARDS_CONTAINER_ID}" class="skeleton">
          <div class="card skeleton"></div>
          <div class="card skeleton"></div>
          <div class="card" id="card-1"></div>
        </div>
      `;

      cardsSkeletons().hide();

      // Container skeleton class should be removed
      const container = document.getElementById(CARDS_CONTAINER_ID);
      expect(container.classList.contains("skeleton")).toBe(false);

      // Skeleton cards without id should be removed
      const skeletons = document.querySelectorAll(CARD_SKELETON_SELECTOR);
      expect(skeletons.length).toBe(0);

      // Card with id should remain
      const cards = document.querySelectorAll(".card");
      expect(cards.length).toBe(1);
      expect(cards[0].id).toBe("card-1");
    });

    it("should handle no skeletons gracefully", () => {
      document.body.innerHTML = `
        <div id="${CARDS_CONTAINER_ID}">
          <div class="card"></div>
        </div>
      `;

      expect(() => cardsSkeletons().hide()).not.toThrow();
    });

    it("should handle empty DOM gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => cardsSkeletons().hide()).not.toThrow();
    });
  });

  describe("skeleton lifecycle", () => {
    it("should show and hide search skeleton", () => {
      document.body.innerHTML = `
        <div id="search-bar">
          <input id="search-input" />
          <button id="search-clear-button"></button>
          <button id="search-submit-button"></button>
        </div>
      `;

      searchSkeleton().show();
      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);

      searchSkeleton().hide();
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
    });

    it("should show and hide dropdown skeletons", () => {
      document.body.innerHTML = `
        <div id="dropdowns-container"></div>
      `;

      dropdownsSkeleton().show();
      const container = document.getElementById("dropdowns-container");
      expect(container.innerHTML).toContain("dropdown-container");
      expect(container.innerHTML).toContain(SKELETON_LOADING_CLASS);

      dropdownsSkeleton().hide();
      const skeletons = container.querySelectorAll(".dropdown-container.skeleton");
      expect(skeletons.length).toBe(0);
    });
  });

  afterAll(() => {
    logCategorySummary("skeletons", "Skeletons", "All skeletons tests");
  });
});
