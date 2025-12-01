import chalk from "chalk";
import { createSpinner, logWarning } from "@benchmarks-utils/console.js";
import { promptForAllTests } from "./cli/prompts.js";
import { cleanupTempFiles } from "./core/cleanup.js";
import { finalizeReport } from "./core/finalizer.js";
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
      logWarning("No benchmark results found.");
      console.log(
        chalk.dim("Tests need to be modified to use addBenchmarkResult() from collector.js"),
      );
      console.log(chalk.dim("For now, generating report with empty data structure...\n"));
    }

    const htmlPath = await generateAndSaveReport(results, testsToRun, runAllTests);
    await finalizeReport(htmlPath, startTime);
    cleanupTempFiles();
  } catch (error) {
    console.error(chalk.red("\n❌ Error generating benchmark report:"));
    console.error(chalk.red(error.message));
    if (error.stack) {
      console.error(chalk.dim(error.stack));
    }
    process.exit(1);
  }
}

main();
