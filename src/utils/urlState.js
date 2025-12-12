// src/utils/urlState.js

import queryString from "query-string";

export const parseURLState = () => {
  const parsed = queryString.parse(window.location.search, {
    arrayFormat: "comma",
  });

  const parseSet = key => {
    const value = parsed[key];
    if (!value) return new Set();
    if (Array.isArray(value)) {
      return new Set(value.filter(Boolean));
    }
    return new Set([value].filter(Boolean));
  };

  return {
    search: parsed.search || "",
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
    if (typeof value === "string" && value) {
      params[key] = value;
    } else if (value instanceof Set && value.size > 0) {
      params[key] = [...value];
    }
  });

  const query = queryString.stringify(params, { arrayFormat: "comma" });
  const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

  window.history.pushState({ filters: state }, "", newUrl);
};

export const clearURLState = () => {
  window.history.pushState({}, "", window.location.pathname);
};
