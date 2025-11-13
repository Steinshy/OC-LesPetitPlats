export const normalizeString = value =>
  String(value ?? "")
    .replace(/\s*\([^)]*\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const capitalizeFirstLetter = value => {
  const str = String(value ?? "").trim();
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
