// Setup file for benchmark tests - clears previous results before running new tests
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { saveResults } from "@benchmarks-data/collector.js";

// Benchmark output directory (Benchmark folder at project root)
const benchmarkDir = join(process.cwd(), "Benchmark");
const clearFlagPath = join(benchmarkDir, ".benchmark-cleared");
const resultsFilePath = join(tmpdir(), "lespetitplats-benchmark", "benchmark-results.json");

// Atomic file creation ensures we only clear once, even with parallel test threads
// Check if flag exists first to avoid unnecessary file operations
if (!existsSync(clearFlagPath)) {
  try {
    mkdirSync(benchmarkDir, { recursive: true });
    // Atomic write: only one thread will succeed, others will get EEXIST error
    try {
      writeFileSync(clearFlagPath, new Date().toISOString(), { flag: "wx" });
      // Clear results but preserve the flag for this test run
      // The flag prevents other threads from clearing again
      if (existsSync(resultsFilePath)) {
        unlinkSync(resultsFilePath);
      }
      saveResults({
        search: [],
        ingredients: [],
        appliances: [],
        utensils: [],
        combined: [],
        timestamp: null,
      });
      console.log("[Benchmark Setup] Cleared previous benchmark results");
    } catch (_flagError) {
      // Flag was created by another thread between check and write - no action needed
    }
  } catch (error) {
    console.warn("[Benchmark Setup] Failed to clear results:", error.message);
  }
}
