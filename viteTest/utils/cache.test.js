import { describe, it, expect, beforeEach } from "vitest";

import { cacheManager } from "../../src/utils/cache.js";

describe("cacheManager", () => {
  beforeEach(() => {
    cacheManager.clear();
  });

  it("should set and get values from cache", () => {
    const key = "testKey";
    const value = { data: "test value" };

    cacheManager.set(key, value);
    const cached = cacheManager.get(key);

    expect(cached).toEqual(value);
  });

  it("should return undefined for non-existent keys", () => {
    const result = cacheManager.get("nonExistentKey");
    expect(result).toBeUndefined();
  });

  it("should check if key exists in cache", () => {
    const key = "existingKey";
    cacheManager.set(key, "some value");

    expect(cacheManager.has(key)).toBe(true);
    expect(cacheManager.has("nonExistentKey")).toBe(false);
  });

  it("should clear all cache entries", () => {
    cacheManager.set("key1", "value1");
    cacheManager.set("key2", "value2");

    cacheManager.clear();

    expect(cacheManager.has("key1")).toBe(false);
    expect(cacheManager.has("key2")).toBe(false);
  });
});
