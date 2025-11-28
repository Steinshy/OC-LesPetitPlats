// Console logging utilities for LesPetitPlats tests
import chalk from "chalk";
import {
  logSection as modernLogSection,
  logSuccess as modernLogSuccess,
  logWarning as modernLogWarning,
  logInfo as modernLogInfo,
  logTestResult,
  logStep as modernLogStep,
  createSpinner,
  createProgressBar,
  updateProgress,
  stopProgress,
} from "./modernConsole.js";

// Test logging functions
export function logSection(title, emoji = "🧪") {
  modernLogSection(title, emoji);
}

export function logTestCategory(category, description) {
  logSection(`${category} - ${description}`, "📝");
}

// Category summary for test suites
export function logCategorySummary(category, categoryLabel, _allLabel) {
  logSection(`${categoryLabel} Test Summary`, "📊");
  console.log(chalk.dim(`  Test Category: ${category}`));
  console.log(chalk.dim(`  Label: ${categoryLabel}`));
  modernLogSuccess("All tests completed", "✓");
}

// Test result logging
export function logTestResultValue(label, value, unit = "", isSuccess = false) {
  logTestResult(label, value, unit, isSuccess);
}

export function logSuccess(message, icon = "✓") {
  modernLogSuccess(message, icon);
}

export function logWarning(message, icon = "⚠") {
  modernLogWarning(message, icon);
}

export function logInfo(message, icon = "ℹ") {
  modernLogInfo(message, icon);
}

// Test execution logging
export function logTestStart(testName) {
  console.log(chalk.cyan(`\n▶ Running: ${testName}`));
}

export function logTestComplete(testName, duration) {
  modernLogSuccess(`Completed: ${testName} (${duration}ms)`, "✓");
}

export function logTestFailure(testName, error) {
  console.log(chalk.red(`✗ Failed: ${testName}`));
  if (error) {
    console.log(chalk.dim(`  ${error.message || error}`));
  }
}

// Export modern console utilities
export { createSpinner, createProgressBar, updateProgress, stopProgress };
export { modernLogStep as logStep };

