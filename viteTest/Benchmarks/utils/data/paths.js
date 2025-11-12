// Paths and data loading utilities for benchmarks
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path constants
const DATA_FILE = "data-benchmark.json";
const CSS_FILE = "generate.css";
const RESULTS_FILE = "benchmark-results.json";
const BENCHMARK_DIR_NAME = "Benchmark";

// Path exports
export const benchmarkDataPath = resolve(__dirname, "../../../../public/api", DATA_FILE);
export const benchmarkDir = resolve(__dirname, "../../../../", BENCHMARK_DIR_NAME);
export const reportingBenchmarkDir = resolve(
  __dirname,
  "../reporting/../../../../",
  BENCHMARK_DIR_NAME,
);

// Data loading
export const benchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));

// Utility functions
export function getDataSubset(data, size) {
  return data.slice(0, Math.min(size, data.length));
}

export function loadReportCSS() {
  const cssPath = resolve(__dirname, "../reporting", CSS_FILE);
  return readFileSync(cssPath, "utf-8");
}
