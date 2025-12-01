// src/utils/normalize.js

// Remove accents, parentheses, lowercase
export const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

// Clean display label: remove parenthetical content and normalize casing
const cleanLabel = raw => {
  const cleaned = String(raw ?? "")
    .replace(/\s*\([^)]*\)/g, "") // Remove (6), (ou blanc), etc.
    .trim();

  if (!cleaned) return "";

  // Capitalize first letter, lowercase the rest for consistency
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};

// Convert raw value to filter item
export const toFilterItem = raw => {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;

  const normalized = normalizeString(trimmed);
  const label = cleanLabel(trimmed);

  if (!label) return null;

  // Remove trailing 's' for deduplication key
  const key = normalized.replace(/s\b/g, "");
  if (!key) return null;

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
