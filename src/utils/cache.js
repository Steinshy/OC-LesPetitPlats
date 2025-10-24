import { LRUCache } from "lru-cache";

// Central application cache
export const appCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export function cacheGet(key) {
  return appCache.get(key);
}

export function cacheSet(key, value, ttlMs) {
  if (typeof ttlMs === "number") {
    appCache.set(key, value, { ttl: ttlMs });
  } else {
    appCache.set(key, value);
  }
}

export function cacheHas(key) {
  return appCache.has(key);
}

export function cacheDel(key) {
  appCache.delete(key);
}

export async function cacheGetOrSet(key, fetcher, ttlMs) {
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;
  const value = await fetcher();
  cacheSet(key, value, ttlMs);
  return value;
}
