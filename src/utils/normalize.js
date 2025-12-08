export const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const singularize = normalized => {
  const value = String(normalized || "").trim();
  if (!value) return "";
  if (value.length <= 3) return value;
  if (value.endsWith("s")) return value.slice(0, -1);
  return value;
};

const cleanLabel = raw => {
  const cleaned = String(raw ?? "")
    .replace(/\s*\([^)]*\)/g, "")
    .trim();

  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};

export const toFilterItem = raw => {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;

  const normalized = normalizeString(trimmed);
  const label = cleanLabel(trimmed);

  if (!label) return null;

  const key = singularize(normalized);
  if (!key) return null;

  return { label, value: normalized, key };
};

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
