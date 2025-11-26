// Formatting utilities for measurement data
import numeral from "numeral";

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

export function formatTime(timeMs) {
  if (timeMs < NS_THRESHOLD) {
    const ns = timeMs * NS_MULTIPLIER;
    const precision = ns < NS_PRECISION_THRESHOLD ? 4 : 2;
    return `${numeral(ns).format(`0.${"0".repeat(precision)}`)} ns`;
  }
  if (timeMs < US_THRESHOLD) {
    return `${numeral(timeMs * US_MULTIPLIER).format("0.00")} µs`;
  }
  if (timeMs < MS_THRESHOLD) {
    return `${numeral(timeMs).format("0.00")} ms`;
  }
  return `${numeral(timeMs / S_DIVISOR).format("0.00")} s`;
}

export function formatMemory(memoryMB) {
  if (Math.abs(memoryMB) < MEMORY_THRESHOLD) {
    return "~0 MB";
  }
  const sign = memoryMB >= 0 ? "+" : "";
  return `${sign}${numeral(memoryMB).format("0.000")} MB`;
}
