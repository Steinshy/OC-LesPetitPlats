import { describe, it, expect, vi, beforeEach } from "vitest";
import { cacheManager } from "../../src/utils/cache.js";
import { buildRecipesData } from "../../src/utils/recipesBuilder.js";

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
    ustensils: ["Spoon", "Bowl"],
    image: "recipes/test.jpg",
  };

  it("should build recipe with correct structure", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data
    const { recipes } = await buildRecipesData();

    expect(recipes).toHaveLength(1);
    expect(recipes[0]).toMatchObject({
      id: 1,
      name: "Test Recipe",
      description: "A test recipe",
      servings: 4,
      time: 30,
      appliance: "oven",
    });
  });

  it("should build ingredients correctly", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data
    const { recipes } = await buildRecipesData();

    expect(recipes[0].ingredients).toEqual([
      { name: "flour", quantity: 200, unitType: "g" },
      { name: "sugar", quantity: 100, unitType: "g" },
    ]);
  });

  it("should build images with webp and jpg urls", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data
    const { recipes } = await buildRecipesData();

    expect(recipes[0].image).toHaveProperty("jpgUrl");
    expect(recipes[0].image).toHaveProperty("webpUrl");
    expect(recipes[0].image.jpgUrl).toContain("recipes/test.jpg");
    expect(recipes[0].image.webpUrl).toContain("recipes/test.webp");
  });

  it("should build search string from name, ingredients, ustensils, and appliance", async () => {
    // Recipe with string ustensils
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

    // Built recipes data
    const { recipes } = await buildRecipesData();
    // Normalized search string
    const search = recipes[0].search.toLowerCase();

    expect(search).toContain("test recipe");
    expect(search).toContain("flour");
    expect(search).toContain("sugar");
    expect(search).toContain("spoon");
    expect(search).toContain("bowl");
    expect(search).toContain("oven");
  });

  it("should build ustensils array", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes data
    const { recipes } = await buildRecipesData();

    expect(recipes[0].ustensils).toEqual(expect.arrayContaining(["spoon", "bowl"]));
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

    // Built recipes data
    const { recipes } = await buildRecipesData();

    expect(recipes[0]).toMatchObject({
      id: 2,
      name: "Incomplete Recipe",
      description: "",
      servings: 0,
      time: 0,
      appliance: "",
      ingredients: [],
      ustensils: [],
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

    // Built recipes data
    const { recipes } = await buildRecipesData();

    expect(recipes).toEqual([]);
  });

  it("should handle network errors", async () => {
    cacheManager.clear();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    );

    await expect(buildRecipesData()).rejects.toThrow("Network error: 404");
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
        ustensils: ["Spoon", "Bowl"],
      },
      {
        ...mockRawRecipe,
        id: 2,
        ingredients: [
          { ingredient: "Flour", quantity: 300, unit: "g" },
          { ingredient: "Butter", quantity: 100, unit: "g" },
        ],
        appliance: "Oven",
        ustensils: ["Spoon", "Fork"],
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(multipleRecipes),
      }),
    );

    // Built recipes data
    const { dropdownData } = await buildRecipesData();

    expect(dropdownData.ingredients).toEqual(expect.arrayContaining(["butter", "flour", "sugar"]));
    expect(dropdownData.appliances).toEqual(["oven"]);
    expect(dropdownData.ustensils).toEqual(expect.arrayContaining(["bowl", "fork", "spoon"]));
    expect(dropdownData.ingredients.length).toBe(3);
    expect(dropdownData.appliances.length).toBe(1);
  });
});
