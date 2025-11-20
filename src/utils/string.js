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

export const updateCounter = count => {
  const counter = document.getElementById("results-counter");
  if (!counter) return;
  counter.innerHTML = `${count} ${count === 1 ? "résultat" : "résultats"}`;
};

export const cleanupDuplicatedItems = (items = []) => {
  const seen = new Set();
  const result = [];

  for (const raw of items) {
    const trimmedRaw = String(raw)?.trim();
    if (!trimmedRaw) continue;

    // Key for cleanup
    const normalized = normalizeString(trimmedRaw);
    const key = normalized.replace(/s\b/g, "");
    if (!key || seen.has(key)) continue;

    seen.add(key);

    // Front-end user-friendly label
    const label = trimmedRaw.charAt(0).toUpperCase() + trimmedRaw.slice(1);
    result.push(label);
  }

  // Sort in a user-friendly manner
  return result.sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
};
