/**
 * Console logging utilities for benchmark tests.
 */

import { formatBenchmarkResults, formatMemory } from "./formatting.js";

/**
 * Logs a section header with separator
 * @param {string} title - Section title
 */
export function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

/**
 * Logs benchmark comparison results
 * @param {Object} functionalStats - Functional implementation stats
 * @param {Object} nativeStats - Native implementation stats
 * @param {Object} comparison - Comparison object from compareResults
 */
export function logBenchmarkComparison(functionalStats, nativeStats, comparison) {
  console.log(formatBenchmarkResults(functionalStats, "Functional"));
  console.log(formatBenchmarkResults(nativeStats, "Native"));
  console.log(`\nWinner: ${comparison.faster}`);
  console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);
}

/**
 * Logs a benchmark section with comparison results
 * @param {string} title - Section title
 * @param {Object} functionalStats - Functional implementation stats
 * @param {Object} nativeStats - Native implementation stats
 * @param {Object} comparison - Comparison object from compareResults
 */
export function logBenchmarkSection(title, functionalStats, nativeStats, comparison) {
  logSection(title);
  logBenchmarkComparison(functionalStats, nativeStats, comparison);
}

/**
 * Logs memory usage comparison
 * @param {string} title - Section title
 * @param {number} functionalMemory - Functional implementation memory usage
 * @param {number} nativeMemory - Native implementation memory usage
 */
export function logMemoryComparison(title, functionalMemory, nativeMemory) {
  logSection(title);
  console.log(`Functional: ${formatMemory(functionalMemory)}`);
  console.log(`Native: ${formatMemory(nativeMemory)}`);
}

/**
 * Logs memory usage with custom labels
 * @param {string} label - Label for the memory measurement
 * @param {number} functionalMemory - Functional implementation memory usage
 * @param {number} nativeMemory - Native implementation memory usage
 */
export function logMemoryUsage(label, functionalMemory, nativeMemory) {
  console.log(`${label} - Functional: ${formatMemory(functionalMemory)}`);
  console.log(`${label} - Native: ${formatMemory(nativeMemory)}`);
}

/**
 * Logs a report header with separator
 * @param {string} title - Report title
 * @param {number} width - Separator width (default: 60)
 */
export function logReportHeader(title, width = 60) {
  console.log(`\n${"=".repeat(width)}`);
  console.log(title);
  console.log("=".repeat(width));
}

/**
 * Logs a success message
 * @param {string} message - Success message
 */
export function logSuccess(message) {
  console.log(`\n✓ ${message}`);
}

/**
 * Logs recommendations
 * @param {string} winner - Winner implementation name
 * @param {string} message - Recommendation message
 */
export function logRecommendations(winner, message) {
  console.log("\nRECOMMENDATIONS:");
  console.log(`✓ ${winner}`);
  console.log(`  ${message}`);
}
