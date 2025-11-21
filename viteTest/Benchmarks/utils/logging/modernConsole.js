// Modern console logging utilities with progress bars, colors, and spinners
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

/**
 * Initialize a progress bar
 * @param {number} total - Total number of items
 * @param {string} label - Label for the progress bar
 * @returns {Object} Progress bar instance
 */
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

/**
 * Update progress bar
 * @param {number} value - Current progress value
 */
export function updateProgress(value) {
  if (progressBar) {
    progressBar.update(value);
  }
}

/**
 * Stop and clear progress bar
 */
export function stopProgress() {
  if (progressBar) {
    progressBar.stop();
    progressBar = null;
  }
}

/**
 * Create a spinner
 * @param {string} text - Spinner text
 * @returns {Object} Spinner instance
 */
export function createSpinner(text) {
  return ora({
    text: colors.cyan(text),
    spinner: "dots",
  }).start();
}

/**
 * Log success message
 */
export function logSuccess(message, icon = "✓") {
  console.log(colors.success(`${icon} ${message}`));
}

/**
 * Log error message
 */
export function logError(message, icon = "✗") {
  console.log(colors.error(`${icon} ${message}`));
}

/**
 * Log warning message
 */
export function logWarning(message, icon = "⚠") {
  console.log(colors.warning(`${icon} ${message}`));
}

/**
 * Log info message
 */
export function logInfo(message, icon = "ℹ") {
  console.log(colors.info(`${icon} ${message}`));
}

/**
 * Log section header
 */
export function logSection(title, emoji = "📊") {
  console.log(`\n${colors.bold(colors.cyan(`${emoji} ${title}`))}`);
  console.log(colors.dim("─".repeat(60)));
}

/**
 * Log benchmark result with colors
 */
export function logBenchmarkResult(label, value, unit = "ms", isWinner = false) {
  const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
  const color = isWinner ? colors.success : colors.dim;
  console.log(`  ${color(label.padEnd(20))} ${colors.bold(formattedValue)}${unit}`);
}

/**
 * Log comparison result
 */
export function logComparison(winner, improvement, faster, slower) {
  console.log(`\n${colors.bold("Comparison:")}`);
  console.log(`  ${colors.success("Winner:")} ${colors.bold(winner)}`);
  console.log(
    `  ${colors.info("Improvement:")} ${colors.bold(improvement.toFixed(2))}% faster than ${slower}`,
  );
  console.log(`  ${colors.dim(`${faster} vs ${slower}`)}`);
}

/**
 * Log header with style
 */
export function logHeader(title, width = 60) {
  const border = "═".repeat(width);
  console.log(`\n${colors.bold(colors.cyan(border))}`);
  console.log(colors.bold(colors.cyan(title.padStart((width + title.length) / 2))));
  console.log(colors.bold(colors.cyan(border)));
}

/**
 * Log step with number
 */
export function logStep(stepNumber, message, status = "pending") {
  const icons = {
    pending: "○",
    running: "⟳",
    success: "✓",
    error: "✗",
  };
  const colors_map = {
    pending: colors.dim,
    running: colors.cyan,
    success: colors.success,
    error: colors.error,
  };

  const icon = icons[status] || icons.pending;
  const color = colors_map[status] || colors_map.pending;
  console.log(`\n${color(`${icon} [${stepNumber}]`)} ${message}`);
}

/**
 * Log category summary with modern formatting
 */
export function logCategorySummary(category, stats) {
  logSection(`${category} Summary`, "📈");
  console.log(`  ${colors.bold("Tests:")} ${stats.testCount}`);
  console.log(
    `  ${colors.bold("Winner:")} ${colors.success(stats.winner)} (${stats.wins}/${stats.testCount} wins)`,
  );
  console.log(`  ${colors.bold("Avg Time:")} ${stats.avgTime.toFixed(4)}ms`);
  if (stats.improvement) {
    console.log(
      `  ${colors.bold("Improvement:")} ${colors.success(stats.improvement.toFixed(2))}%`,
    );
  }
}

/**
 * Log table row
 */
export function logTableRow(columns, widths = []) {
  const padded = columns.map((col, i) => {
    const width = widths[i] || 15;
    return String(col).padEnd(width);
  });
  console.log(`  ${padded.join(" │ ")}`);
}

/**
 * Log table header
 */
export function logTableHeader(headers, widths = []) {
  const padded = headers.map((h, i) => {
    const width = widths[i] || 15;
    return colors.bold(String(h).padEnd(width));
  });
  console.log(`  ${padded.join(" │ ")}`);
  console.log(`  ${"─".repeat(padded.join(" │ ").length - 2)}`);
}

/**
 * Log memory usage
 */
export function logMemory(label, value, unit = "MB") {
  console.log(`  ${colors.dim(label.padEnd(20))} ${colors.bold(value.toFixed(2))}${unit}`);
}

/**
 * Log separator
 */
export function logSeparator(char = "─", width = 60) {
  console.log(colors.dim(char.repeat(width)));
}

/**
 * Log with emoji prefix
 */
export function logWithEmoji(emoji, message, color = "dim") {
  const colorFn = colors[color] || colors.dim;
  console.log(colorFn(`${emoji} ${message}`));
}

/**
 * Clear line (useful for updating progress)
 */
export function clearLine() {
  process.stdout.write("\r\x1b[K");
}

/**
 * Log test progress
 */
export function logTestProgress(current, total, testName) {
  const percentage = ((current / total) * 100).toFixed(0);
  clearLine();
  process.stdout.write(
    `  ${colors.cyan("⟳")} Running test ${current}/${total} (${percentage}%): ${colors.dim(testName)}`,
  );
  if (current === total) {
    console.log(); // New line when complete
  }
}
