import { describe, it, expect, vi, beforeEach } from "vitest";
import { cacheManager } from "../../../src/utils/cache.js";
import { buildRecipesData } from "../../../src/utils/recipesBuilder.js";

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
    ustensils: [{ name: "Spoon" }, { name: "Bowl" }],
    image: "recipes/test.jpg",
  };

  it("should build recipe with correct structure", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes array
    const recipes = await buildRecipesData();

    expect(recipes).toHaveLength(1);
    expect(recipes[0]).toMatchObject({
      id: 1,
      name: "Test Recipe",
      description: "A test recipe",
      servings: 4,
      time: 30,
      appliance: "Oven",
    });
  });

  it("should build ingredients correctly", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes array
    const recipes = await buildRecipesData();

    expect(recipes[0].ingredients).toEqual([
      { name: "Flour", quantity: 200, unitType: "g" },
      { name: "Sugar", quantity: 100, unitType: "g" },
    ]);
  });

  it("should build images with webp and jpg urls", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockRawRecipe]),
      }),
    );

    // Built recipes array
    const recipes = await buildRecipesData();

    expect(recipes[0].images).toHaveProperty("jpgUrl");
    expect(recipes[0].images).toHaveProperty("webpUrl");
    expect(recipes[0].images.jpgUrl).toContain("recipes/test.jpg");
    expect(recipes[0].images.webpUrl).toContain("recipes/test.webp");
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

    // Built recipes array
    const recipes = await buildRecipesData();
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

    // Built recipes array
    const recipes = await buildRecipesData();

    expect(recipes[0].ustensils).toEqual(["Spoon", "Bowl"]);
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

    // Built recipes array
    const recipes = await buildRecipesData();

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

    // Built recipes array
    const recipes = await buildRecipesData();

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
});
