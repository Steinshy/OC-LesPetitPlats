import { afterAll, describe, it, expect, beforeEach } from "vitest";
import { logCategorySummary } from "../../utils/logging/console.js";
import {
  showSearchSkeleton,
  hideSearchSkeleton,
  showDropdownsSkeletons,
  hideDropdownsSkeletons,
  buildCardSkeletons,
  hideCardSkeletons,
  squeletonsElements,
} from "../../utils/mocks/skeletonsManager.js";

const MAIN_SEARCH_BAR_SELECTOR = "#search-bar";
const SKELETON_LOADING_CLASS = "skeleton";
const CARDS_CONTAINER_ID = "recipes";
const CARD_SKELETON_SELECTOR = ".card.skeleton";
const EMPTY_HTML = "";
const DROPDOWN_INGREDIENTS_ID = "dropdown-ingredients-container";
const DROPDOWN_USTENSILS_ID = "dropdown-ustensils-container";
const DROPDOWN_APPLIANCES_ID = "dropdown-appliances-container";

describe("skeletons", () => {
  beforeEach(() => {
    document.body.innerHTML = EMPTY_HTML;
  });

  describe("showSearchSkeleton", () => {
    it(`should add ${SKELETON_LOADING_CLASS} class to search bar`, () => {
      document.body.innerHTML = `
        <div id="search-bar"></div>
      `;

      showSearchSkeleton();

      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
    });

    it("should handle missing search bar gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => showSearchSkeleton()).not.toThrow();
    });

    it("should add class if not already present", () => {
      document.body.innerHTML = `
        <div id="search-bar"></div>
      `;

      showSearchSkeleton();
      showSearchSkeleton(); // Call twice

      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
    });
  });

  describe("hideSearchSkeleton", () => {
    it(`should remove ${SKELETON_LOADING_CLASS} class from search bar`, () => {
      document.body.innerHTML = `
        <div class="main-search-bar ${SKELETON_LOADING_CLASS}"></div>
      `;

      hideSearchSkeleton();

      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
    });

    it("should handle missing search bar gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => hideSearchSkeleton()).not.toThrow();
    });

    it("should do nothing if class is not present", () => {
      document.body.innerHTML = `
        <div id="search-bar"></div>
      `;

      hideSearchSkeleton();

      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
    });
  });

  describe("showDropdownsSkeletons", () => {
    it(`should add ${SKELETON_LOADING_CLASS} class to all dropdown containers`, () => {
      document.body.innerHTML = `
        <div id="dropdowns-container"></div>
      `;

      showDropdownsSkeletons();

      const ingredients = document.getElementById(DROPDOWN_INGREDIENTS_ID);
      const ustensils = document.getElementById(DROPDOWN_USTENSILS_ID);
      const appliances = document.getElementById(DROPDOWN_APPLIANCES_ID);

      expect(ingredients).toBeTruthy();
      expect(ustensils).toBeTruthy();
      expect(appliances).toBeTruthy();
      expect(ingredients.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
      expect(ustensils.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
      expect(appliances.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
    });

    it("should handle missing containers gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => showDropdownsSkeletons()).not.toThrow();
    });

    it("should only affect existing containers", () => {
      document.body.innerHTML = `
        <div id="dropdowns-container"></div>
      `;

      showDropdownsSkeletons();

      const ingredients = document.getElementById(DROPDOWN_INGREDIENTS_ID);
      expect(ingredients).toBeTruthy();
      expect(ingredients.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
    });
  });

  describe("hideDropdownsSkeletons", () => {
    it(`should remove ${SKELETON_LOADING_CLASS} class from all dropdown containers`, () => {
      document.body.innerHTML = `
        <div id="${DROPDOWN_INGREDIENTS_ID}" class="${SKELETON_LOADING_CLASS}"></div>
        <div id="${DROPDOWN_USTENSILS_ID}" class="${SKELETON_LOADING_CLASS}"></div>
        <div id="${DROPDOWN_APPLIANCES_ID}" class="${SKELETON_LOADING_CLASS}"></div>
      `;

      // Update squeletonsElements to point to new DOM elements
      Object.assign(squeletonsElements, {
        dropdownIngredients: document.getElementById(DROPDOWN_INGREDIENTS_ID),
        dropdownUstensils: document.getElementById(DROPDOWN_USTENSILS_ID),
        dropdownAppliances: document.getElementById(DROPDOWN_APPLIANCES_ID),
      });

      hideDropdownsSkeletons();

      const ingredients = document.getElementById(DROPDOWN_INGREDIENTS_ID);
      const ustensils = document.getElementById(DROPDOWN_USTENSILS_ID);
      const appliances = document.getElementById(DROPDOWN_APPLIANCES_ID);

      expect(ingredients.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
      expect(ustensils.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
      expect(appliances.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
    });

    it("should handle missing containers gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => hideDropdownsSkeletons()).not.toThrow();
    });

    it("should do nothing if class is not present", () => {
      document.body.innerHTML = `
        <div id="${DROPDOWN_INGREDIENTS_ID}"></div>
      `;

      // Update squeletonsElements to point to new DOM element
      Object.assign(squeletonsElements, {
        dropdownIngredients: document.getElementById(DROPDOWN_INGREDIENTS_ID),
        dropdownUstensils: null,
        dropdownAppliances: null,
      });

      hideDropdownsSkeletons();

      const ingredients = document.getElementById(DROPDOWN_INGREDIENTS_ID);
      expect(ingredients.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
    });
  });

  describe("buildCardSkeletons", () => {
    it("should build card skeletons in container", () => {
      document.body.innerHTML = `<div id="${CARDS_CONTAINER_ID}"></div>`;

      buildCardSkeletons(3);

      const container = document.getElementById(CARDS_CONTAINER_ID);
      const skeletons = container.querySelectorAll(CARD_SKELETON_SELECTOR);
      expect(skeletons.length).toBe(3);
    });

    it("should clear container before building skeletons", () => {
      document.body.innerHTML = `<div id="${CARDS_CONTAINER_ID}"><div>Old content</div></div>`;

      buildCardSkeletons(2);

      const container = document.getElementById(CARDS_CONTAINER_ID);
      expect(container.innerHTML).not.toContain("Old content");
      expect(container.querySelectorAll(CARD_SKELETON_SELECTOR).length).toBe(2);
    });

    it("should not modify container when length is zero", () => {
      document.body.innerHTML = `<div id="${CARDS_CONTAINER_ID}">Content</div>`;

      buildCardSkeletons(0);

      const container = document.getElementById(CARDS_CONTAINER_ID);
      expect(container.innerHTML).toBeTruthy();
    });

    it("should handle null container gracefully", () => {
      expect(() => buildCardSkeletons(3, null)).not.toThrow();
    });

    it("should handle null length gracefully", () => {
      document.body.innerHTML = `<div id="${CARDS_CONTAINER_ID}"></div>`;
      const container = document.getElementById(CARDS_CONTAINER_ID);

      expect(() => buildCardSkeletons(null, container)).not.toThrow();
    });

    it("should handle missing container", () => {
      expect(() => buildCardSkeletons(3, undefined)).not.toThrow();
    });
  });

  describe("hideCardSkeletons", () => {
    it("should remove skeleton class from all card skeletons", () => {
      document.body.innerHTML = `
        <div class="card skeleton"></div>
        <div class="card skeleton"></div>
        <div class="card"></div>
      `;

      hideCardSkeletons();

      const skeletons = document.querySelectorAll(CARD_SKELETON_SELECTOR);
      expect(skeletons.length).toBe(0);

      const cards = document.querySelectorAll(".card");
      expect(cards.length).toBe(3);
      cards.forEach(card => {
        expect(card.classList.contains("skeleton")).toBe(false);
      });
    });

    it("should handle no skeletons gracefully", () => {
      document.body.innerHTML = `
        <div class="card"></div>
      `;

      expect(() => hideCardSkeletons()).not.toThrow();
    });

    it("should handle empty DOM gracefully", () => {
      document.body.innerHTML = EMPTY_HTML;

      expect(() => hideCardSkeletons()).not.toThrow();
    });
  });

  describe("skeleton lifecycle", () => {
    it("should show and hide search skeleton", () => {
      document.body.innerHTML = `
        <div id="search-bar"></div>
      `;

      showSearchSkeleton();
      const searchBar = document.querySelector(MAIN_SEARCH_BAR_SELECTOR);
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);

      hideSearchSkeleton();
      expect(searchBar.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
    });

    it("should show and hide dropdown skeletons", () => {
      document.body.innerHTML = `
        <div id="${DROPDOWN_INGREDIENTS_ID}"></div>
        <div id="${DROPDOWN_USTENSILS_ID}"></div>
        <div id="${DROPDOWN_APPLIANCES_ID}"></div>
      `;

      // Update squeletonsElements to point to new DOM elements
      Object.assign(squeletonsElements, {
        dropdownIngredients: document.getElementById(DROPDOWN_INGREDIENTS_ID),
        dropdownUstensils: document.getElementById(DROPDOWN_USTENSILS_ID),
        dropdownAppliances: document.getElementById(DROPDOWN_APPLIANCES_ID),
      });

      showDropdownsSkeletons();
      const containers = document.querySelectorAll(
        `#${DROPDOWN_INGREDIENTS_ID}, #${DROPDOWN_USTENSILS_ID}, #${DROPDOWN_APPLIANCES_ID}`,
      );
      containers.forEach(container => {
        expect(container.classList.contains(SKELETON_LOADING_CLASS)).toBe(true);
      });

      hideDropdownsSkeletons();
      containers.forEach(container => {
        expect(container.classList.contains(SKELETON_LOADING_CLASS)).toBe(false);
      });
    });
  });

  afterAll(() => {
    logCategorySummary("skeletons", "Skeletons", "All skeletons tests");
  });
});
