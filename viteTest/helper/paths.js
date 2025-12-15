// Path definitions for viteTest output directories
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function getBenchmarkResultsRoot() {
  return join(process.cwd(), "benchmark-results");
}

export function getBenchmarkDir() {
  return join(getBenchmarkResultsRoot(), "Benchmark");
}

export function getJsbenDir() {
  return join(getBenchmarkResultsRoot(), "Jsben");
}

export function getUnitCoverageDir() {
  return join(getBenchmarkResultsRoot(), "Unit");
}

export function getTempDir() {
  return join(tmpdir(), "lespetitplats-benchmark");
}

export function getBenchmarkResultsFilePath() {
  return join(getTempDir(), "benchmark-results.json");
}

export function generateReportPath(prefix, extension = "", _projectRoot) {
  const reportDir = getBenchmarkDir();
  mkdirSync(reportDir, { recursive: true });
  const dateString = new Date().toISOString().split("T")[0];
  const filename = extension ? `${prefix}-${dateString}.${extension}` : `${prefix}-${dateString}`;
  return join(reportDir, filename);
}

