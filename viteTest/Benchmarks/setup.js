/**
 * Setup file for benchmark tests - clears previous results before running new tests
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { clearResults } from "./utils/data/dataCollector.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const benchmarkDir = join(__dirname, "../../../../Benchmark");
const clearFlagPath = join(benchmarkDir, ".benchmark-cleared");

// Atomic file creation ensures we only clear once, even with parallel test threads
try {
  try {
    mkdirSync(benchmarkDir, { recursive: true });
    writeFileSync(clearFlagPath, new Date().toISOString(), { flag: "wx" });
    clearResults();
    console.log("[Benchmark Setup] Cleared previous benchmark results");
  } catch (_flagError) {
    // Flag already exists - another thread already cleared
  }
} catch (error) {
  console.warn("[Benchmark Setup] Failed to clear results:", error.message);
}
