// Formatting utilities for measurement data

// Time formatting constants
const NS_THRESHOLD = 0.001;
const NS_PRECISION_THRESHOLD = 0.01;
const US_THRESHOLD = 1;
const MS_THRESHOLD = 1000;
const NS_MULTIPLIER = 1_000_000;
const US_MULTIPLIER = 1000;
const S_DIVISOR = 1000;

// Memory formatting constants
const MEMORY_THRESHOLD = 0.001;
const MEMORY_PRECISION = 3;

export function formatTime(timeMs) {
  if (timeMs < NS_THRESHOLD) {
    const ns = timeMs * NS_MULTIPLIER;
    const precision = ns < NS_PRECISION_THRESHOLD ? 4 : 2;
    return `${ns.toFixed(precision)} ns`;
  }
  if (timeMs < US_THRESHOLD) {
    return `${(timeMs * US_MULTIPLIER).toFixed(2)} µs`;
  }
  if (timeMs < MS_THRESHOLD) {
    return `${timeMs.toFixed(2)} ms`;
  }
  return `${(timeMs / S_DIVISOR).toFixed(2)} s`;
}

export function formatMemory(memoryMB) {
  if (Math.abs(memoryMB) < MEMORY_THRESHOLD) {
    return "~0 MB";
  }
  const sign = memoryMB >= 0 ? "+" : "";
  return `${sign}${memoryMB.toFixed(MEMORY_PRECISION)} MB`;
}
