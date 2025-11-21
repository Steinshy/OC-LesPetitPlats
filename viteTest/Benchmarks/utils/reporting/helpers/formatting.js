// Formatting helper functions for HTML reports
import numeral from "numeral";
import { format } from "date-fns";

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

