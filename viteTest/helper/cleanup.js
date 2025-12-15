// General cleanup utilities for viteTest output directories
import { rmSync, existsSync } from "node:fs";
import { logSuccess, logWarning } from "./message.js";
import { getUnitCoverageDir, getJsbenDir, getBenchmarkDir } from "./paths.js";

function cleanDirectory(dirPath, dirName = "directory") {
  try {
    if (existsSync(dirPath)) {
      rmSync(dirPath, { recursive: true, force: true });
      logSuccess(`Cleaned: ${dirName}`, "✓");
      return true;
    }
    return true; // Already clean
  } catch (error) {
    logWarning(`Failed to clean ${dirName}: ${error.message}`);
    return false;
  }
}

export function cleanUnit() {
  return cleanDirectory(getUnitCoverageDir(), "Unit test coverage");
}

export function cleanJsben() {
  return cleanDirectory(getJsbenDir(), "Jsben benchmarks");
}

export function cleanBenchmarks() {
  return cleanDirectory(getBenchmarkDir(), "Benchmarks");
}

export function cleanAll() {
  logSuccess("Cleaning all viteTest output directories...", "🧹");
  cleanUnit();
  cleanJsben();
  cleanBenchmarks();
}

