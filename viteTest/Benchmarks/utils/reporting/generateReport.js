// Enhanced script to generate a comprehensive benchmark report with PDF output
import { execSync, exec, spawn } from "child_process";
import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import { promisify } from "util";
import chalk from "chalk";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import chroma from "chroma-js";

const execAsync = promisify(exec);
import {
  getAllResults,
  getFlattenedResults,
  getSummary,
  clearResults,
  setTimestamp,
  saveResultsData,
} from "../data/collector.js";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "../data/results.js";
import { createSpinner } from "../logging/modernConsole.js";
import { generateHtmlReport } from "./generateHtml.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const benchmarkDir = join(__dirname, "../../../../Benchmark");

// Collect benchmark results from test execution
async function collectBenchmarkResults() {
  // Set timestamp
  setTimestamp(new Date().toISOString());

  // Get results from data collector
  // Note: Results are persisted to file by tests via addBenchmarkResult()
  const allResults = getAllResults();
  const flattened = getFlattenedResults();
  const summary = getSummary();

  return {
    all: allResults,
    flattened,
    summary,
    timestamp: allResults.timestamp,
  };
}

// Helper function to create chart labels
function createChartLabels(implementations) {
  const shortLabels = implementations.map(impl => {
    if (impl.includes("Production") || impl.includes("forEach")) return "Production";
    if (impl.includes("Maps") || impl.includes("map/filter")) return "Maps";
    return impl.length > 15 ? `${impl.substring(0, 15)}...` : impl;
  });

  const legendLabels = implementations.map(impl => {
    if (impl.includes("Production") || impl.includes("forEach")) return "Production";
    if (impl.includes("Maps") || impl.includes("map/filter")) return "Maps";
    return impl.split(" ")[0];
  });

  return { shortLabels, legendLabels };
}

// Helper function to get color palette using chroma-js
function getColorPalette() {
  // Generate colors using chroma-js for better color management
  const productionColor = chroma("#36a2eb"); // Blue
  const mapsColor = chroma("#ff6384"); // Red/Pink

  return [
    {
      bg: productionColor.alpha(0.6).css(),
      border: productionColor.css(),
      name: "Production",
    },
    {
      bg: mapsColor.alpha(0.6).css(),
      border: mapsColor.css(),
      name: "Maps",
    },
  ];
}

// Generate quick comparison chart
async function generateQuickComparisonChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  legendLabels,
  colors,
  implAverages,
) {
  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: shortLabels,
      datasets: [
        {
          label: "Average Execution Time (ms)",
          data: implAverages.map(impl => impl.avg),
          backgroundColor: implementations.map((_, index) => colors[index % colors.length].bg),
          borderColor: implementations.map((_, index) => colors[index % colors.length].border),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 80,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Quick Comparison - Average Execution Time",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            generateLabels: () => {
              return implementations.map((impl, index) => ({
                text: legendLabels[index],
                fillStyle: colors[index % colors.length].bg,
                strokeStyle: colors[index % colors.length].border,
                lineWidth: 2,
                padding: 8,
              }));
            },
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            font: { size: 8 },
            maxTicksLimit: 15,
            autoSkip: true,
          },
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Time (ms)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
          grid: {
            display: true,
          },
        },
      },
    },
  });
}

// Generate performance comparison chart by category
async function generatePerformanceChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  colors,
  flattened,
) {
  const categories = ["Search", "Ingredients", "Appliances", "Ustensils", "Combined"];
  const categoryAverages = categories.map(category => {
    const categoryResults = flattened.filter(r => r.category === category);
    if (categoryResults.length === 0) {
      return implementations.reduce((acc, impl) => {
        acc[impl] = 0;
        return acc;
      }, {});
    }

    const avgs = {};
    implementations.forEach(impl => {
      const implResults = categoryResults.filter(r => r.implementation === impl);
      avgs[impl] =
        implResults.length > 0
          ? implResults.reduce((sum, r) => sum + (r.mean || r.executionTime || 0), 0) /
            implResults.length
          : 0;
    });
    return avgs;
  });

  const validCategories = categories.filter((category, index) => {
    const avgs = categoryAverages[index];
    return implementations.some(impl => (avgs[impl] || 0) > 0);
  });

  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: validCategories,
      datasets: implementations.map((impl, index) => ({
        label: shortLabels[index],
        data: validCategories.map(category => {
          const catIndex = categories.indexOf(category);
          return categoryAverages[catIndex][impl] || 0;
        }),
        backgroundColor: colors[index % colors.length].bg,
        borderColor: colors[index % colors.length].border,
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 80,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Performance Comparison by Category",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 8 },
            maxTicksLimit: 10,
            autoSkip: true,
          },
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Time (ms)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
        },
      },
    },
  });
}

// Generate ranking chart
async function generateRankingChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  legendLabels,
  colors,
  implAverages,
) {
  const rankings = [...implAverages].sort((a, b) => a.avg - b.avg);

  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: rankings.map(item => {
        const index = implementations.indexOf(item.name);
        return index >= 0 ? shortLabels[index] : item.name;
      }),
      datasets: [
        {
          label: "Average Execution Time (ms)",
          data: rankings.map(item => item.avg),
          backgroundColor: rankings.map(item => {
            const index = implementations.indexOf(item.name);
            return index >= 0 ? colors[index % colors.length].bg : "rgba(75, 192, 192, 0.6)";
          }),
          borderColor: rankings.map(item => {
            const index = implementations.indexOf(item.name);
            return index >= 0 ? colors[index % colors.length].border : "rgba(75, 192, 192, 1)";
          }),
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 60,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Performance Ranking (Fastest to Slowest)",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            generateLabels: () => {
              return rankings.map(item => {
                const index = implementations.indexOf(item.name);
                return {
                  text: index >= 0 ? legendLabels[index] : item.name.split(" ")[0],
                  fillStyle:
                    index >= 0 ? colors[index % colors.length].bg : "rgba(75, 192, 192, 0.6)",
                  strokeStyle:
                    index >= 0 ? colors[index % colors.length].border : "rgba(75, 192, 192, 1)",
                  lineWidth: 2,
                  padding: 8,
                };
              });
            },
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Average Time (ms)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
        },
        y: {
          ticks: {
            font: { size: 9 },
          },
        },
      },
    },
  });
}

// Generate consistency chart (RME)
async function generateConsistencyChart(
  chartJSNodeCanvas,
  implementations,
  shortLabels,
  legendLabels,
  colors,
  flattened,
) {
  const rmeAverages = implementations.map(impl => getAverageRME(flattened, impl));

  return await chartJSNodeCanvas.renderToBuffer({
    type: "bar",
    data: {
      labels: shortLabels,
      datasets: [
        {
          label: "Average RME (%)",
          data: rmeAverages,
          backgroundColor: implementations.map((_, index) => colors[index % colors.length].bg),
          borderColor: implementations.map((_, index) => colors[index % colors.length].border),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 80,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Consistency Analysis (Lower RME = More Consistent)",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            generateLabels: () => {
              return implementations.map((impl, index) => ({
                text: legendLabels[index],
                fillStyle: colors[index % colors.length].bg,
                strokeStyle: colors[index % colors.length].border,
                lineWidth: 2,
                padding: 8,
              }));
            },
            boxWidth: 30,
            boxHeight: 18,
            padding: 15,
            font: { size: 11, weight: "bold" },
            usePointStyle: false,
            textAlign: "center",
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `RME: ${context.parsed.y.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            font: { size: 8 },
            maxTicksLimit: 15,
            autoSkip: true,
          },
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Relative Measurement Error (%)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
          },
        },
      },
    },
  });
}

// Generate improvement chart
async function generateImprovementChart(chartJSNodeCanvas, flattened) {
  // Group results by test case (category + testName)
  const testCases = {};
  flattened.forEach(result => {
    const key = `${result.category} - ${result.testName || result.testCase || "Unknown"}`;
    if (!testCases[key]) {
      testCases[key] = {};
    }
    testCases[key][result.implementation] = {
      time: result.mean || result.executionTime || 0,
      category: result.category,
      testName: result.testName || result.testCase || "Unknown",
    };
  });

  // Calculate improvement for each test case
  const improvementData = [];
  const labels = [];

  Object.entries(testCases).forEach(([key, implementations]) => {
    const productionTime = implementations["Production"]?.time || 0;
    const mapsTime = implementations["Maps"]?.time || 0;

    if (productionTime > 0 && mapsTime > 0) {
      // Calculate improvement: positive if Maps is faster, negative if Production is faster
      // Improvement = ((slower - faster) / slower) * 100
      const slower = Math.max(productionTime, mapsTime);
      const faster = Math.min(productionTime, mapsTime);
      const improvement = slower > 0 ? ((slower - faster) / slower) * 100 : 0;

      // Make it positive if Maps is faster, negative if Production is faster
      const improvementValue = mapsTime < productionTime ? improvement : -improvement;

      improvementData.push(improvementValue);

      // Create a short label for the test
      const testName =
        implementations["Production"]?.testName || implementations["Maps"]?.testName || key;
      const shortName = testName.length > 30 ? `${testName.substring(0, 27)}...` : testName;
      labels.push(shortName);
    }
  });

  if (improvementData.length === 0 || !improvementData.some(imp => imp !== 0)) {
    return null;
  }

  return await chartJSNodeCanvas.renderToBuffer({
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Maps vs Production (%)",
          data: improvementData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 10,
          bottom: 70,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Performance Improvement: Maps vs Production",
          font: { size: 13 },
        },
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          fullSize: true,
          labels: {
            font: { size: 11, weight: "bold" },
            padding: 15,
            boxWidth: 30,
            boxHeight: 18,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed.y;
              const sign = value >= 0 ? "+" : "";
              return `${sign}${value.toFixed(2)}% ${value >= 0 ? "(Maps faster)" : "(Production faster)"}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 9 },
            maxTicksLimit: 20,
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Improvement % (positive = Maps faster)",
            font: { size: 11 },
          },
          ticks: {
            font: { size: 9 },
            callback(value) {
              return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
            },
          },
        },
      },
    },
  });
}

// Generate charts using Chart.js
async function generateCharts(results) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1200, height: 400 });
  const charts = {};
  const flattened = results.flattened || [];

  if (flattened.length === 0) {
    return charts;
  }

  const implementations = getImplementations(flattened);
  const { shortLabels, legendLabels } = createChartLabels(implementations);
  const colors = getColorPalette();
  const implAverages = implementations.map(impl => ({
    name: impl,
    avg: getAverageExecutionTime(flattened, impl),
  }));

  charts.quickComparison = await generateQuickComparisonChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    legendLabels,
    colors,
    implAverages,
  );

  charts.performance = await generatePerformanceChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    colors,
    flattened,
  );

  charts.ranking = await generateRankingChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    legendLabels,
    colors,
    implAverages,
  );

  charts.consistency = await generateConsistencyChart(
    chartJSNodeCanvas,
    implementations,
    shortLabels,
    legendLabels,
    colors,
    flattened,
  );

  const improvementChart = await generateImprovementChart(chartJSNodeCanvas, flattened);
  if (improvementChart) {
    charts.improvement = improvementChart;
  }

  return charts;
}

// Generate HTML report using the enhanced HTML generator
function generateHTMLReport(results, charts) {
  return generateHtmlReport(results, charts);
}

// Clean up existing benchmark files
function cleanupBenchmarkFiles() {
  try {
    if (existsSync(benchmarkDir)) {
      const files = readdirSync(benchmarkDir);
      const filesToDelete = files.filter(
        file => file.endsWith(".html"),
        // Note: .json file is handled by clearResults() separately
      );

      if (filesToDelete.length > 0) {
        console.log(`\nCleaning up ${filesToDelete.length} existing benchmark file(s)...`);
        filesToDelete.forEach(file => {
          const filePath = join(benchmarkDir, file);
          try {
            unlinkSync(filePath);
            console.log(`  ✓ Deleted: ${file}`);
          } catch (error) {
            console.warn(`  ⚠ Failed to delete ${file}: ${error.message}`);
          }
        });
      }
    }
  } catch (error) {
    console.warn(`⚠ Warning: Could not clean up benchmark files: ${error.message}`);
  }
}

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

// Prompt user for yes/no question with modern styling
function askQuestion(question) {
  return new Promise(resolve => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(chalk.cyan(`\n${question} ${chalk.dim("(yes/no)")}: `), answer => {
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

    rl.question(chalk.cyan(`\n${question} ${chalk.dim(`(${options.join("/")})`)}: `), answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Format duration in a human-readable way
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Display header banner
function displayHeader() {
  console.log(`\n${chalk.bold(chalk.cyan(`╔${"═".repeat(58)}╗`))}`);
  console.log(
    chalk.bold(chalk.cyan(`║${" ".repeat(15)}BENCHMARK REPORT GENERATOR${" ".repeat(18)}║`)),
  );
  console.log(chalk.bold(chalk.cyan(`╚${"═".repeat(58)}╝`)));
}

// Initialize benchmark process (cleanup and setup)
async function initializeBenchmark() {
  const cleanupSpinner = createSpinner("Cleaning up existing benchmark files...");
  cleanupBenchmarkFiles();
  cleanupSpinner.succeed("Cleaned up existing benchmark files");

  const clearSpinner = createSpinner("Clearing previous benchmark results...");
  clearResults();
  clearSpinner.succeed("Cleared previous benchmark results");

  await handleRunningVitest();
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
      console.log(chalk.green("✓ 'All' tests will be included (CI mode)"));
    } else {
      console.log(chalk.dim("⊘ 'All' tests will be skipped (CI mode)"));
    }

    // Store the "All" tests preference in results
    const allResults = getAllResults();
    allResults.runAllTests = runAllTests;
    saveResultsData(allResults);

    return { runAllTests, runAllTestsEnv };
  }

  // Interactive mode: prompt user
  console.log(`\n${chalk.yellow("⚠️  Note:")} 'All' tests benchmark every available filter value`);
  console.log(chalk.dim("   (ingredients, appliances, ustensils) - up to 10 min each."));
  console.log(chalk.dim("   If skipped, they will be marked as 'skipped' in the report."));
  const runAllTests = await askQuestion("Do you want to run the 'All' tests?");
  const runAllTestsEnv = runAllTests ? "true" : "false";

  if (runAllTests) {
    console.log(chalk.green("✓ 'All' tests will be included"));
  } else {
    console.log(chalk.dim("⊘ 'All' tests will be skipped"));
  }

  // Store the "All" tests preference in results
  const allResults = getAllResults();
  allResults.runAllTests = runAllTests;
  saveResultsData(allResults);

  return { runAllTests, runAllTestsEnv };
}

// Get list of tests to run based on command line arguments
function getTestsToRun() {
  const testFiles = process.argv.slice(2);
  const allTests = [
    { name: "Search", file: "viteTest/Benchmarks/search.test.js" },
    { name: "Ingredients", file: "viteTest/Benchmarks/filterByIngredients.test.js" },
    { name: "Appliances", file: "viteTest/Benchmarks/filterByAppliances.test.js" },
    { name: "Ustensils", file: "viteTest/Benchmarks/filterByUstensils.test.js" },
  ];

  const testsToRun =
    testFiles.length > 0
      ? allTests.filter(test => testFiles.some(arg => test.file.includes(arg)))
      : allTests;

  if (testsToRun.length === 0) {
    console.error("No matching test files found. Available tests:");
    allTests.forEach(test => console.error(`  - ${test.file}`));
    process.exit(1);
  }

  return testsToRun;
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

// Generate and save the report
async function generateAndSaveReport(results, testsToRun) {
  const chartsSpinner = createSpinner("Generating charts...");
  const chartsResult = await generateCharts(results);
  if (Object.keys(chartsResult).length === 0) {
    chartsSpinner.warn("No charts generated - no data available");
  } else {
    chartsSpinner.succeed(`Generated ${Object.keys(chartsResult).length} chart(s)`);
  }

  const htmlSpinner = createSpinner("Generating HTML report...");
  const html = await generateHTMLReport(results, chartsResult);
  htmlSpinner.succeed("Generated HTML report");

  mkdirSync(benchmarkDir, { recursive: true });
  const reportSuffix =
    testsToRun.length === 1 ? testsToRun[0].name.toLowerCase().replace(/\s+/g, "-") : "all";
  const htmlPath = join(benchmarkDir, `benchmark-report-${reportSuffix}.html`);
  writeFileSync(htmlPath, html, "utf-8");

  return htmlPath;
}

// Display final summary and optionally open report
async function finalizeReport(htmlPath, startTime) {
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  const formattedDuration = formatDuration(totalDuration);

  console.log(`\n${chalk.bold(chalk.green(`╔${"═".repeat(58)}╗`))}`);
  console.log(
    chalk.bold(chalk.green(`║${" ".repeat(12)}REPORT GENERATION COMPLETED${" ".repeat(20)}║`)),
  );
  console.log(chalk.bold(chalk.green(`╚${"═".repeat(58)}╝`)));
  console.log(`${chalk.green("\n✓ HTML Report:")} ${chalk.cyan(htmlPath)}`);
  console.log(chalk.dim(`   Total Duration: ${chalk.bold(formattedDuration)}`));

  // Skip browser opening prompt in CI environment
  const isCI = process.env.CI === "true";
  if (isCI) {
    console.log(chalk.dim("\n   Browser opening skipped (CI mode)"));
    console.log(chalk.dim("   Report saved. You can download it from CI artifacts."));
    console.log(chalk.cyan(`   ${htmlPath}`));
    return;
  }

  const openReport = await askQuestion("\nDo you want to open the report in your browser?");
  if (openReport) {
    const openSpinner = createSpinner("Opening report in browser...");
    try {
      const platform = process.platform;
      let command;

      if (platform === "win32") {
        command = `start "" "${htmlPath}"`;
      } else if (platform === "darwin") {
        command = `open "${htmlPath}"`;
      } else {
        command = `xdg-open "${htmlPath}"`;
      }

      execSync(command, { stdio: "ignore" });
      openSpinner.succeed("Report opened in browser");
      console.log(chalk.cyan("\n👋 Bye bye!"));
    } catch (_error) {
      openSpinner.warn("Could not open report automatically");
      console.log(chalk.dim(`   Please open manually: ${htmlPath}`));
      console.log(chalk.cyan("\n👋 Bye bye!"));
    }
  } else {
    console.log(chalk.dim("   Report saved. You can open it later at:"));
    console.log(chalk.cyan(`   ${htmlPath}`));
    console.log(chalk.cyan("\n👋 Bye bye!"));
  }
}

// Clean up temporary files
function cleanupTempFiles() {
  const tempDir = join(tmpdir(), "lespetitplats-benchmark");
  const jsonFilePath = join(tempDir, "benchmark-results.json");
  if (existsSync(jsonFilePath)) {
    try {
      unlinkSync(jsonFilePath);
    } catch (_error) {
      // Ignore cleanup errors
    }
  }
}

// Main execution
async function main() {
  const startTime = Date.now();
  displayHeader();

  try {
    await initializeBenchmark();
    const { runAllTests, runAllTestsEnv } = await promptForAllTests();
    const testsToRun = getTestsToRun();

    await runBenchmarkTests(testsToRun, runAllTests, runAllTestsEnv);

    const collectSpinner = createSpinner("Collecting benchmark results...");
    const results = await collectBenchmarkResults();
    collectSpinner.succeed("Collected benchmark results");

    if (results.flattened.length === 0) {
      console.log(chalk.yellow("\n⚠ Warning: No benchmark results found."));
      console.log(
        chalk.dim("Tests need to be modified to use addBenchmarkResult() from collector.js"),
      );
      console.log(chalk.dim("For now, generating report with empty data structure...\n"));
    }

    const htmlPath = await generateAndSaveReport(results, testsToRun);
    await finalizeReport(htmlPath, startTime);
    cleanupTempFiles();
  } catch (error) {
    console.error("Error generating benchmark report:", error.message);
    process.exit(1);
  }
}

main();
