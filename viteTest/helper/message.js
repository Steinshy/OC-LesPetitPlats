// Message and console logging utilities for viteTest
import chalk from "chalk";
import cliProgress from "cli-progress";
import ora from "ora";

// Color scheme
const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  dim: chalk.dim,
  bold: chalk.bold,
  cyan: chalk.cyan,
  magenta: chalk.magenta,
};

// Progress bar instance
let progressBar = null;

export function createProgressBar(total, label = "Progress") {
  if (progressBar) {
    progressBar.stop();
  }

  progressBar = new cliProgress.SingleBar(
    {
      format: `${colors.cyan(label)} |${chalk.cyan("{bar}")}| ${chalk.bold("{percentage}%")} | {value}/{total} | ETA: {eta}s`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
      clearOnComplete: true,
    },
    cliProgress.Presets.shades_classic,
  );

  progressBar.start(total, 0);
  return progressBar;
}

export function updateProgress(value) {
  if (progressBar) {
    progressBar.update(value);
  }
}

export function stopProgress() {
  if (progressBar) {
    progressBar.stop();
    progressBar = null;
  }
}

export function createSpinner(text) {
  return ora({
    text: colors.cyan(text),
    spinner: "dots",
  }).start();
}

export function logSuccess(message, icon = "✓") {
  console.log(colors.success(`${icon} ${message}`));
}

export function logWarning(message, icon = "⚠️") {
  console.log(colors.warning(`${icon} ${message}`));
}

export function logInfo(message, icon = "ℹ️") {
  console.log(colors.info(`${icon} ${message}`));
}

export function logError(message, icon = "❌") {
  console.log(colors.error(`${icon} ${message}`));
}

export function logSection(title, emoji = "🧪") {
  console.log(`\n${colors.bold(colors.cyan(`${emoji} ${title}`))}`);
  console.log(colors.dim("─".repeat(60)));
}

export function logTestResult(label, value, unit = "", isSuccess = false) {
  const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
  const color = isSuccess ? colors.success : colors.dim;
  console.log(`  ${color(label.padEnd(20))} ${colors.bold(formattedValue)}${unit}`);
}

export function logTestSummary(category, stats) {
  logSection(`${category} Test Summary`, "📊");
  console.log(`  ${colors.bold("Tests:")} ${stats.testCount || stats.total || 0}`);
  if (stats.passed !== undefined) {
    console.log(`  ${colors.success("Passed:")} ${colors.bold(stats.passed)}`);
  }
  if (stats.failed !== undefined) {
    console.log(`  ${colors.error("Failed:")} ${colors.bold(stats.failed)}`);
  }
  if (stats.duration) {
    console.log(`  ${colors.bold("Duration:")} ${stats.duration}ms`);
  }
}

export function logHeader(title, width = 60) {
  const border = "═".repeat(width);
  console.log(`\n${colors.bold(colors.cyan(border))}`);
  console.log(colors.bold(colors.cyan(title.padStart((width + title.length) / 2))));
  console.log(colors.bold(colors.cyan(border)));
}

export function logStep(stepNumber, message, status = "pending") {
  const icons = {
    pending: "○",
    running: "▶️",
    success: "✓",
    error: "❌",
  };
  const colorsMap = {
    pending: colors.dim,
    running: colors.cyan,
    success: colors.success,
    error: colors.error,
  };

  const icon = icons[status] || icons.pending;
  const color = colorsMap[status] || colorsMap.pending;
  console.log(`\n${color(`${icon} [${stepNumber}]`)} ${message}`);
}

export function logTestStart(testName) {
  console.log(colors.cyan(`\n▶ Running: ${testName}`));
}

export function logTestComplete(testName, duration) {
  logSuccess(`Completed: ${testName} (${duration}ms)`, "✓");
}

export function logTestFailure(testName, error) {
  console.log(colors.error(`❌ Failed: ${testName}`));
  if (error) {
    console.log(colors.dim(`  ${error.message || error}`));
  }
}

export function logCategorySummary(category, categoryLabel, allLabel) {
  // Suppress output in test mode to avoid stdout clutter
  // Vitest sets VITEST env var, and NODE_ENV may be 'test' in test environments
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return;
  }
  // Log immediately to avoid setTimeout issues in test environments
  logSection(`${categoryLabel} Test Summary`, "📊");
  console.log(colors.dim(`  Test Category: ${category}`));
  console.log(colors.dim(`  Label: ${categoryLabel}`));
  if (allLabel) {
    console.log(colors.dim(`  All Label: ${allLabel}`));
  }
  logSuccess("All tests completed", "✓");
}

export function logTestCategory(category, description) {
  logSection(`${category} - ${description}`, "📝");
}

export function logTestResultValue(label, value, unit = "", isSuccess = false) {
  logTestResult(label, value, unit, isSuccess);
}

export function logJsbenNextSteps() {
  console.log(`\n${colors.bold(colors.cyan("📋 Next Steps:"))}`);
  console.log(`  ${colors.dim("1.")} Open any benchmark folder ${colors.cyan("(search, ingredients, appliances, or utensils)")}`);
  console.log(`  ${colors.dim("2.")} Open the .js files → Select All ${colors.cyan("(Cmd/Ctrl+A)")} → Copy → Paste into ${colors.bold("jsben.ch")}`);
  console.log(`  ${colors.dim("3.")} Run the benchmarks and compare results\n`);
}

// Export color utilities for advanced usage
export { colors };

