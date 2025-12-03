// Global setup runs once before all tests start
import { join } from "node:path";
import { saveResultsData } from "@benchmarks-data/collector.js";
import { cleanBenchmarks, cleanUnit } from "@viteTest-helper/cleanup.js";
import { ensureDirectory, pathExists } from "@viteTest-helper/fileSystem.js";
import { logSuccess, logWarning } from "@viteTest-helper/message.js";
import {
  getBenchmarkDir,
  getBenchmarkResultsFilePath,
  getUnitCoverageDir,
} from "@viteTest-helper/paths.js";

export async function setup() {
  try {
    cleanBenchmarks();
    const benchmarkDir = getBenchmarkDir();
    ensureDirectory(benchmarkDir);
    const resultsFilePath = getBenchmarkResultsFilePath();
    if (!pathExists(resultsFilePath)) {
      saveResultsData({
        search: [],
        ingredients: [],
        appliances: [],
        utensils: [],
        combined: [],
        timestamp: null,
      });
      logSuccess("Initialized benchmark results file", "✓");
    }

    cleanUnit();
    const coverageDir = getUnitCoverageDir();
    ensureDirectory(coverageDir);
    ensureDirectory(join(coverageDir, ".tmp"));
  } catch (error) {
    logWarning(`Failed to setup benchmark: ${error.message}`);
  }
}
