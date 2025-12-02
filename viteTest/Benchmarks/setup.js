// Global setup runs once before all tests start
import { saveResultsData } from "@benchmarks-data/collector.js";
import { cleanBenchmarks } from "@viteTest-helper/cleanup.js";
import { ensureDirectory, pathExists } from "@viteTest-helper/fileSystem.js";
import { logSuccess, logWarning } from "@viteTest-helper/message.js";
import { getBenchmarkDir, getBenchmarkResultsFilePath } from "@viteTest-helper/paths.js";

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
  } catch (error) {
    logWarning(`Failed to setup benchmark: ${error.message}`);
  }
}

