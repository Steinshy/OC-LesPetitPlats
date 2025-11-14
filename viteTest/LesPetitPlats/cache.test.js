import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  cacheManager,
  cacheGet,
  cacheSet,
  cacheHas,
  cacheDel,
  cacheGetOrSet,
} from "../../src/utils/cache.js";

describe("cacheManager", () => {
  beforeEach(() => {
    cacheManager.clear();
  });

  it("should set and get values from cache", () => {
    // Cache key
    const key = "testKey";
    // Cache value
    const value = { data: "test value" };

    cacheManager.set(key, value);
    // Cached value
    const cached = cacheManager.get(key);

    expect(cached).toEqual(value);
  });

  it("should return undefined for non-existent keys", () => {
    // Result for non-existent key
    const result = cacheManager.get("nonExistentKey");
    expect(result).toBeUndefined();
  });

  it("should check if key exists in cache", () => {
    // Cache key
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

  it("should delete cache entry", () => {
    cacheManager.set("key1", "value1");
    expect(cacheManager.has("key1")).toBe(true);

    cacheDel("key1");

    expect(cacheManager.has("key1")).toBe(false);
  });

  it("should handle TTL of 0 (no expiration)", () => {
    cacheSet("key1", "value1", 0);
    const result = cacheGet("key1");
    expect(result).toBe("value1");
  });

  it("should handle negative TTL (no expiration)", () => {
    cacheSet("key1", "value1", -100);
    const result = cacheGet("key1");
    expect(result).toBe("value1");
  });

  it("should return undefined for expired cache entry", () => {
    // Set cache with very short TTL (1ms)
    cacheSet("key1", "value1", 1);

    // Wait for expiration
    return new Promise(resolve => {
      setTimeout(() => {
        const result = cacheGet("key1");
        expect(result).toBeUndefined();
        expect(cacheHas("key1")).toBe(false);
        resolve();
      }, 10);
    });
  });

  it("should get or set cache value with async fetcher", async () => {
    // Async fetcher function
    const fetcher = vi.fn(async () => "fetched value");

    // First call should fetch
    const result1 = await cacheGetOrSet("key1", fetcher);
    expect(result1).toBe("fetched value");
    expect(fetcher).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const result2 = await cacheGetOrSet("key1", fetcher);
    expect(result2).toBe("fetched value");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("should use custom TTL for cacheGetOrSet", async () => {
    cacheManager.clear();
    // Async fetcher function
    const fetcher = vi.fn(async () => "fetched value");

    await cacheGetOrSet("key1", fetcher, 0);
    const result = cacheGet("key1");
    expect(result).toBe("fetched value");
  });
});
