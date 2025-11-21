// Script to save benchmark results after tests run
import { writeFileSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { getBenchmarkResults } from "../data/results.js";

// Use temp directory for temporary benchmark results file
const tempDir = join(tmpdir(), "lespetitplats-benchmark");
const outputPath = join(tempDir, "benchmark-results.json");
const results = getBenchmarkResults();

if (Object.keys(results).length > 0) {
  mkdirSync(tempDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`✅ Benchmark results saved to: ${outputPath}`);
} else {
  console.warn("⚠️  No benchmark results found to save");
}
