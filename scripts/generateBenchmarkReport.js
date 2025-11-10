/**
 * Script to generate a comprehensive benchmark report.
 * Run all benchmark tests and generate a summary.
 */

import { execSync } from "child_process";

console.log("Running all benchmark tests...\n");

try {
  // Run all benchmark tests
  console.log("=".repeat(60));
  console.log("RUNNING BENCHMARK TESTS");
  console.log("=".repeat(60) + "\n");

  console.log("1. Search Benchmark Tests");
  execSync("npm test -- viteTest/searchBenchmark.test.js --run", {
    stdio: "inherit",
  });

  console.log("\n2. Filter Benchmark Tests");
  execSync("npm test -- viteTest/filterBenchmark.test.js --run", {
    stdio: "inherit",
  });

  console.log("\n3. Combined Filters Benchmark Tests");
  execSync("npm test -- viteTest/filtersBenchmark.test.js --run", {
    stdio: "inherit",
  });

  console.log("\n" + "=".repeat(60));
  console.log("BENCHMARK TESTS COMPLETED");
  console.log("=".repeat(60));
  console.log("\nCheck the test output above for detailed results.");
  console.log("The comprehensive summary is included in the Combined Filters test.");
} catch (error) {
  console.error("Error running benchmark tests:", error.message);
  process.exit(1);
}
