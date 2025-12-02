import { format } from "date-fns";
import numeral from "numeral";

export function getSafeNumber(value) {
  const num = Number(value);
  return typeof num === "number" && !isNaN(num) && isFinite(num) ? num : 0;
}

export function formatFriendlyTime(timeValue, includeUnit = true) {
  if (typeof timeValue !== "number" || isNaN(timeValue) || !isFinite(timeValue)) {
    return "N/A";
  }

  // Very fast operations - below measurable precision
  if (timeValue < 0.0001) {
    return includeUnit ? "Very fast (< 0.0001ms)" : "< 0.0001";
  }

  // Fast operations - show with 4 decimal precision
  if (timeValue < 0.01) {
    const formatted = numeral(timeValue).format("0.0000");
    return includeUnit ? `${formatted}ms` : formatted;
  }

  // Normal operations - show with 2 decimal precision
  if (timeValue < 1) {
    const formatted = numeral(timeValue).format("0.00");
    return includeUnit ? `${formatted}ms` : formatted;
  }

  // Slower operations - show with 1 decimal precision
  const formatted = numeral(timeValue).format("0.0");
  return includeUnit ? `${formatted}ms` : formatted;
}

export function formatFriendlyDate(timestamp) {
  const date = new Date(timestamp || new Date().toISOString());
  return format(date, "MMMM d, yyyy 'at' h:mm a");
}

export function getShortLabel(impl, maxLength = 20) {
  const lower = impl.toLowerCase();
  if (lower.includes("production")) return capitalize("production");
  if (lower.includes("foreach")) return capitalize("forEach");
  const label = impl.length > maxLength ? `${impl.substring(0, maxLength)}...` : impl;
  return capitalize(label);
}

export function capitalize(str) {
  if (!str || str === "N/A") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
