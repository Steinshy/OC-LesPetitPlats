// Formatting helper functions for HTML reports
import { format } from "date-fns";
import numeral from "numeral";

// Helper to ensure a value is a safe number, converting invalid to 0
export function getSafeNumber(value) {
  const num = Number(value);
  return typeof num === "number" && !isNaN(num) && isFinite(num) ? num : 0;
}

// Format time value in a friendly way
export function formatFriendlyTime(timeValue, includeUnit = true) {
  // Check for NaN or invalid values
  if (typeof timeValue !== "number" || isNaN(timeValue) || !isFinite(timeValue)) {
    return "N/A";
  }

  // For very small values (essentially zero), show friendly message
  if (timeValue < 0.0001) {
    return includeUnit ? "< 0.0001ms" : "< 0.0001";
  }

  // Format normally for other values
  const formatted = numeral(timeValue).format("0.0000");
  return includeUnit ? `${formatted}ms` : formatted;
}

// Format date in a friendly way using date-fns
export function formatFriendlyDate(timestamp) {
  if (!timestamp) {
    timestamp = new Date().toISOString();
  }

  const date = new Date(timestamp);

  // Use date-fns for primary formatting
  const dateFnsFormatted = format(date, "MMMM d, yyyy 'at' h:mm a");

  return dateFnsFormatted;
}

// Add to helpers/formatting.js
export function getShortLabel(impl, maxLength = 20) {
  if (impl.includes("Production") || impl.includes("forEach")) return "Production";
  if (impl.includes("Maps") || impl.includes("map/filter")) return "Maps";
  return impl.length > maxLength ? `${impl.substring(0, maxLength)}...` : impl;
}
