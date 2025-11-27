import { execSync } from "node:child_process";
import chalk from "chalk";
import { askQuestion } from "@benchmarks-reporting-cli/prompts.js";
import { createSpinner } from "@benchmarks-utils/logging.js";

// Format duration in a human-readable way
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
}


// Display final summary and optionally open report
async function finalizeReport(htmlPath, startTime) {
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  const formattedDuration = formatDuration(totalDuration);

  console.log(`\n${chalk.bold(chalk.green(`╔${"═".repeat(58)}╗`))}`);
  console.log(
    chalk.bold(chalk.green(`║${" ".repeat(12)}REPORT GENERATION COMPLETED${" ".repeat(20)}║`)),
  );
  console.log(chalk.bold(chalk.green(`╚${"═".repeat(58)}╝`)));
  console.log(`${chalk.green("\n✓ HTML Report:")} ${chalk.cyan(htmlPath)}`);
  console.log(chalk.dim(`   Total Duration: ${chalk.bold(formattedDuration)}`));

  // Skip browser opening prompt in CI environment
  const isCI = process.env.CI === "true";
  if (isCI) {
    console.log(chalk.dim("\n   Browser opening skipped (CI mode)"));
    console.log(chalk.dim("   Report saved. You can download it from CI artifacts."));
    console.log(chalk.cyan(`   ${htmlPath}`));
    return;
  }

  const openReport = await askQuestion("\nDo you want to open the report in your browser?");
  if (openReport) {
    const openSpinner = createSpinner("Opening report in browser...");
    try {
      const platform = process.platform;
      let command;

      if (platform === "win32") {
        command = `start "" "${htmlPath}"`;
      } else if (platform === "darwin") {
        command = `open "${htmlPath}"`;
      } else {
        command = `xdg-open "${htmlPath}"`;
      }

      execSync(command, { stdio: "ignore" });
      openSpinner.succeed("Report opened in browser");
      console.log(chalk.cyan("\n👋 Bye bye!"));
    } catch (_error) {
      openSpinner.warn("Could not open report automatically");
      console.log(chalk.dim(`   Please open manually: ${htmlPath}`));
      console.log(chalk.cyan("\n👋 Bye bye!"));
    }
  } else {
    console.log(chalk.dim("   Report saved. You can open it later at:"));
    console.log(chalk.cyan(`   ${htmlPath}`));
    console.log(chalk.cyan("\n👋 Bye bye!"));
  }
}

export { finalizeReport, formatDuration };
