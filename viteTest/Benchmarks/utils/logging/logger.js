// Console logging utilities for benchmark tests
import { formatBenchmarkResults, formatMemory, formatTime } from "../measurement/formatting.js";

export function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

export function logBenchmarkComparison(functionalStats, nativeStats, comparison) {
  // Functional implementation label
  const functionalLabel = comparison.result1.name || "Functional";
  // Native implementation label
  const nativeLabel = comparison.result2.name || "Native";
  console.log(formatBenchmarkResults(functionalStats, functionalLabel));
  console.log(formatBenchmarkResults(nativeStats, nativeLabel));
  console.log(`\nWinner: ${comparison.faster}`);
  console.log(`Improvement: ${comparison.improvement.toFixed(2)}%`);
}

export function logBenchmarkSection(title, functionalStats, nativeStats, comparison) {
  logSection(title);
  logBenchmarkComparison(functionalStats, nativeStats, comparison);
}

export function logMemoryComparison(title, functionalMemory, nativeMemory) {
  logSection(title);
  console.log(
    `Functional Programming (using filter/every/some/includes): ${formatMemory(functionalMemory)}`,
  );
  console.log(`Native Loops (using for loops): ${formatMemory(nativeMemory)}`);
}

export function logMemoryUsage(label, functionalMemory, nativeMemory) {
  console.log(
    `${label} - Functional Programming (using filter/every/some/includes): ${formatMemory(functionalMemory)}`,
  );
  console.log(`${label} - Native Loops (using for loops): ${formatMemory(nativeMemory)}`);
}

export function logReportHeader(title, width = 60) {
  console.log(`\n${"=".repeat(width)}`);
  console.log(title);
  console.log("=".repeat(width));
}

export function logSuccess(message) {
  console.log(`\n✓ ${message}`);
}

export function logRecommendations(winner, message) {
  console.log("\nRECOMMENDATIONS:");
  console.log(`✓ ${winner}`);
  console.log(`  ${message}`);
}

export function formatTestCaseResult(testCaseName, functionalStats, nativeStats, comparison) {
  // Test case header
  const testResult = `\n${testCaseName}:\n`;
  // Functional stats line
  const functionalLine = `  Functional Programming (using filter/every/some/includes): ${formatTime(functionalStats.avg)}\n`;
  // Native stats line
  const nativeLine = `  Native Loops (using for loops): ${formatTime(nativeStats.avg)}\n`;
  // Winner line
  const winnerLine = `  Winner: ${comparison.faster} (${comparison.improvement.toFixed(2)}% faster)\n`;
  // Functional details
  const details = `  Functional Programming (using filter/every/some/includes) Details:\n    Average: ${formatTime(functionalStats.avg)}\n    Min: ${formatTime(functionalStats.min)}\n    Max: ${formatTime(functionalStats.max)}\n    Std Dev: ${formatTime(functionalStats.stdDev)}\n    Ops/sec: ${functionalStats.opsPerSecond.toFixed(2)}\n`;
  // Native details
  const nativeDetails = `  Native Loops (using for loops) Details:\n    Average: ${formatTime(nativeStats.avg)}\n    Min: ${formatTime(nativeStats.min)}\n    Max: ${formatTime(nativeStats.max)}\n    Std Dev: ${formatTime(nativeStats.stdDev)}\n    Ops/sec: ${nativeStats.opsPerSecond.toFixed(2)}\n`;

  // Console output
  const consoleOutput = testResult + functionalLine + nativeLine + winnerLine;
  // Report content
  const reportContent =
    testResult + functionalLine + nativeLine + winnerLine + details + nativeDetails;

  return { consoleOutput, reportContent };
}

export function logTestCaseResult(testCaseName, functionalStats, nativeStats, comparison) {
  const { consoleOutput, reportContent } = formatTestCaseResult(
    testCaseName,
    functionalStats,
    nativeStats,
    comparison,
  );
  console.log(consoleOutput);
  return reportContent;
}

export function formatSummarySection(results) {
  // Extract winner names
  const winnerNames = results.map(r => r.winner);
  // Functional wins count
  const functionalWins = winnerNames.filter(winner =>
    winner.includes("Functional Programming"),
  ).length;
  // Native wins count
  const nativeWins = winnerNames.filter(winner => winner.includes("Native Loops")).length;
  // Overall winner
  const overallWinner =
    functionalWins > nativeWins
      ? "Functional Programming (using filter/every/some/includes)"
      : "Native Loops (using for loops)";

  // Summary header
  const summarySection = `\n${"=".repeat(60)}\n`;
  // Overall winner line
  const overallWinnerLine = `OVERALL WINNER: ${overallWinner}\n`;
  // Functional wins line
  const functionalWinsLine = `Functional Programming (using filter/every/some/includes) wins: ${functionalWins}/${results.length}\n`;
  // Native wins line
  const nativeWinsLine = `Native Loops (using for loops) wins: ${nativeWins}/${results.length}\n`;
  // Separator line
  const separator = `${"=".repeat(60)}\n`;

  // Combined output
  const output = `${summarySection}${overallWinnerLine}${functionalWinsLine}${nativeWinsLine}${separator}`;

  return { output, overallWinner, functionalWins, nativeWins };
}

export function logSummarySection(results) {
  const { output, overallWinner, functionalWins, nativeWins } = formatSummarySection(results);
  console.log(output);
  return { overallWinner, functionalWins, nativeWins, reportContent: output };
}

export function formatRecommendations(overallWinner) {
  // Recommendations text
  let recommendations = "\nRECOMMENDATIONS:\n";
  if (overallWinner.includes("Native Loops")) {
    recommendations += "✓ Native loop implementation (using for loops) is faster overall\n";
    recommendations += "  Consider using native loops for better performance\n";
    logRecommendations(
      "Native loop implementation (using for loops) is faster overall",
      "Consider using native loops for better performance",
    );
  } else {
    recommendations +=
      "✓ Functional programming implementation (using filter/every/some/includes) is faster overall\n";
    recommendations += "  Consider using functional methods for better readability\n";
    logRecommendations(
      "Functional programming implementation (using filter/every/some/includes) is faster overall",
      "Consider using functional methods for better readability",
    );
  }
  return recommendations;
}

export function formatReportHeader() {
  // Header separator
  const header = `${"=".repeat(60)}\n`;
  // Report title
  const title = "COMPREHENSIVE BENCHMARK SUMMARY REPORT\n";
  // Footer separator
  const separator = `${"=".repeat(60)}\n\n`;
  // Generation timestamp
  const timestamp = `Generated: ${new Date().toISOString()}\n\n`;
  return header + title + separator + timestamp;
}
