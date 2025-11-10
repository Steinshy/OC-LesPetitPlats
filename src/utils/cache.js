import { lru } from "tiny-lru";

const MAX_ITEMS = 500;
const DEFAULT_TTL_MS = 1000 * 60 * 5; // 5 minutes
const NO_EXPIRATION = null;

const appCache = lru(MAX_ITEMS);

const computeExpiry = ttlMs => {
  if (typeof ttlMs === "number" && Number.isFinite(ttlMs)) {
    return ttlMs > 0 ? Date.now() + ttlMs : NO_EXPIRATION;
  }
  return Date.now() + DEFAULT_TTL_MS;
};

const buildRecord = (value, ttlMs) => ({
  value,
  expiresAt: computeExpiry(ttlMs),
});

const getRecord = key => {
  const record = appCache.get(key);
  if (!record) return undefined;
  if (record.expiresAt !== NO_EXPIRATION && record.expiresAt <= Date.now()) {
    appCache.delete(key);
    return undefined;
  }
  return record;
};

export function cacheGet(key) {
  const record = getRecord(key);
  return record ? record.value : undefined;
}

export function cacheSet(key, value, ttlMs) {
  appCache.set(key, buildRecord(value, ttlMs));
}

export function cacheHas(key) {
  return getRecord(key) !== undefined;
}

export function cacheDel(key) {
  appCache.delete(key);
}

export async function cacheGetOrSet(key, fetcher, ttlMs) {
  const cachedValue = cacheGet(key);
  if (cachedValue !== undefined) return cachedValue;
  const value = await fetcher();
  cacheSet(key, value, ttlMs);
  return value;
}

export const cacheManager = {
  get: cacheGet,
  set: cacheSet,
  has: cacheHas,
  clear: () => appCache.clear(),
  delete: cacheDel,
};

export { appCache };
