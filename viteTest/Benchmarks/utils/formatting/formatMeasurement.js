// Formatting utilities for measurement data

export function formatTime(timeMs) {
  if (timeMs < 0.001) {
    // Convert to nanoseconds
    const ns = timeMs * 1_000_000;
    if (ns < 0.01) {
      return `${ns.toFixed(4)} ns`;
    }
    return `${ns.toFixed(2)} ns`;
  }
  if (timeMs < 1) {
    return `${(timeMs * 1000).toFixed(2)} µs`;
  }
  if (timeMs < 1000) {
    return `${timeMs.toFixed(2)} ms`;
  }
  return `${(timeMs / 1000).toFixed(2)} s`;
}

export function formatMemory(memoryMB) {
  if (Math.abs(memoryMB) < 0.001) {
    return "~0 MB";
  }
  return `${memoryMB >= 0 ? "+" : ""}${memoryMB.toFixed(3)} MB`;
}
