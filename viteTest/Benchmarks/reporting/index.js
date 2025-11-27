import chalk from "chalk";
import { createSpinner } from "@benchmarks-utils/logging.js";
import { promptForAllTests } from "./cli/prompts.js";
import { finalizeReport } from "./core/finalizer.js";
import { cleanupTempFiles } from "./core/cleanup.js";
import { displayHeader, initializeBenchmark, collectBenchmarkResults, generateAndSaveReport, getTestsToRun } from "./core/orchestrator.js";
import { runBenchmarkTests } from "./core/runner.js";

// Main execution
async function main() {
  const startTime = Date.now();
  displayHeader();

  try {
    await initializeBenchmark();
    const { runAllTests, runAllTestsEnv } = await promptForAllTests();
    const testsToRun = getTestsToRun();

    await runBenchmarkTests(testsToRun, runAllTests, runAllTestsEnv);

    const collectSpinner = createSpinner("Collecting benchmark results...");
    const results = await collectBenchmarkResults();
    collectSpinner.succeed("Collected benchmark results");

    if (results.flattened.length === 0) {
      console.log(chalk.yellow("\n⚠ Warning: No benchmark results found."));
      console.log(
        chalk.dim("Tests need to be modified to use addBenchmarkResult() from collector.js"),
      );
      console.log(chalk.dim("For now, generating report with empty data structure...\n"));
    }

    const htmlPath = await generateAndSaveReport(results, testsToRun, runAllTests);
    await finalizeReport(htmlPath, startTime);
    cleanupTempFiles();
  } catch (error) {
    console.error("Error generating benchmark report:", error.message);
    process.exit(1);
  }
}

main();
