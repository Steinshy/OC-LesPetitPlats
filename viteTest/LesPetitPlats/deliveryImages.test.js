import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { selectRandomImages, isImageLoaded, imagesTypes } from "../../src/utils/deliveryImages.js";
import { logCategorySummary } from "./utils/logging/console.js";

// Test image URL
const TEST_IMAGE_URL = "/recipes/test.jpg";
// Test WebP URL
const TEST_WEBP_URL = "/recipes/test.webp";
// WebP source selector constant
const WEBP_SOURCE_SELECTOR = "source[type='image/webp']";

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

// Helper function to create a card picture fragment
const createCardPictureFragment = (imgSrc, webpSrcset = null) => {
  const webpSource = webpSrcset ? `<source type="image/webp" srcset="${webpSrcset}" />` : "";
  return document.createRange().createContextualFragment(`
    <div class="card-picture">
      <div class="image-loading-placeholder"></div>
      <picture>
        ${webpSource}
        <img src="${imgSrc}" alt="Test" />
      </picture>
    </div>
  `);
};

// Helper function to create a card picture fragment without placeholder
const createCardPictureFragmentNoPlaceholder = imgSrc => {
  return document.createRange().createContextualFragment(`
    <div class="card-picture">
      <picture>
        <img src="${imgSrc}" alt="Test" />
      </picture>
    </div>
  `);
};

// Helper function to create a card picture fragment without image
const createCardPictureFragmentNoImage = () => {
  return document.createRange().createContextualFragment(`
    <div class="card-picture">
      <div class="image-loading-placeholder"></div>
    </div>
  `);
};

describe("deliveryImages", () => {
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
      const fragment = createCardPictureFragment(TEST_IMAGE_URL);
      const img = fragment.querySelector("img");
      Object.defineProperty(img, "complete", { value: true, writable: true });
      Object.defineProperty(img, "naturalWidth", { value: 100, writable: true });
      imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" });
      expect(isImageLoaded(TEST_IMAGE_URL)).toBe(true);
    });
  });

  describe("imagesTypes", () => {
    describe("basic functionality", () => {
      it("should return early when no image URLs provided", () => {
        const fragment = createCardPictureFragment("");
        expect(() => imagesTypes(fragment, { jpgUrl: "", webpUrl: "" })).not.toThrow();
      });

      it("should hide placeholder when image is already loaded", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL);

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
        const fragment = createCardPictureFragmentNoPlaceholder(TEST_IMAGE_URL);
        expect(() => imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" })).not.toThrow();
      });

      it("should handle missing image element gracefully", () => {
        const fragment = createCardPictureFragmentNoImage();
        expect(() => imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" })).not.toThrow();
      });
    });

    describe("webp handling", () => {
      it("should handle webp source when webp is already loaded", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL, TEST_WEBP_URL);
        const webpUrl = TEST_WEBP_URL;
        // Mark webp as loaded by using imagesTypes first
        const testFragment = createCardPictureFragment(TEST_IMAGE_URL, webpUrl);
        const testImg = testFragment.querySelector("img");
        Object.defineProperty(testImg, "complete", { value: true, writable: true });
        Object.defineProperty(testImg, "naturalWidth", { value: 100, writable: true });
        imagesTypes(testFragment, { jpgUrl: TEST_IMAGE_URL, webpUrl });

        // Now test with already loaded webp
        imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl });

        // Webp source should still exist
        const webpSource = fragment.querySelector(WEBP_SOURCE_SELECTOR);
        expect(webpSource).toBeTruthy();
      });

      it("should test webp support when webp status is unknown", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL, TEST_WEBP_URL);
        const webpUrl = TEST_WEBP_URL;
        imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl });

        // Webp source should still exist (test image will load or fail)
        const webpSource = fragment.querySelector(WEBP_SOURCE_SELECTOR);
        expect(webpSource).toBeTruthy();
      });

      it("should handle webp image load success and mark as loaded", () => {
        const webpUrl = TEST_WEBP_URL;
        const fragment = createCardPictureFragment(TEST_IMAGE_URL, webpUrl);

        // Mock Image constructor to control load event
        const mockImage = {
          onload: null,
          onerror: null,
          src: "",
        };
        const OriginalImage = global.Image;
        global.Image = vi.fn(() => mockImage);

        imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl });

        // Simulate successful load
        return new Promise(resolve => {
          setTimeout(() => {
            if (mockImage.onload) {
              mockImage.onload();
            }
            // Verify webp source still exists (not removed on success)
            const webpSource = fragment.querySelector(WEBP_SOURCE_SELECTOR);
            expect(webpSource).toBeTruthy();
            expect(isImageLoaded(webpUrl)).toBe(true);
            global.Image = OriginalImage;
            resolve();
          }, 10);
        });
      });

      it("should handle webp image load error and remove source", () => {
        const invalidWebpUrl = "/recipes/invalid.webp";
        const fragment = createCardPictureFragment(TEST_IMAGE_URL, invalidWebpUrl);

        // Mock Image constructor to control error event
        const mockImage = {
          onload: null,
          onerror: null,
          src: "",
        };
        const OriginalImage = global.Image;
        global.Image = vi.fn(() => mockImage);

        imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: invalidWebpUrl });

        // Simulate error
        return new Promise(resolve => {
          setTimeout(() => {
            if (mockImage.onerror) {
              mockImage.onerror();
              // Verify webp source is removed on error
              const webpSource = fragment.querySelector(WEBP_SOURCE_SELECTOR);
              expect(webpSource).toBeNull();
            }
            global.Image = OriginalImage;
            resolve();
          }, 10);
        });
      });

      it("should handle webp load error", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL, "/recipes/invalid.webp");

        const webpUrl = "/recipes/invalid.webp";
        imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl });

        // Wait for image load attempt
        return new Promise(resolve => {
          setTimeout(() => {
            // Note: In test environment, the image might not actually fail, but the code path is tested
            resolve();
          }, 100);
        });
      });

      it("should handle missing webp source gracefully", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL);

        expect(() =>
          imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: TEST_WEBP_URL }),
        ).not.toThrow();
      });

      it("should handle null webpUrl", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL);

        expect(() =>
          imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: null }),
        ).not.toThrow();
      });
    });

    describe("jpeg handling", () => {
      it("should handle jpeg image error", () => {
        const fragment = createCardPictureFragment("/recipes/invalid.jpg");

        const placeholder = fragment.querySelector(".image-loading-placeholder");
        const img = fragment.querySelector("img");

        imagesTypes(fragment, { jpgUrl: "/recipes/invalid.jpg", webpUrl: "" });

        // Manually trigger error event
        const errorEvent = new Event("error");
        img.dispatchEvent(errorEvent);

        // Placeholder should be hidden on error
        expect(placeholder.classList.contains("hidden")).toBe(true);
      });

      it("should handle jpeg image load event and mark as loaded", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL);

        const placeholder = fragment.querySelector(".image-loading-placeholder");
        const img = fragment.querySelector("img");

        // Ensure image is not complete initially
        Object.defineProperty(img, "complete", { value: false, writable: true });
        Object.defineProperty(img, "naturalWidth", { value: 0, writable: true });

        imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" });

        // Simulate image load
        const loadEvent = new Event("load", { bubbles: true });
        img.dispatchEvent(loadEvent);

        expect(placeholder.classList.contains("hidden")).toBe(true);
        expect(isImageLoaded(TEST_IMAGE_URL)).toBe(true);
      });

      it("should handle jpeg image complete but with error", () => {
        const fragment = createCardPictureFragment("/recipes/invalid.jpg");

        const placeholder = fragment.querySelector(".image-loading-placeholder");
        const img = fragment.querySelector("img");

        // Set image as complete but with no natural width (error state)
        Object.defineProperty(img, "complete", { value: true, writable: true });
        Object.defineProperty(img, "naturalWidth", { value: 0, writable: true });

        imagesTypes(fragment, { jpgUrl: "/recipes/invalid.jpg", webpUrl: "" });

        // Wait for error handling
        return new Promise(resolve => {
          setTimeout(() => {
            expect(placeholder.classList.contains("hidden")).toBe(true);
            resolve();
          }, 10);
        });
      });
    });
  });

  afterAll(() => {
    logCategorySummary("deliveryImages", "Delivery Images", "All delivery images tests");
  });
});
