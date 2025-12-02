import { deleteFile, pathExists } from "@viteTest-helper/fileSystem.js";
import { colors, createSpinner, logError, logWarning } from "@viteTest-helper/message.js";
import { getBenchmarkResultsFilePath } from "@viteTest-helper/paths.js";
import { promptForAllTests } from "./cli/prompts.js";
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
        colors.dim("Tests need to be modified to use addBenchmarkResult() from collector.js"),
      );
      console.log(colors.dim("For now, generating report with empty data structure...\n"));
    }

    const htmlPath = await generateAndSaveReport(results, testsToRun, runAllTests);
    await finalizeReport(htmlPath, startTime);
    // Clean up temporary JSON results file
    const jsonFilePath = getBenchmarkResultsFilePath();
    if (pathExists(jsonFilePath)) {
      deleteFile(jsonFilePath);
    }
  } catch (error) {
    logError("\n❌ Error generating benchmark report:");
    logError(error.message);
    if (error.stack) {
      console.error(colors.dim(error.stack));
    }
    process.exit(1);
  }
}

main();
