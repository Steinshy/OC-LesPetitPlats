import { exec, spawn, execSync } from "node:child_process";
import { promisify } from "node:util";
import chalk from "chalk";
import { askQuestionMultiple } from "@benchmarks-reporting-cli/prompts.js";
import { createSpinner } from "@benchmarks-utils/logging.js";

const execAsync = promisify(exec);

// Check if a Vitest process is already running
async function isVitestRunning() {
  try {
    // Check for vitest processes (excluding grep itself)
    // On macOS/Linux, use ps with grep
    const platform = process.platform;
    let command;

    if (platform === "win32") {
      // Windows: use tasklist
      command = 'tasklist /FI "IMAGENAME eq node.exe" /FO CSV | findstr /I vitest';
      try {
        const { stdout } = await execAsync(command);
        return stdout.trim().length > 0;
      } catch {
        // If findstr doesn't find anything, it returns error code 1
        return false;
      }
    } else {
      // macOS/Linux: use ps with grep (using [v] pattern to exclude grep itself)
      command = 'ps aux | grep -i "[v]itest"';
      try {
        const { stdout } = await execAsync(command);
        // Filter out grep process and check if any vitest processes remain
        const lines = stdout.split("\n").filter(
          line =>
            line.includes("vitest") &&
            !line.includes("grep") &&
            !line.includes("node.*generateReport"), // Exclude this script itself
        );
        return lines.length > 0;
      } catch {
        return false;
      }
    }
  } catch (_error) {
    // If check fails, assume no process is running to avoid blocking
    console.warn(chalk.yellow("⚠ Could not check for running Vitest processes, continuing..."));
    return false;
  }
}

// Wait for Vitest process to finish or ask user what to do
async function handleRunningVitest() {
  const checkSpinner = createSpinner("Checking for running Vitest processes...");
  const isRunning = await isVitestRunning();
  checkSpinner.stop();

  if (isRunning) {
    console.log(chalk.yellow("\n⚠️  A Vitest process is already running!"));
    console.log(chalk.dim("   This could cause conflicts or resource issues."));

    const action = await askQuestionMultiple(
      "Do you want to wait for it to finish, kill it, or exit?",
      ["wait", "kill", "exit"],
    );

    const normalized = action.trim().toLowerCase();

    if (normalized === "kill" || normalized === "k") {
      const killSpinner = createSpinner("Killing running Vitest processes...");
      try {
        const platform = process.platform;
        if (platform === "win32") {
          execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq *vitest*"', { stdio: "ignore" });
        } else {
          execSync("pkill -f vitest", { stdio: "ignore" });
        }
        // Wait a moment for processes to terminate
        await new Promise(resolve => setTimeout(resolve, 1000));
        killSpinner.succeed("Killed running Vitest processes");
      } catch (_error) {
        killSpinner.warn("Could not kill processes (they may have already finished)");
      }
    } else if (normalized === "wait" || normalized === "w") {
      const waitSpinner = createSpinner("Waiting for Vitest processes to finish...");
      let attempts = 0;
      const maxAttempts = 300; // 5 minutes max wait (1 second per attempt)

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const stillRunning = await isVitestRunning();

        if (!stillRunning) {
          waitSpinner.succeed("Vitest processes finished");
          return;
        }

        attempts++;
        waitSpinner.text = chalk.cyan(`Waiting for Vitest processes to finish... (${attempts}s)`);
      }

      waitSpinner.warn("Timeout waiting for processes. Continuing anyway...");
    } else {
      // exit
      console.log(chalk.red("Exiting. Please wait for the current Vitest process to finish."));
      process.exit(0);
    }
  } else {
    console.log(chalk.green("✓ No Vitest processes running"));
  }
}


// Filter vitest output to remove test summary lines
function filterVitestOutput(output) {
  const lines = output.split("\n");
  const filteredLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Always keep stdout lines (they contain "stdout |")
    if (line.includes("stdout |")) {
      filteredLines.push(line);
      continue;
    }

    // Always keep empty lines
    if (!line.trim()) {
      filteredLines.push(line);
      continue;
    }

    // Skip test result lines (✓, ↓, × at start)
    if (line.match(/^\s*[×↓✓]/)) {
      continue;
    }

    // Skip summary lines
    if (
      line.includes("Test Files") ||
      line.includes("Tests") ||
      line.includes("Start at") ||
      line.includes("Duration")
    ) {
      continue;
    }

    // Skip "RUN" header line
    if (line.includes(" RUN ")) {
      continue;
    }

    // Skip separator lines (⎯ characters)
    if (line.match(/^\s*⎯+/)) {
      continue;
    }

    // Keep everything else (including actual test output)
    filteredLines.push(line);
  }

  return filteredLines;
}


// Run a single benchmark test file
async function runSingleTest(test, index, total, runAllTests, runAllTestsEnv, testSpinner) {
  testSpinner.text = chalk.cyan(`Running ${test.name} Benchmark Tests (${index + 1}/${total})...`);
  if (!runAllTests) {
    testSpinner.text += chalk.dim(" (Skipping 'All' tests)");
  }

  const vitestProcess = spawn("npx", ["vitest", "run", test.file], {
    env: {
      ...process.env,
      RUN_ALL_TESTS: runAllTestsEnv,
      NODE_OPTIONS: process.env.NODE_OPTIONS || "--max-old-space-size=4096",
    },
    stdio: ["inherit", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";

  vitestProcess.stdout.on("data", data => {
    stdout += data.toString();
  });

  vitestProcess.stderr.on("data", data => {
    stderr += data.toString();
  });

  await new Promise((resolve, reject) => {
    vitestProcess.on("close", code => {
      if (code !== 0) {
        reject(new Error(`Vitest exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });

  // Combine stdout and stderr
  const output = stdout + stderr;
  const filteredLines = filterVitestOutput(output);

  // Output filtered lines
  if (filteredLines.length > 0) {
    console.log(filteredLines.join("\n"));
  }
}


// Run all benchmark tests
async function runBenchmarkTests(testsToRun, runAllTests, runAllTestsEnv) {
  const testSpinner = createSpinner(`Running ${testsToRun.length} test suite(s)...`);
  for (let index = 0; index < testsToRun.length; index++) {
    const test = testsToRun[index];
    await runSingleTest(test, index, testsToRun.length, runAllTests, runAllTestsEnv, testSpinner);
  }
  testSpinner.succeed(`Completed ${testsToRun.length} test suite(s)`);
}

export { isVitestRunning, handleRunningVitest, filterVitestOutput, runSingleTest, runBenchmarkTests };

