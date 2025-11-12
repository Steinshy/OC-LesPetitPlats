// Script to save benchmark results after tests run
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getBenchmarkResults } from "../data/results.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = join(__dirname, "../../../../Benchmark/benchmark-results.json");
const results = getBenchmarkResults();

if (Object.keys(results).length > 0) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`✅ Benchmark results saved to: ${outputPath}`);
} else {
  console.warn("⚠️  No benchmark results found to save");
}
