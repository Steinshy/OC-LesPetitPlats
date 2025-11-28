// src/utils/string.js

export const baseUrl = import.meta.env.BASE_URL || "/";

// Remove accents, parentheses, lowercase
export const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

// Convert raw value to filter item
export const toFilterItem = raw => {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;

  const normalized = normalizeString(trimmed);

  // Remove trailing 's' for deduplication key
  const key = normalized.replace(/s\b/g, "");
  if (!key) return null;

  const label = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

  return { label, value: normalized, key };
};

// Deduplicate and sort filter items
export const cleanupDuplicatedItems = (items = []) => {
  const seen = new Set();
  const result = [];

  for (const raw of items) {
    const item = toFilterItem(raw);
    if (!item) continue;
    if (seen.has(item.key)) continue;

    seen.add(item.key);
    result.push({ label: item.label, value: item.value });
  }

  return result.sort((a, b) => a.label.localeCompare(b.label, "fr", { sensitivity: "base" }));
};

// Check mobile via CSS detector
export const isMobile = () => {
  const detector = document.querySelector(".mobile-detector");
  return detector ? window.getComputedStyle(detector).display !== "none" : false;
};
