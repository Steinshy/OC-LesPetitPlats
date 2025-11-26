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


export function logWarning(message, icon = "⚠") {
  console.log(colors.warning(`${icon} ${message}`));
}

export function logInfo(message, icon = "ℹ") {
  console.log(colors.info(`${icon} ${message}`));
}

export function logSection(title, emoji = "📊") {
  console.log(`\n${colors.bold(colors.cyan(`${emoji} ${title}`))}`);
  console.log(colors.dim("─".repeat(60)));
}

export function logBenchmarkResult(label, value, unit = "ms", isWinner = false) {
  const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
  const color = isWinner ? colors.success : colors.dim;
  console.log(`  ${color(label.padEnd(20))} ${colors.bold(formattedValue)}${unit}`);
}

export function logComparison(winner, improvement, faster, slower) {
  console.log(`\n${colors.bold("Comparison:")}`);
  console.log(`  ${colors.success("Winner:")} ${colors.bold(winner)}`);
  console.log(
    `  ${colors.info("Improvement:")} ${colors.bold(improvement.toFixed(2))}% faster than ${slower}`,
  );
  console.log(`  ${colors.dim(`${faster} vs ${slower}`)}`);
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


export function logMemory(label, value, unit = "MB") {
  console.log(`  ${colors.dim(label.padEnd(20))} ${colors.bold(value.toFixed(2))}${unit}`);
}

function _clearLine() {
  process.stdout.write("\r\x1b[K");
}
