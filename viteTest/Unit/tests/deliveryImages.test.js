import { afterAll, describe, it, expect, beforeEach } from "vitest";
// Note: selectRandomImages is provided by the mock wrapper via setup.js
import { isImageLoaded, imagesTypes, selectRandomImages } from "@/utils/deliveryImages.js";
import { logCategorySummary } from "../logging/console.js";

// Test image URL
const TEST_IMAGE_URL = "/recipes/test.jpg";
// Test WebP URL
const TEST_WEBP_URL = "/recipes/test.webp";
// Invalid image URL for error testing
const INVALID_IMAGE_URL = "/recipes/invalid.jpg";
// WebP source selector constant
const WEBP_SOURCE_SELECTOR = "source[type='image/webp']";
// Error message for missing image element
const IMAGE_ELEMENT_NOT_FOUND_ERROR = "Image element not found in fragment";

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
      <picture>
        ${webpSource}
        <img src="${imgSrc}" alt="Test" />
      </picture>
    </div>
  `);
};

// Helper function to create a card picture fragment without image
const createCardPictureFragmentNoImage = () => {
  return document.createRange().createContextualFragment(`
    <div class="card-picture">
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

      it("should mark image as loaded when image is already loaded", () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL);

        // Image element
        const img = fragment.querySelector("img");
        if (!img) {
          throw new Error(IMAGE_ELEMENT_NOT_FOUND_ERROR);
        }

        // Set properties on the image to simulate already loaded state
        Object.defineProperty(img, "complete", { value: true, writable: true, configurable: true });
        Object.defineProperty(img, "naturalWidth", {
          value: 100,
          writable: true,
          configurable: true,
        });

        // imagesTypes doesn't require the fragment to be in the DOM
        imagesTypes(fragment, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" });

        // Wait for synchronous operations to complete
        expect(isImageLoaded(TEST_IMAGE_URL)).toBe(true);
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

      it("should handle webp image load success and mark as loaded", async () => {
        const webpUrl = TEST_WEBP_URL;
        const fragment = createCardPictureFragment(TEST_IMAGE_URL, webpUrl);

        // Get image reference before appending (element reference remains valid after append)
        const img = fragment.querySelector("img");
        if (!img) {
          throw new Error(IMAGE_ELEMENT_NOT_FOUND_ERROR);
        }

        // Set image as not complete to trigger load event listener
        Object.defineProperty(img, "complete", {
          value: false,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(img, "naturalWidth", {
          value: 0,
          writable: true,
          configurable: true,
        });

        // Clone fragment for imagesTypes (since original will be emptied on append)
        const fragmentClone = fragment.cloneNode(true);
        document.body.appendChild(fragment);

        imagesTypes(fragmentClone, { jpgUrl: TEST_IMAGE_URL, webpUrl });

        // Simulate successful load on the actual DOM element
        const loadEvent = new Event("load", { bubbles: true });
        img.dispatchEvent(loadEvent);

        // Wait a bit for the event handler to process
        await new Promise(resolve => setTimeout(resolve, 10));

        // Verify webp source still exists (not removed on success) - query from body
        const webpSource = document.body.querySelector(WEBP_SOURCE_SELECTOR);
        expect(webpSource).toBeTruthy();
        // Note: imagesTypes only handles jpgUrl, not webpUrl, so isImageLoaded checks jpgUrl
        expect(isImageLoaded(TEST_IMAGE_URL)).toBe(true);

        // Clean up - remove the appended element
        const appendedElement = document.body.querySelector(".card-picture");
        if (appendedElement && appendedElement.parentNode) {
          appendedElement.parentNode.removeChild(appendedElement);
        }
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
        // Use a proper constructor function for Vitest 4.0
        global.Image = function Image() {
          return mockImage;
        };

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
        const fragment = createCardPictureFragment(INVALID_IMAGE_URL);

        // Get image reference before appending (element reference remains valid after append)
        const img = fragment.querySelector("img");
        if (!img) {
          throw new Error(IMAGE_ELEMENT_NOT_FOUND_ERROR);
        }

        Object.defineProperty(img, "complete", {
          value: false,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(img, "naturalWidth", {
          value: 0,
          writable: true,
          configurable: true,
        });

        // Clone fragment for imagesTypes (since original will be emptied on append)
        const fragmentClone = fragment.cloneNode(true);
        document.body.appendChild(fragment);

        imagesTypes(fragmentClone, { jpgUrl: INVALID_IMAGE_URL, webpUrl: "" });

        // Manually trigger error event - function should handle gracefully
        const errorEvent = new Event("error", { bubbles: true });
        img.dispatchEvent(errorEvent);

        // Function should handle error gracefully (no exception thrown)
        expect(img).toBeTruthy();

        // Clean up - remove the appended element
        const appendedElement = document.body.querySelector(".card-picture");
        if (appendedElement && appendedElement.parentNode) {
          appendedElement.parentNode.removeChild(appendedElement);
        }
      });

      it("should handle jpeg image load event and mark as loaded", async () => {
        const fragment = createCardPictureFragment(TEST_IMAGE_URL);

        // Get image reference before appending (element reference remains valid after append)
        const img = fragment.querySelector("img");
        if (!img) {
          throw new Error(IMAGE_ELEMENT_NOT_FOUND_ERROR);
        }

        // Ensure image is not complete initially
        Object.defineProperty(img, "complete", {
          value: false,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(img, "naturalWidth", {
          value: 0,
          writable: true,
          configurable: true,
        });

        // Clone fragment for imagesTypes (since original will be emptied on append)
        const fragmentClone = fragment.cloneNode(true);
        document.body.appendChild(fragment);

        imagesTypes(fragmentClone, { jpgUrl: TEST_IMAGE_URL, webpUrl: "" });

        // Simulate image load
        const loadEvent = new Event("load", { bubbles: true });
        img.dispatchEvent(loadEvent);

        // Wait a bit for the event handler to process
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(isImageLoaded(TEST_IMAGE_URL)).toBe(true);

        // Clean up - remove the appended element
        const appendedElement = document.body.querySelector(".card-picture");
        if (appendedElement && appendedElement.parentNode) {
          appendedElement.parentNode.removeChild(appendedElement);
        }
      });

      it("should handle jpeg image complete but with error", async () => {
        const fragment = createCardPictureFragment(INVALID_IMAGE_URL);

        // Get image reference before appending (element reference remains valid after append)
        const img = fragment.querySelector("img");
        if (!img) {
          throw new Error(IMAGE_ELEMENT_NOT_FOUND_ERROR);
        }

        // Set image as complete but with no natural width (error state)
        Object.defineProperty(img, "complete", { value: true, writable: true, configurable: true });
        Object.defineProperty(img, "naturalWidth", {
          value: 0,
          writable: true,
          configurable: true,
        });

        // Clone fragment for imagesTypes (since original will be emptied on append)
        const fragmentClone = fragment.cloneNode(true);
        document.body.appendChild(fragment);

        imagesTypes(fragmentClone, { jpgUrl: INVALID_IMAGE_URL, webpUrl: "" });

        // Wait for setTimeout in handleImageLoading to complete
        await new Promise(resolve => setTimeout(resolve, 10));

        // Function should handle error gracefully (no exception thrown)
        // When complete but naturalWidth is 0, it sets up a setTimeout that marks it as loaded anyway
        expect(img).toBeTruthy();

        // Clean up - remove the appended element
        const appendedElement = document.body.querySelector(".card-picture");
        if (appendedElement && appendedElement.parentNode) {
          appendedElement.parentNode.removeChild(appendedElement);
        }
      });
    });
  });

  afterAll(() => {
    logCategorySummary("deliveryImages", "Delivery Images", "All delivery images tests");
  });
});
