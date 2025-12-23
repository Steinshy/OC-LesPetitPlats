// src/utils/urlState.js

import queryString from "query-string";
import { normalizeString } from "@utils/normalize.js";

const sanitizeForURL = value => {
  if (!value || typeof value !== "string") return "";
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

const desanitizeFromURL = value => {
  if (!value || typeof value !== "string") return "";
  const withSpaces = value.replace(/-/g, " ");
  return normalizeString(withSpaces);
};

export const parseURLState = () => {
  const parsed = queryString.parse(window.location.search, {
    arrayFormat: "comma",
    decode: true,
  });

  const parseSet = key => {
    const value = parsed[key];
    if (!value) return new Set();

    const values = Array.isArray(value) ? value : [value];
    const normalized = values
      .filter(Boolean)
      .map(v => {
        const str = String(v).trim();
        if (!str) return null;
        return desanitizeFromURL(str);
      })
      .filter(Boolean);

    return new Set(normalized);
  };

  const searchValue = parsed.search ? desanitizeFromURL(String(parsed.search).trim()) : "";

  return {
    search: searchValue,
    ingredients: parseSet("ingredients"),
    appliances: parseSet("appliances"),
    utensils: parseSet("utensils"),
  };
};

export const updateURLState = state => {
  const params = {};
  const keys = ["search", "ingredients", "appliances", "utensils"];

  keys.forEach(key => {
    const value = state[key];
    if (typeof value === "string" && value.trim()) {
      params[key] = sanitizeForURL(value);
    } else if (
      value &&
      typeof value[Symbol.iterator] === "function" &&
      !(typeof value === "string") &&
      value.size > 0
    ) {
      const sanitized = Array.from(value, v => sanitizeForURL(v)).filter(Boolean);
      if (sanitized.length > 0) {
        params[key] = sanitized;
      }
    }
  });

  const query = queryString.stringify(params, {
    arrayFormat: "comma",
    encode: true,
    sort: false,
  });

  const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

  window.history.pushState({ filters: state }, "", newUrl);
};

export const clearURLState = () => {
  window.history.pushState({}, "", window.location.pathname);
};
