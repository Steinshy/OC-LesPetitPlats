// Formatting utilities for console output
import { formatTime } from "./formatMeasurement.js";
import { logRecommendations } from "../logging/console.js";

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

export function formatRecommendations(overallWinner) {
  // Recommendations text
  let recommendations = "\nRECOMMENDATIONS:\n";
  // Determine winner and message
  let winner;
  let message;
  if (overallWinner.includes("Native Loops")) {
    winner = "Native loop implementation (using for loops) is faster overall";
    message = "Consider using native loops for better performance";
    recommendations += `✓ ${winner}\n`;
    recommendations += `  ${message}\n`;
  } else {
    winner = "Functional programming implementation (using filter/every/some/includes) is faster overall";
    message = "Consider using functional methods for better readability";
    recommendations += `✓ ${winner}\n`;
    recommendations += `  ${message}\n`;
  }
  // Call logRecommendations only once at the end
  logRecommendations(winner, message);
  return recommendations;
}
