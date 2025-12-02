import { createInterface } from "node:readline";
import { getAllResults, saveResultsData } from "@benchmarks-data/collector.js";
import { colors } from "@viteTest-helper/message.js";

// Prompt user for yes/no question with modern styling
function askQuestion(question) {
  return new Promise(resolve => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(colors.cyan(`\n${question} ${colors.dim("(yes/no)")}: `), answer => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === "yes" || normalized === "y");
    });
  });
}

// Prompt user for multiple choice question
function askQuestionMultiple(question, options) {
  return new Promise(resolve => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(colors.cyan(`\n${question} ${colors.dim(`(${options.join("/")})`)}: `), answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}


// Prompt user for "All" tests preference
async function promptForAllTests() {
  // Auto-detect CI environment and use RUN_ALL_TESTS env var if set
  const isCI = process.env.CI === "true";
  const envRunAllTests = process.env.RUN_ALL_TESTS;

  if (isCI && envRunAllTests !== undefined) {
    // In CI mode, use environment variable directly
    const runAllTests = envRunAllTests === "true";
    const runAllTestsEnv = runAllTests ? "true" : "false";

    if (runAllTests) {
      console.log(colors.success("✓ 'All' tests will be included (CI mode)"));
    } else {
      console.log(colors.dim("⊘ 'All' tests will be skipped (CI mode)"));
    }

    // Store the "All" tests preference in results
    const allResults = getAllResults();
    allResults.runAllTests = runAllTests;
    saveResultsData(allResults);

    return { runAllTests, runAllTestsEnv };
  }

  // Interactive mode: prompt user
  console.log(`\n${colors.warning("⚠️  Note:")} 'All' tests benchmark every available filter value`);
  console.log(colors.dim("   (ingredients, appliances, utensils) - up to 10 min each."));
  console.log(colors.dim("   If skipped, they will be marked as 'skipped' in the report."));
  const runAllTests = await askQuestion("Do you want to run the 'All' tests?");
  const runAllTestsEnv = runAllTests ? "true" : "false";

  if (runAllTests) {
    console.log(colors.success("✓ 'All' tests will be included"));
  } else {
    console.log(colors.dim("⊘ 'All' tests will be skipped"));
  }

  // Store the "All" tests preference in results
  const allResults = getAllResults();
  allResults.runAllTests = runAllTests;
  saveResultsData(allResults);

  return { runAllTests, runAllTestsEnv };
}

export { askQuestion, askQuestionMultiple, promptForAllTests };
