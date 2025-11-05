import { describe, it, expect } from "vitest";
import { pickRandomRecipeImage } from "../src/utils/deliveryImages.js";

describe("deliveryImages", () => {
  const mockRecipesWithImages = [
    {
      images: {
        jpgUrl: "/recipes/test1.jpg",
        webpUrl: "/recipes/test1.webp",
        alt: "Test Recipe 1",
      },
    },
    {
      images: {
        jpgUrl: "/recipes/test2.jpg",
        webpUrl: "/recipes/test2.webp",
        alt: "Test Recipe 2",
      },
    },
    {
      images: {
        jpgUrl: "/recipes/test3.jpg",
        webpUrl: "/recipes/test3.webp",
        alt: "Test Recipe 3",
      },
    },
  ];

  it("should return null for empty array", () => {
    const result = pickRandomRecipeImage([]);
    expect(result).toBeNull();
  });

  it("should return null for null input", () => {
    const result = pickRandomRecipeImage(null);
    expect(result).toBeNull();
  });

  it("should return null for undefined input", () => {
    const result = pickRandomRecipeImage(undefined);
    expect(result).toBeNull();
  });

  it("should return an images object from recipes", () => {
    const result = pickRandomRecipeImage(mockRecipesWithImages);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("jpgUrl");
    expect(result).toHaveProperty("webpUrl");
    expect(result).toHaveProperty("alt");
    expect(mockRecipesWithImages.some(recipe => recipe.images === result)).toBe(true);
  });

  it("should return null when recipe has no images property", () => {
    const recipesWithoutImages = [{ name: "Recipe 1" }, { name: "Recipe 2" }];

    const result = pickRandomRecipeImage(recipesWithoutImages);
    expect(result).toBeNull();
  });

  it("should return null when recipe has null images", () => {
    const recipesWithNullImages = [{ images: null }, { images: null }];

    const result = pickRandomRecipeImage(recipesWithNullImages);
    expect(result).toBeNull();
  });

  it("should return images from single recipe", () => {
    const singleRecipe = [mockRecipesWithImages[0]];
    const result = pickRandomRecipeImage(singleRecipe);

    expect(result).toEqual(mockRecipesWithImages[0].images);
  });
});
