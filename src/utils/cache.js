import { lru } from "tiny-lru";

const MAX_ITEMS = 500;
const DEFAULT_TTL_MS = 1000 * 60 * 5;

export const appCache = lru(MAX_ITEMS);

const buildRecord = (value, ttlMs) => {
  const ttl = typeof ttlMs === "number" && ttlMs > 0 ? ttlMs : DEFAULT_TTL_MS;
  return { value, expiresAt: Date.now() + ttl };
};

const getRecord = key => {
  const record = appCache.get(key);
  if (!record) return undefined;
  if (record.expiresAt <= Date.now()) {
    appCache.delete(key);
    return undefined;
  }
  return record;
};

export const cacheGet = key => getRecord(key)?.value;

export const cacheSet = (key, value, ttlMs) => {
  appCache.set(key, buildRecord(value, ttlMs));
};

export const cacheHas = key => getRecord(key) !== undefined;

export const cacheDel = key => appCache.delete(key);

export const cacheGetOrSet = async (key, fetcher, ttlMs) => {
  const cached = cacheGet(key);
  if (cached !== undefined) {
    return cached;
  }
  const result = await fetcher();
  if (result && typeof result === "object" && "isOk" in result) {
    if (result.isOk()) {
      cacheSet(key, result.value, ttlMs);
    }
  } else {
    cacheSet(key, result, ttlMs);
  }
  return result;
};

export const cacheManager = {
  get: cacheGet,
  set: cacheSet,
  has: cacheHas,
  clear: () => appCache.clear(),
  delete: cacheDel,
};
