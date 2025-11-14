import { describe, it, expect, beforeEach } from "vitest";
import { selectRandomImages, isImageLoaded, imagesTypes } from "../../src/utils/deliveryImages.js";

describe("deliveryImages", () => {
  // Test image URL
  const TEST_IMAGE_URL = "/recipes/test.jpg";

  // Mock recipes with images
  const mockRecipesWithImages = [
    {
      image: {
        jpgUrl: "/recipes/test1.jpg",
        webpUrl: "/recipes/test1.webp",
        alt: "Test Recipe 1",
      },
    },
    {
      image: {
        jpgUrl: "/recipes/test2.jpg",
        webpUrl: "/recipes/test2.webp",
        alt: "Test Recipe 2",
      },
    },
    {
      image: {
        jpgUrl: "/recipes/test3.jpg",
        webpUrl: "/recipes/test3.webp",
        alt: "Test Recipe 3",
      },
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("selectRandomImages", () => {
    it("should return null for empty array", () => {
      // Result for empty array
      const result = selectRandomImages([]);
      expect(result).toBeNull();
    });

    it("should return null for null input", () => {
      // Result for null input
      const result = selectRandomImages(null);
      expect(result).toBeNull();
    });

    it("should return null for undefined input", () => {
      // Result for undefined input
      const result = selectRandomImages(undefined);
      expect(result).toBeNull();
    });

    it("should return an images object from recipes", () => {
      // Selected images
      const result = selectRandomImages(mockRecipesWithImages);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("jpgUrl");
      expect(result).toHaveProperty("webpUrl");
      expect(result).toHaveProperty("alt");
      expect(mockRecipesWithImages.some(recipe => recipe.image === result)).toBe(true);
    });

    it("should return null when recipe has no images property", () => {
      // Recipes without images
      const recipesWithoutImages = [{ name: "Recipe 1" }, { name: "Recipe 2" }];

      // Result
      const result = selectRandomImages(recipesWithoutImages);
      expect(result).toBeNull();
    });

    it("should return null when recipe has null images", () => {
      // Recipes with null images
      const recipesWithNullImages = [{ images: null }, { images: null }];

      // Result
      const result = selectRandomImages(recipesWithNullImages);
      expect(result).toBeNull();
    });

    it("should return images from single recipe", () => {
      // Single recipe array
      const singleRecipe = [mockRecipesWithImages[0]];
      // Selected images
      const result = selectRandomImages(singleRecipe);

      expect(result).toEqual(mockRecipesWithImages[0].image);
    });
  });

  describe("isImageLoaded", () => {
    it("should return false for empty string", () => {
      expect(isImageLoaded("")).toBe(false);
    });

    it("should return false for null", () => {
      expect(isImageLoaded(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isImageLoaded(undefined)).toBe(false);
    });

    it("should return false for image not yet loaded", () => {
      expect(isImageLoaded(TEST_IMAGE_URL)).toBe(false);
    });

    it("should track loaded images after imagesTypes processes them", () => {
      // DOM fragment
      const fragment = document.createRange().createContextualFragment(`
        <div class="card-picture">
          <div class="image-loading-placeholder"></div>
          <picture>
            <img src="${TEST_IMAGE_URL}" alt="Test" />
          </picture>
        </div>
      `);

      // Image element
      const img = fragment.querySelector("img");
      Object.defineProperty(img, "complete", { value: true, writable: true });
      Object.defineProperty(img, "naturalWidth", { value: 100, writable: true });

      imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" });

      expect(isImageLoaded(TEST_IMAGE_URL)).toBe(true);
    });
  });

  describe("imagesTypes", () => {
    it("should return early when no image URLs provided", () => {
      // DOM fragment
      const fragment = document.createRange().createContextualFragment(`
        <div class="card-picture">
          <div class="image-loading-placeholder"></div>
          <picture><img src="" alt="Test" /></picture>
        </div>
      `);

      expect(() => imagesTypes(fragment, { jpgUrl: "", webpUrl: "" })).not.toThrow();
    });

    it("should hide placeholder when image is already loaded", () => {
      // DOM fragment
      const fragment = document.createRange().createContextualFragment(`
        <div class="card-picture">
          <div class="image-loading-placeholder"></div>
          <picture>
            <img src="${TEST_IMAGE_URL}" alt="Test" />
          </picture>
        </div>
      `);

      // Placeholder element
      const placeholder = fragment.querySelector(".image-loading-placeholder");
      // Image element
      const img = fragment.querySelector("img");
      Object.defineProperty(img, "complete", { value: true, writable: true });
      Object.defineProperty(img, "naturalWidth", { value: 100, writable: true });

      imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" });

      expect(placeholder.classList.contains("hidden")).toBe(true);
      expect(isImageLoaded(TEST_IMAGE_URL)).toBe(true);
    });

    it("should handle missing placeholder gracefully", () => {
      // DOM fragment
      const fragment = document.createRange().createContextualFragment(`
        <div class="card-picture">
          <picture>
            <img src="${TEST_IMAGE_URL}" alt="Test" />
          </picture>
        </div>
      `);

      expect(() => imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" })).not.toThrow();
    });

    it("should handle missing image element gracefully", () => {
      // DOM fragment
      const fragment = document.createRange().createContextualFragment(`
        <div class="card-picture">
          <div class="image-loading-placeholder"></div>
        </div>
      `);

      expect(() => imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" })).not.toThrow();
    });
  });
});
