export const baseUrl = import.meta.env.BASE_URL || "/";

export const dataUrl = `${baseUrl}api/data.json`;

export const imageUrl = url => `${baseUrl}recipes/${url}`;

const removeExtension = filename => filename?.replace(/\.[^./]+$/, "") || filename;

export const jpgUrl = url => `${imageUrl(removeExtension(url))}.jpg`;
export const webpUrl = url => `${imageUrl(removeExtension(url))}.webp`;

export const normalizeString = value =>
  String(value || "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const toFilterItem = raw => {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;

  const normalized = normalizeString(trimmed);

  const key = normalized.replace(/s\b/g, "");
  if (!key) return null;

  const label = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

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
