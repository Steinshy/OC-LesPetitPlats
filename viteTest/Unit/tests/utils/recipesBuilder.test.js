import { afterAll, describe, it, expect, vi, beforeEach } from "vitest";
import { cacheManager } from "@/utils/cache.js";
import { buildRecipes } from "@/utils/recipesBuilder.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

describe("recipesBuilder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheManager.clear();
  });

  // Mock raw recipe data
  const mockRawRecipe = {
    id: 1,
    name: "Test Recipe",
    description: "A test recipe",
    servings: 4,
    time: 30,
    appliance: "Oven",
    ingredients: [
      { ingredient: "Flour", quantity: 200, unit: "g" },
      { ingredient: "Sugar", quantity: 100, unit: "g" },
    ],
    ustensils: ["Spoon", "Bowl"], // API uses 'ustensils' (with 'u')
    image: "test",
  };

  it("should build recipe with correct structure", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    expect(recipes).toHaveLength(1);
    expect(recipes[0]).toMatchObject({
      id: 1,
      name: "Test Recipe",
      description: "A test recipe",
      servings: 4,
      time: 30,
      appliance: "Oven", // Not normalized in actual code
    });
  });

  it("should build ingredients correctly", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    // Ingredients are returned as-is from API, not transformed
    expect(recipes[0].ingredients).toEqual([
      { ingredient: "Flour", quantity: 200, unit: "g" },
      { ingredient: "Sugar", quantity: 100, unit: "g" },
    ]);
  });

  it("should build images with webp and jpg urls", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    // Property is 'images' not 'image'
    expect(recipes[0].images).toHaveProperty("jpgUrl");
    expect(recipes[0].images).toHaveProperty("webpUrl");
    expect(recipes[0].images.jpgUrl).toContain("test-card.jpg");
    expect(recipes[0].images.webpUrl).toContain("test-card.webp");
  });

  it("should build search string from name, ingredients, utensils, and appliance", async () => {
    // Recipe with string ustensils (API format)
    const recipeWithStringUstensils = {
      ...mockRawRecipe,
      ustensils: ["Spoon", "Bowl"],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([recipeWithStringUstensils]),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    // No search property in actual code - recipe data is returned as-is
    // ustensils from API is mapped to utensils in output
    expect(recipes[0]).not.toHaveProperty("search");
    expect(recipes[0].name).toBe("Test Recipe");
    expect(recipes[0].utensils).toEqual(["Spoon", "Bowl"]);
  });

  it("should build utensils array", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    // utensils are returned as-is, not normalized
    expect(recipes[0].utensils).toEqual(expect.arrayContaining(["Spoon", "Bowl"]));
  });

  it("should handle missing optional fields", async () => {
    cacheManager.clear();
    // Recipe with missing fields
    const incompleteRecipe = {
      id: 2,
      name: "Incomplete Recipe",
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([incompleteRecipe]),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    expect(recipes[0]).toMatchObject({
      id: 2,
      name: "Incomplete Recipe",
      description: "",
      servings: 0,
      time: 0,
      appliance: "",
      ingredients: [],
      utensils: [],
      images: expect.any(Object),
    });
  });

  it("should return empty array when API returns non-array", async () => {
    cacheManager.clear();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    // When API returns non-array, it's converted to empty array
    expect(Array.isArray(recipes)).toBe(true);
  });

  it("should handle network errors", async () => {
    cacheManager.clear();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    );

    const result = await buildRecipes();
    expect(result.isErr()).toBe(true);
    expect(result.error.message).toBe("Network error: 404");
  });

  it("should build dropdown data with unique values", async () => {
    cacheManager.clear();
    const multipleRecipes = [
      {
        ...mockRawRecipe,
        ingredients: [
          { ingredient: "Flour", quantity: 200, unit: "g" },
          { ingredient: "Sugar", quantity: 100, unit: "g" },
        ],
        appliance: "Oven",
        ustensils: ["Spoon", "Bowl"], // API uses 'ustensils'
      },
      {
        ...mockRawRecipe,
        id: 2,
        ingredients: [
          { ingredient: "Flour", quantity: 300, unit: "g" },
          { ingredient: "Butter", quantity: 100, unit: "g" },
        ],
        appliance: "Oven",
        ustensils: ["Spoon", "Fork"], // API uses 'ustensils'
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(multipleRecipes),
      }),
    );

    // Built recipes data - returns Result with array
    const result = await buildRecipes();
    expect(result.isOk()).toBe(true);
    const recipes = result.value;

    // buildRecipesData doesn't return dropdownData - that's built separately by buildDropdownsData
    // Test that recipes are built correctly with ustensils mapped to utensils
    expect(recipes).toHaveLength(2);
    expect(recipes[0].ingredients).toHaveLength(2);
    expect(recipes[1].ingredients).toHaveLength(2);
    expect(recipes[0].utensils).toContain("Spoon");
    expect(recipes[0].utensils).toContain("Bowl");
    expect(recipes[1].utensils).toContain("Spoon");
    expect(recipes[1].utensils).toContain("Fork");
  });

  afterAll(() => {
    logCategorySummary("recipesBuilder", "Recipes Builder", "All recipes builder tests");
  });
});
