import { afterAll, describe, it, expect, beforeEach, vi } from "vitest";
import { cacheManager } from "@/utils/cache.js";
import { fetchRecipes } from "@/utils/recipeApi.js";
import { logCategorySummary } from "../logging/console.js";

describe("recipeApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheManager.clear();
    global.fetch = vi.fn();
  });

  const mockRecipes = [
    {
      id: 1,
      name: "Test Recipe",
      description: "A test recipe",
      ingredients: [{ ingredient: "Tomato", quantity: 2 }],
    },
    {
      id: 2,
      name: "Another Recipe",
      description: "Another test recipe",
      ingredients: [{ ingredient: "Potato", quantity: 3 }],
    },
  ];

  it("should fetch recipes from API", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipes,
    });

    const result = await fetchRecipes();

    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual(mockRecipes);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("api/data.json"));
  });

  it("should cache recipes after first fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipes,
    });

    // First fetch
    const result1 = await fetchRecipes();
    expect(result1.isOk()).toBe(true);
    expect(result1.value).toEqual(mockRecipes);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second fetch should use cache - cache returns the value directly, not the Result
    const result2 = await fetchRecipes();
    // When cached, cacheGetOrSet returns the cached value (array), not the Result object
    expect(Array.isArray(result2)).toBe(true);
    expect(result2).toEqual(mockRecipes);
    expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1, not 2
  });

  it("should return empty array when response is not an array", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notAnArray: true }),
    });

    const result = await fetchRecipes();
    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual([]);
  });

  it("should return empty array when response is null", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    const result = await fetchRecipes();
    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual([]);
  });

  it("should return error on network failure", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await fetchRecipes();
    expect(result.isErr()).toBe(true);
    expect(result.error.message).toBe("Network error: 404");
  });

  it("should return error on fetch rejection", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchRecipes();
    expect(result.isErr()).toBe(true);
    expect(result.error.message).toBe("Network error");
  });

  it("should use cache key 'recipes_v1'", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipes,
    });

    await fetchRecipes();

    // Check that cache has the recipes
    expect(cacheManager.has("recipes_v1")).toBe(true);
    const cached = cacheManager.get("recipes_v1");
    expect(cached).toEqual(mockRecipes);
  });

  it("should handle empty array response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await fetchRecipes();
    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual([]);
  });

  afterAll(() => {
    logCategorySummary("recipeApi", "Recipe API", "All recipe API tests");
  });
});
