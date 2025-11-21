// HTML generation utilities for benchmark reports
import { readFileSync } from "fs";
import { cpus } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { format } from "date-fns";
import jsBeautify from "js-beautify";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { bare as markdownItEmoji } from "markdown-it-emoji";
import markdownItFootnote from "markdown-it-footnote";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import markdownItToc from "markdown-it-table-of-contents";
import markdownItTaskLists from "markdown-it-task-lists";
import { marked } from "marked";
import moment from "moment";
import numeral from "numeral";
import prettier from "prettier";

const { html: beautifyHtml } = jsBeautify;
import { benchmarkData } from "../data/paths.js";
import {
  getAverageExecutionTime,
  getAverageRME,
  getImplementations,
  organizeByCategory,
  getTestCoverage,
} from "../data/results.js";
import {
  BENCHMARK_TIME,
  MAX_ITERATIONS,
  WARMUP_TIME,
  WARMUP_ITERATIONS,
} from "../measurement/measurement.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate table of contents HTML
export function generateTableOfContents() {
  return `
    <nav class="toc">
      <h2>Table of Contents</h2>
      <ul>
        <li><a href="#executive-summary">Executive Summary</a></li>
        <li><a href="#benchmark-data">Benchmark Data</a></li>
        <li><a href="#test-coverage-summary">Test Coverage</a></li>
        <li><a href="#quick-comparison">Quick Comparison</a></li>
        <li><a href="#performance-comparison">Performance by Category</a></li>
        <li><a href="#performance-ranking">Ranking</a></li>
        <li><a href="#consistency-analysis">Consistency (RME)</a></li>
        <li><a href="#performance-improvement">Improvement Trend</a></li>
        <li><a href="#detailed-test-results">Test Results</a></li>
        <li><a href="#detailed-implementation-breakdown">Implementation Breakdown</a></li>
        <li><a href="#methodology-measurement-notes">Methodology</a></li>
        <li><a href="#key-insights-recommendations">Analysis</a></li>
      </ul>
    </nav>
  `;
}

// Generate key findings section
export function generateKeyFindings(flattened, summary) {
  if (flattened.length === 0) {
    return '<div class="key-findings"><p>No benchmark data available.</p></div>';
  }

  const implementations = getImplementations(flattened);
  const totalTests = summary.totalTests || 0;
  const overallWinner = summary.overallWinner || "N/A";
  const averageImprovement = summary.averageImprovement || 0;
  const winCounts = summary.winCounts || {};

  // Calculate average execution times for each implementation
  const implStats = implementations.map(impl => ({
    name: impl,
    avgTime: getAverageExecutionTime(flattened, impl),
    avgRME: getAverageRME(flattened, impl),
    wins: winCounts[impl] || 0,
  }));

  // Find most consistent (lowest RME)
  const mostConsistent = implStats.reduce((prev, current) =>
    prev.avgRME < current.avgRME ? prev : current,
  );

  // Find fastest overall
  const fastest = implStats.reduce((prev, current) =>
    prev.avgTime < current.avgTime ? prev : current,
  );

  // Calculate win percentage
  const winnerWins = winCounts[overallWinner] || 0;
  const winPercentage =
    totalTests > 0 ? numeral((winnerWins / totalTests) * 100).format("0.0") : "0.0";

  // Find significant performance gaps
  const sortedByTime = [...implStats].sort((a, b) => a.avgTime - b.avgTime);
  const gaps = [];
  for (let i = 0; i < sortedByTime.length - 1; i++) {
    const current = sortedByTime[i];
    const next = sortedByTime[i + 1];
    const gap =
      current.avgTime > 0 ? ((next.avgTime - current.avgTime) / current.avgTime) * 100 : 0;
    if (gap > 20) {
      gaps.push({
        from: current.name,
        to: next.name,
        gap: numeral(gap).format("0.0"),
      });
    }
  }

  const slowest = sortedByTime[sortedByTime.length - 1];

  return `
    <div class="key-findings">
      <div class="findings-grid">
        <div class="finding-card">
          <h4>Overall Winner</h4>
          <p class="finding-value">${overallWinner}</p>
          <p class="finding-detail">Wins ${winnerWins} of ${totalTests} tests (${winPercentage}%)</p>
        </div>
        <div class="finding-card">
          <h4>Avg Improvement</h4>
          <p class="finding-value">${numeral(averageImprovement).format("0.0")}%</p>
          <p class="finding-detail">${fastest.name} vs ${slowest.name}</p>
        </div>
        <div class="finding-card">
          <h4>Most Consistent</h4>
          <p class="finding-value">${mostConsistent.name}</p>
          <p class="finding-detail">RME: ${numeral(mostConsistent.avgRME).format("0.00")}%</p>
        </div>
        <div class="finding-card">
          <h4>Fastest</h4>
          <p class="finding-value">${fastest.name}</p>
          <p class="finding-detail">${numeral(fastest.avgTime).format("0.00")}ms avg</p>
        </div>
        ${
          gaps.length > 0
            ? `
        <div class="finding-card finding-card-wide">
          <h4>Performance Gaps</h4>
          <ul>
            ${gaps.map(gap => `<li>${gap.from} → ${gap.to}: +${gap.gap}%</li>`).join("")}
          </ul>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

// Generate benchmark data statistics section
export function generateBenchmarkDataStats() {
  const data = benchmarkData;
  const totalRecipes = data.length;

  // Collect unique values
  const ingredients = new Set();
  const appliances = new Set();
  const ustensils = new Set();
  let totalIngredients = 0;

  data.forEach(recipe => {
    if (recipe.appliance) {
      appliances.add(recipe.appliance);
    }
    if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
      recipe.ustensils.forEach(ustensil => ustensils.add(ustensil));
    }
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach(ingredient => {
        const ingredientName = ingredient.ingredient || ingredient.name;
        if (ingredientName) {
          ingredients.add(ingredientName);
          totalIngredients++;
        }
      });
    }
  });

  return `
    <div class="benchmark-data-stats">
      <div class="coverage-grid">
        <div class="coverage-card">
          <h4>Total Recipes</h4>
          <p class="coverage-value">${totalRecipes}</p>
        </div>
        <div class="coverage-card">
          <h4>Unique Ingredients</h4>
          <p class="coverage-value">${ingredients.size}</p>
        </div>
        <div class="coverage-card">
          <h4>Unique Appliances</h4>
          <p class="coverage-value">${appliances.size}</p>
        </div>
        <div class="coverage-card">
          <h4>Unique Ustensils</h4>
          <p class="coverage-value">${ustensils.size}</p>
        </div>
        <div class="coverage-card">
          <h4>Total Ingredients</h4>
          <p class="coverage-value">${totalIngredients}</p>
          <p class="coverage-detail">Across all recipes</p>
        </div>
      </div>
    </div>
  `;
}

// Generate test coverage section
export function generateTestCoverage(flattened, _allResults) {
  const categoryResults = organizeByCategory(flattened);
  const coverage = getTestCoverage(categoryResults);
  const implementations = getImplementations(flattened);

  // Calculate additional metrics
  const iterationsPerTest = 50; // Standard iterations per test
  const totalBenchmarkRuns = coverage.totalTests * implementations.length * iterationsPerTest;
  const totalCategories = Object.keys(coverage.categoryBreakdown).length;

  // Count test types (performance vs memory tests)
  const performanceTests =
    coverage.totalTests -
    Object.values(categoryResults).reduce((sum, tests) => {
      return (
        sum +
        Object.keys(tests).filter(testName => testName.toLowerCase().includes("memory")).length
      );
    }, 0);
  const memoryTests = coverage.totalTests - performanceTests;

  return `
    <div class="test-coverage">
      <div class="coverage-grid">
        <div class="coverage-card">
          <h4>Test Cases</h4>
          <p class="coverage-value">${coverage.totalTests}</p>
          <p class="coverage-detail">${performanceTests} performance, ${memoryTests} memory</p>
        </div>
        <div class="coverage-card">
          <h4>Scenarios</h4>
          <p class="coverage-value">${coverage.totalScenarios}</p>
          <p class="coverage-detail">Tests × Implementations</p>
        </div>
        <div class="coverage-card">
          <h4>Implementations</h4>
          <p class="coverage-value">${implementations.length}</p>
          <p class="coverage-detail">Production & Maps</p>
        </div>
        <div class="coverage-card">
          <h4>Categories</h4>
          <p class="coverage-value">${totalCategories}</p>
          <p class="coverage-detail">Search, Ingredients, Appliances, Ustensils</p>
        </div>
        <div class="coverage-card">
          <h4>Iterations</h4>
          <p class="coverage-value">${iterationsPerTest}</p>
          <p class="coverage-detail">Per test case</p>
        </div>
        <div class="coverage-card">
          <h4>Total Runs</h4>
          <p class="coverage-value">${totalBenchmarkRuns.toLocaleString()}</p>
          <p class="coverage-detail">Approximate benchmark executions</p>
        </div>
        <div class="coverage-card coverage-card-wide">
          <h4>By Category</h4>
          <div class="category-list-row">
            ${Object.entries(coverage.categoryBreakdown)
              .map(
                ([category, count]) =>
                  `<span class="category-item"><strong>${category}:</strong> ${count} tests</span>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate chart HTML section
export function generateChartSection(charts, chartKey, chartName, pageBreakBefore = false) {
  if (!charts[chartKey]) {
    return "";
  }

  const pageBreakClass = pageBreakBefore ? " page-break-before" : "";

  return `
    <div class="chart-section${pageBreakClass}">
      <div class="chart">
        <img src="data:image/png;base64,${charts[chartKey].toString("base64")}" alt="${chartName}" />
      </div>
    </div>
  `;
}

// Generate detailed implementation breakdown section
export function generateImplementationBreakdown(flattened, summary) {
  if (flattened.length === 0) {
    return "<p>No benchmark data available.</p>";
  }

  const implementations = getImplementations(flattened);
  const winCounts = summary.winCounts || {};
  const totalTests = summary.totalTests || 0;

  // Create short labels for implementations
  const getShortLabel = impl => {
    if (impl.includes("Production") || impl.includes("forEach")) return "Production";
    if (impl.includes("Maps") || impl.includes("map/filter")) return "Maps";
    return impl.length > 20 ? `${impl.substring(0, 20)}...` : impl;
  };

  // Calculate detailed stats for each implementation
  const implDetails = implementations.map(impl => {
    const implResults = flattened.filter(r => r.implementation === impl);
    const avgTime = getAverageExecutionTime(flattened, impl);
    const avgRME = getAverageRME(flattened, impl);
    const wins = winCounts[impl] || 0;
    const winPercentage = totalTests > 0 ? numeral((wins / totalTests) * 100).format("0.0") : "0.0";

    // Calculate min, max from all results
    const times = implResults
      .map(r => getSafeNumber(r.mean || r.executionTime || 0))
      .filter(t => t > 0);
    const minTime = times.length > 0 ? Math.min(...times) : 0;
    const maxTime = times.length > 0 ? Math.max(...times) : 0;

    return {
      name: impl,
      shortName: getShortLabel(impl),
      avgTime,
      avgRME,
      wins,
      winPercentage,
      minTime,
      maxTime,
      totalRuns: implResults.length,
    };
  });

  // Sort by average time (fastest first)
  implDetails.sort((a, b) => a.avgTime - b.avgTime);

  return `
    <div class="implementation-breakdown">
      <div class="table-wrapper">
        <table class="implementation-table">
          <tr>
            <th>Rank</th>
            <th>Implementation</th>
            <th>Avg Time (ms)</th>
            <th>Min (ms)</th>
            <th>Max (ms)</th>
            <th>RME (%)</th>
            <th>Wins</th>
            <th>Win %</th>
          </tr>
          ${implDetails
            .map(
              (impl, index) => `
          <tr class="${index === 0 ? "fastest-row" : index === 1 ? "second-row" : ""}">
            <td><strong>#${index + 1}</strong>${index === 0 ? ' <span class="badge">Fastest</span>' : index === 1 ? ' <span class="badge badge-second">Second</span>' : ""}</td>
            <td title="${impl.name}"><strong>${impl.shortName}</strong></td>
            <td>${formatFriendlyTime(getSafeNumber(impl.avgTime), false)}</td>
            <td>${formatFriendlyTime(getSafeNumber(impl.minTime), false)}</td>
            <td>${formatFriendlyTime(getSafeNumber(impl.maxTime), false)}</td>
            <td>${numeral(getSafeNumber(impl.avgRME)).format("0.00")}%</td>
            <td>${impl.wins}/${totalTests}</td>
            <td>${impl.winPercentage}%</td>
          </tr>
          `,
            )
            .join("")}
        </table>
      </div>
    </div>
  `;
}

// Generate methodology and measurement notes section using markdown
export function generateMethodologyNotes() {
  // Get system information
  const nodeVersion = process.version;
  const platform = process.platform;
  const arch = process.arch;
  const cpuCount = cpus().length;

  // Format OS name nicely
  const osNames = {
    darwin: "macOS",
    linux: "Linux",
    win32: "Windows",
  };
  const osName = osNames[platform] || platform;

  // Get memory limit from NODE_OPTIONS
  const nodeOptions = process.env.NODE_OPTIONS || "";
  const memoryMatch = nodeOptions.match(/--max-old-space-size=(\d+)/);
  const memoryLimit = memoryMatch ? `${parseInt(memoryMatch[1]) / 1024}GB` : "Default";

  // Get Vitest version from package.json
  let vitestVersion = "N/A";
  try {
    const packageJsonPath = join(dirname(__filename), "../../../../package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    vitestVersion =
      packageJson.devDependencies?.vitest || packageJson.dependencies?.vitest || "N/A";
    // Remove ^ or ~ prefix if present
    vitestVersion = vitestVersion.replace(/^[\^~]/, "");
  } catch (_error) {
    // If we can't read package.json, keep N/A
  }

  const markdownContent = `
## Benchmark Methodology

### Framework

- **Framework:** Vite
- **Test Runner:** Vitest ${vitestVersion}
- **Tool:** TinyBench
- **Duration:** ${BENCHMARK_TIME}ms/test
- **Warmup:** ${WARMUP_TIME}ms (${WARMUP_ITERATIONS} iter)
- **Max Iter:** ${MAX_ITERATIONS}/test
- **Unit:** ms
- **Node.js Version:** ${nodeVersion}
- **Operating System:** ${osName}
- **CPU Cores:** ${cpuCount}
- **CPU Architecture:** ${arch}
- **Memory Limit:** ${memoryLimit}

### Metrics

- **Mean:** Average execution time across all iterations
- **Min/Max:** Best and worst case execution times
- **RME:** Relative Measurement Error

### Categories

- **Search:** Text-based recipe search functionality
- **Ingredients:** Filtering recipes by ingredient criteria
- **Appliances:** Filtering recipes by appliance requirements
- **Ustensils:** Filtering recipes by utensil needs

### Implementations

This benchmark compares two implementation approaches:

- **Production:** A traditional implementation using \`forEach\` loops for iteration and filtering operations
- **Maps:** A modern implementation leveraging \`map\` and \`filter\` array methods for functional programming patterns

### Process

Each benchmark follows a standardized measurement protocol:

1. **Warmup Phase:** ${WARMUP_ITERATIONS} iterations are executed over ${WARMUP_TIME}ms to eliminate JIT compilation effects and ensure consistent performance measurements.

2. **Execution Phase:** Multiple timed iterations (up to ${MAX_ITERATIONS} per test) are executed over ${BENCHMARK_TIME}ms to collect statistically significant performance data.

3. **Analysis:** Results are analyzed to calculate mean execution time, minimum/maximum values, and Relative Measurement Error (RME) to assess consistency and reliability.

4. **Ranking:** Implementations are ranked by their average execution time, with the fastest implementation identified as the winner for each test scenario.

> **Note:** Results may vary based on system load, CPU architecture, and Node.js version. Always test on target production environments before making implementation decisions.
  `.trim();

  // Convert markdown to HTML using marked
  const htmlContent = marked(markdownContent, {
    gfm: true, // GitHub Flavored Markdown
    breaks: false,
    headerIds: true,
    mangle: false,
  });

  return `
    <div class="methodology-notes">
      <div class="methodology-content markdown-content">
        ${htmlContent}
      </div>
    </div>
  `;
}

// Generate key insights and recommendations section
export function generateInsightsAndRecommendations(flattened, summary) {
  if (flattened.length === 0) {
    return "<p>No benchmark data available for analysis.</p>";
  }

  const implementations = getImplementations(flattened);
  const overallWinner = summary.overallWinner || "N/A";
  const averageImprovement = summary.averageImprovement || 0;
  const winCounts = summary.winCounts || {};

  // Calculate detailed stats
  const implStats = implementations.map(impl => ({
    name: impl,
    avgTime: getAverageExecutionTime(flattened, impl),
    avgRME: getAverageRME(flattened, impl),
    wins: winCounts[impl] || 0,
  }));

  const sortedByTime = [...implStats].sort((a, b) => a.avgTime - b.avgTime);
  const fastest = sortedByTime[0];
  const slowest = sortedByTime[sortedByTime.length - 1];
  const mostConsistent = [...implStats].sort((a, b) => a.avgRME - b.avgRME)[0];

  // Calculate performance gaps
  const performanceGap =
    fastest.avgTime > 0
      ? numeral(((slowest.avgTime - fastest.avgTime) / fastest.avgTime) * 100).format("0.0")
      : 0;

  // Generate recommendations
  const recommendations = [];

  if (fastest.name.includes("Maps")) {
    recommendations.push({
      type: "performance",
      title: "Maps Implementation Faster",
      description: `**${fastest.name}** shows **${performanceGap}%** better performance. Consider map-based implementations for optimal speed.`,
    });
  }

  if (fastest.name.includes("Production")) {
    recommendations.push({
      type: "maintainability",
      title: "Production Offers Good Balance",
      description:
        "`forEach`-based implementation provides competitive performance with better readability. Use if performance differences are within acceptable thresholds.",
    });
  }

  if (mostConsistent.avgRME < 5) {
    recommendations.push({
      type: "reliability",
      title: "High Consistency",
      description: `**${mostConsistent.name}** shows excellent consistency (RME: **${numeral(mostConsistent.avgRME).format("0.00")}%**), making it highly reliable for production environments.`,
    });
  }

  if (averageImprovement > 50) {
    recommendations.push({
      type: "optimization",
      title: "Significant Gains Available",
      description: `**${numeral(averageImprovement).format("0.0")}%** average improvement suggests significant optimization opportunities. Consider faster approaches for better performance.`,
    });
  }

  recommendations.push({
    type: "general",
    title: "Context-Specific Optimization",
    description:
      "Performance characteristics vary by use case. **Evaluate your specific workload** to determine the most effective implementation strategy.",
  });

  recommendations.push({
    type: "general",
    title: "Monitor Production Performance",
    description:
      "Benchmark results provide guidance, but **production performance** may differ. Monitor actual metrics and adjust your implementation strategy based on real-world usage patterns.",
  });

  return `
    <div class="insights-recommendations">
      <h3>Summary</h3>
      <div class="insights-content">
        <div class="insight-card">
          <h4>Performance Leader</h4>
          <p><strong>${overallWinner}</strong> wins ${winCounts[overallWinner] || 0}/${summary.totalTests || 0} tests.</p>
          <p>Avg time: <strong>${formatFriendlyTime(fastest.avgTime, true)}</strong></p>
        </div>

        <div class="insight-card">
          <h4>Performance Range</h4>
          <p><strong>${fastest.name}</strong> is <strong>${performanceGap}%</strong> faster than <strong>${slowest.name}</strong>.</p>
          <p>${formatFriendlyTime(fastest.avgTime, true).replace(/^< /, "")} vs ${formatFriendlyTime(slowest.avgTime, true).replace(/^< /, "")}</p>
        </div>

        <div class="insight-card">
          <h4>Consistency</h4>
          <p><strong>${mostConsistent.name}</strong> most consistent: RME <strong>${numeral(mostConsistent.avgRME).format("0.00")}%</strong>.</p>
        </div>

        <div class="insight-card">
          <h4>Improvement Potential</h4>
          <p>Average performance gap: <strong>${numeral(averageImprovement).format("0.0")}%</strong></p>
          <p>Switching to <strong>${fastest.name}</strong> could provide up to <strong>${numeral(averageImprovement).format("0.0")}%</strong> improvement.</p>
        </div>
      </div>

      <h3>Analysis</h3>
      <div class="recommendations-content">
        ${recommendations
          .map((rec, index) => {
            const renderedDescription = renderMarkdown(rec.description);
            // Remove wrapping <p> tags and clean up any undefined text
            let cleanedDescription = renderedDescription.replace(/undefined/g, "").trim();

            // Remove opening <p> tag (with optional attributes) and any leading whitespace
            cleanedDescription = cleanedDescription.replace(/^<p[^>]*>\s*/i, "");
            // Remove closing </p> tag and any trailing whitespace/newlines
            cleanedDescription = cleanedDescription.replace(/\s*<\/p>\s*$/i, "");

            return `
          <div class="recommendation-card recommendation-${rec.type}">
            <h4>${index + 1}. ${rec.title}</h4>
            <p>${cleanedDescription}</p>
          </div>
        `;
          })
          .join("")}
      </div>

      <div class="conclusion">
        ${generateExecutiveSummaryMarkdown(summary, overallWinner)}
      </div>
    </div>
  `;
}

// Initialize markdown-it instance for additional markdown rendering with plugins
const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  breaks: false, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
  typographer: true, // Enable some language-neutral replacement + quotes beautification
})
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
    level: [2, 3, 4],
  })
  .use(markdownItToc, {
    includeLevel: [2, 3, 4],
    containerClass: "table-of-contents",
    containerHeaderHtml: "<h3>Table of Contents</h3>",
  })
  .use(markdownItTaskLists, {
    enabled: true,
    label: true,
    labelAfter: true,
  })
  .use(markdownItEmoji)
  .use(markdownItFootnote)
  .use(markdownItSub)
  .use(markdownItSup);

// Helper function to render markdown using markdown-it
function renderMarkdown(markdownText) {
  return md.render(markdownText);
}

// Generate Executive Summary using markdown-it with enhanced features
function generateExecutiveSummaryMarkdown(summary, overallWinner) {
  const markdownContent = `
### Executive Summary

Based on comprehensive performance analysis across **${summary.totalTests || 0}** test scenarios, **${overallWinner}** demonstrates superior performance characteristics and is recommended for production deployment. This implementation provides an optimal balance of execution speed, measurement consistency, and operational reliability.

#### Implementation Guidelines

- **Production: forEach** — Recommended for scenarios prioritizing code maintainability and readability, where performance differences are within acceptable thresholds.

- **Maps: map/filter** — Recommended for high-performance requirements, particularly in multi-filter scenarios and data-intensive operations where execution speed is critical.

> *These recommendations are based on quantitative analysis of execution times, relative measurement error (RME), and win rates across all benchmark categories. Consider specific use case requirements and performance targets when selecting an implementation strategy.*

#### Key Metrics

**Total Tests:** ${summary.totalTests || 0} • **Winner:** ${overallWinner} • **Performance Gap:** ${summary.averageImprovement ? numeral(summary.averageImprovement).format("0.0") : "N/A"}%

<small>*All metrics are calculated from actual benchmark execution data.*</small>
  `.trim();

  const rendered = renderMarkdown(markdownContent);
  // Remove "undefined" text that markdown-it-emoji plugin adds
  return rendered.replace(/undefined/g, "");
}

// Generate note about skipped "All" tests
function generateSkippedTestsNote(allResults) {
  const runAllTests = allResults.runAllTests;
  if (runAllTests === false) {
    return `
      <div class="skipped-tests-note" style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 12px; margin: 20px 0;">
        <p><strong>⚠️ Note:</strong> "All" tests were skipped. Run the benchmark again and answer "yes" to include them.</p>
      </div>
    `;
  }
  return "";
}

// Helper to ensure a value is a safe number, converting invalid to 0
function getSafeNumber(value) {
  const num = Number(value);
  return typeof num === "number" && !isNaN(num) && isFinite(num) ? num : 0;
}

// Format time value in a friendly way
function formatFriendlyTime(timeValue, includeUnit = true) {
  // Check for NaN or invalid values
  if (typeof timeValue !== "number" || isNaN(timeValue) || !isFinite(timeValue)) {
    return "N/A";
  }

  // For very small values (essentially zero), show friendly message
  if (timeValue < 0.0001) {
    return includeUnit ? "< 0.0001ms" : "< 0.0001";
  }

  // Format normally for other values
  const formatted = numeral(timeValue).format("0.0000");
  return includeUnit ? `${formatted}ms` : formatted;
}

// Format date in a friendly way using date-fns and moment
function formatFriendlyDate(timestamp) {
  if (!timestamp) {
    timestamp = new Date().toISOString();
  }

  const date = new Date(timestamp);

  // Use date-fns for primary formatting
  const dateFnsFormatted = format(date, "MMMM d, yyyy 'at' h:mm a");

  // Use moment for relative time (e.g., "2 hours ago")
  const momentRelative = moment(date).fromNow();

  // Combine both for richer date information
  return `${dateFnsFormatted} (${momentRelative})`;
}

// Helper function to get Lucide icon SVG string
function getLucideIconSVG(iconName, size = 24, color = "currentColor", className = "") {
  try {
    // Common Lucide icons used in reports
    const iconMap = {
      Calendar: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      Clock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
      TrendingUp: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
      BarChart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>`,
      CheckCircle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
      AlertCircle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    };

    return iconMap[iconName] || "";
  } catch (_error) {
    return ""; // Return empty on error
  }
}

// Calculate average query/filter count for summary row
function calculateAverageQueryOrFilterCount(testNames, uniqueTests, implementations, tests) {
  let avgQueryOrFilterCount = "-";
  const queryOrFilterCounts = [];

  testNames.forEach(testName => {
    const impls = uniqueTests.get(testName);
    if (!impls) return;

    // Try to find queryCount/filterCount from any implementation
    let count = null;
    for (const impl of implementations) {
      if (impls[impl]) {
        count = impls[impl].queryCount ?? impls[impl].filterCount;
        if (count !== undefined && count !== null && count !== "N/A") {
          break;
        }
      }
    }
    // If still not found, check the original test data
    if (count === null || count === undefined) {
      const testData = tests[testName];
      if (testData) {
        const firstImplData = Object.values(testData)[0];
        if (firstImplData) {
          count = firstImplData.queryCount ?? firstImplData.filterCount;
        }
      }
    }
    if (count !== undefined && count !== null && count !== "N/A") {
      queryOrFilterCounts.push(Number(count));
    }
  });

  if (queryOrFilterCounts.length > 0) {
    const avg = queryOrFilterCounts.reduce((a, b) => a + b, 0) / queryOrFilterCounts.length;
    avgQueryOrFilterCount = numeral(avg).format("0.0");
  }

  return avgQueryOrFilterCount;
}

// Generate detailed test results HTML section
function generateDetailedTestResultsHTML(flattened, allResults) {
  if (flattened.length === 0) {
    return "<p>No benchmark results available. Please run the benchmark tests first.</p>";
  }

  const implementations = getImplementations(flattened);
  const categoryResults = organizeByCategory(flattened);

  // Create short labels for table headers (similar to chart labels)
  const getShortLabel = impl => {
    if (impl.includes("Production") || impl.includes("forEach")) return "Production";
    if (impl.includes("Maps") || impl.includes("map/filter")) return "Maps";
    return impl.length > 15 ? `${impl.substring(0, 15)}...` : impl;
  };

  // Calculate summary statistics per category
  const categorySummaries = {};
  Object.entries(categoryResults).forEach(([category, tests]) => {
    const categoryData = {
      testCount: Object.keys(tests).length,
      implementations: {},
      winners: {},
    };

    // Calculate averages per implementation for this category
    implementations.forEach(impl => {
      const implResults = [];
      Object.values(tests).forEach(testImpls => {
        if (testImpls[impl]) {
          const timeValue = testImpls[impl].mean || testImpls[impl].executionTime || 0;
          // Filter out NaN and invalid values
          if (typeof timeValue === "number" && !isNaN(timeValue) && isFinite(timeValue)) {
            implResults.push(timeValue);
          }
        }
      });

      if (implResults.length > 0) {
        const avg = implResults.reduce((a, b) => a + b, 0) / implResults.length;
        const min = Math.min(...implResults);
        const max = Math.max(...implResults);
        categoryData.implementations[impl] = {
          avg,
          min,
          max,
          count: implResults.length,
        };
      }
    });

    // Count winners per implementation in this category
    Object.values(tests).forEach(testImpls => {
      const winner = implementations.reduce((prev, current) => {
        const prevTime = testImpls[prev]
          ? testImpls[prev].mean || testImpls[prev].executionTime || Infinity
          : Infinity;
        const currentTime = testImpls[current]
          ? testImpls[current].mean || testImpls[current].executionTime || Infinity
          : Infinity;
        return currentTime < prevTime ? current : prev;
      }, implementations[0]);
      categoryData.winners[winner] = (categoryData.winners[winner] || 0) + 1;
    });

    categorySummaries[category] = categoryData;
  });

  // Generate summary table by category
  let summaryTableHTML = `
      <h3>Summary by Category</h3>
      <div class="table-wrapper">
        <table class="summary-table">
          <tr>
            <th>Category</th>
            <th>Tests</th>
            ${implementations.map(impl => `<th title="${impl}">${getShortLabel(impl)}<br/>Avg (ms)</th>`).join("")}
            <th>Category Winner</th>
          </tr>`;

  Object.entries(categorySummaries).forEach(([category, data]) => {
    const avgTimes = implementations.map(impl => {
      const stats = data.implementations[impl];
      if (!stats) return "N/A";
      const avgValue = stats.avg;
      // Check for NaN or invalid values
      if (typeof avgValue !== "number" || isNaN(avgValue) || !isFinite(avgValue)) {
        return "N/A";
      }
      return numeral(avgValue).format("0.0000");
    });

    // Find category winner (implementation with most wins)
    const categoryWinner = Object.entries(data.winners).reduce(
      (prev, current) => (current[1] > prev[1] ? current : prev),
      [implementations[0], 0],
    )[0];

    summaryTableHTML += `
          <tr>
            <td><strong>${category}</strong></td>
            <td>${data.testCount}</td>
            ${avgTimes.map(time => `<td>${time}</td>`).join("")}
            <td class="winner" title="${categoryWinner}">${getShortLabel(categoryWinner)}<br/><small>(${data.winners[categoryWinner]}/${data.testCount})</small></td>
          </tr>`;
  });

  summaryTableHTML += `
        </table>
      </div>`;

  // Generate detailed breakdown (collapsible or compact)
  let detailedHTML = `
      <h3>Breakdown</h3>
      <div class="detailed-results">`;

  Object.entries(categoryResults).forEach(([category, tests]) => {
    // Deduplicate test names - normalize and ensure each test appears only once
    // Use Map to preserve the first occurrence and merge any duplicates
    const uniqueTests = new Map();
    Object.entries(tests).forEach(([testName, impls]) => {
      const normalizedName = testName.trim();
      // If we haven't seen this test name, add it
      // If we have, merge implementations (in case of duplicates)
      if (!uniqueTests.has(normalizedName)) {
        uniqueTests.set(normalizedName, impls);
      } else {
        // Merge implementations if duplicate found
        const existing = uniqueTests.get(normalizedName);
        Object.entries(impls).forEach(([impl, stats]) => {
          if (
            !existing[impl] ||
            (stats.mean || stats.executionTime || 0) <
              (existing[impl].mean || existing[impl].executionTime || Infinity)
          ) {
            // Preserve queryCount and filterCount when merging
            existing[impl] = {
              ...stats,
              queryCount: stats.queryCount ?? existing[impl]?.queryCount,
              filterCount: stats.filterCount ?? existing[impl]?.filterCount,
            };
          }
        });
      }
    });

    const testNames = [...uniqueTests.keys()];
    const categoryWinner = Object.entries(categorySummaries[category].winners).reduce(
      (prev, current) => (current[1] > prev[1] ? current : prev),
      [implementations[0], 0],
    )[0];

    detailedHTML += `
        <div class="category-group">
          <h4>${category} <span class="test-count">(${testNames.length} tests)</span></h4>
          <div class="category-stats">
            <div class="stat-item">
              <strong>Winner:</strong> <span class="winner-name">${getShortLabel(categoryWinner)}</span>
              <span class="win-count">(${categorySummaries[category].winners[categoryWinner]}/${testNames.length})</span>
            </div>
            <div class="stat-item">
              <strong>Avg:</strong> ${(() => {
                const winnerStats = categorySummaries[category].implementations[categoryWinner];
                if (!winnerStats) return "N/A";
                const avgValue = winnerStats.avg;
                return formatFriendlyTime(avgValue, true);
              })()}
            </div>
          </div>
          <details class="test-details">
            <summary>View Test Results (${testNames.length})</summary>
            <div class="table-wrapper">
              <table class="compact-table">
                <tr>
                  <th>${category === "Search" ? "Test Case input" : "Test Case"}</th>
                  ${category === "Search" ? "<th>Query Count</th>" : "<th>Filter Count</th>"}
                  ${implementations.map(impl => `<th title="${impl}">${getShortLabel(impl)}</th>`).join("")}
                  <th>Winner</th>
                </tr>`;

    // Display each unique test case only once
    testNames.forEach(testName => {
      const impls = uniqueTests.get(testName);
      if (!impls) return;

      // Get query/filter count from first available implementation
      const firstImpl = implementations.find(impl => impls[impl]);
      const queryOrFilterCount = firstImpl
        ? (impls[firstImpl].queryCount ?? impls[firstImpl].filterCount ?? "N/A")
        : "N/A";

      const times = implementations.map(impl => {
        const stats = impls[impl];
        if (!stats) return "N/A";
        const timeValue = getSafeNumber(stats.mean || stats.executionTime || 0);
        return formatFriendlyTime(timeValue, false);
      });
      const winner = implementations.reduce((prev, current) => {
        const prevTime = impls[prev]
          ? impls[prev].mean || impls[prev].executionTime || Infinity
          : Infinity;
        const currentTime = impls[current]
          ? impls[current].mean || impls[current].executionTime || Infinity
          : Infinity;
        return currentTime < prevTime ? current : prev;
      }, implementations[0]);

      detailedHTML += `
                <tr>
                  <td>${testName}</td>
                  <td>${queryOrFilterCount}</td>
                  ${times.map(time => `<td>${time}</td>`).join("")}
                  <td class="winner" title="${winner}">${getShortLabel(winner)}</td>
                </tr>`;
    });

    // Add summary row for all tests in this category
    const categorySummaryData = categorySummaries[category];
    const allCategoryTimes = implementations.map(impl => {
      const stats = categorySummaryData.implementations[impl];
      if (!stats) return "N/A";
      const avgValue = getSafeNumber(stats.avg);
      return formatFriendlyTime(avgValue, false);
    });
    const allCategoryWinner = categoryWinner;

    // Calculate average query/filter count for summary row
    const avgQueryOrFilterCount = calculateAverageQueryOrFilterCount(
      testNames,
      uniqueTests,
      implementations,
      tests,
    );

    // Create label for "All" row based on category
    const allLabelMap = {
      Search: "All query",
      Ingredients: "All ingredient",
      Appliances: "All appliance",
      Ustensils: "All ustensil",
      Combined: "All combined",
    };
    const allLabel = allLabelMap[category] || `All ${category.toLowerCase()}`;

    // Check if "All" tests were skipped for this category
    const categoriesWithAllTests = ["Ingredients", "Appliances", "Ustensils"];
    const wasAllTestSkipped =
      categoriesWithAllTests.includes(category) && allResults.runAllTests === false;

    // Check if "All" test actually exists in the results
    const allTestExists = testNames.some(
      name => name.toLowerCase().includes("all") || name.toLowerCase().startsWith("all "),
    );

    if (wasAllTestSkipped && !allTestExists) {
      // Show skipped status for "All" test
      detailedHTML += `
                <tr class="summary-row skipped-row" style="opacity: 0.6;">
                  <td><strong>${allLabel}</strong> <span style="color: #2563eb; font-size: 0.85em;">(Skipped)</span></td>
                  <td><strong>-</strong></td>
                  ${implementations.map(() => "<td><strong>-</strong></td>").join("")}
                  <td><strong>-</strong></td>
                </tr>`;
    } else {
      // Show normal summary row
      detailedHTML += `
                <tr class="summary-row">
                  <td><strong>${allLabel}</strong></td>
                  <td><strong>${avgQueryOrFilterCount}</strong></td>
                  ${allCategoryTimes.map(time => `<td><strong>${time}</strong></td>`).join("")}
                  <td class="winner" title="${allCategoryWinner}"><strong>${getShortLabel(allCategoryWinner)}</strong></td>
                </tr>`;
    }

    detailedHTML += `
              </table>
            </div>
          </details>
        </div>`;
  });

  detailedHTML += `
      </div>`;

  return summaryTableHTML + detailedHTML;
}

// Generate the complete HTML report
export async function generateHtmlReport(results, charts) {
  const flattened = results.flattened || [];
  const summary = results.summary || {};
  const allResults = results.all || {};

  const keyFindings = generateKeyFindings(flattened, summary);
  const benchmarkDataStats = generateBenchmarkDataStats();
  const testCoverage = generateTestCoverage(flattened, allResults);
  const skippedTestsNote = generateSkippedTestsNote(allResults);
  const toc = generateTableOfContents();

  const friendlyDate = formatFriendlyDate(results.timestamp);

  // Load CSS
  const cssPath = join(__dirname, "generate.css");
  let cssContent = "";
  try {
    cssContent = readFileSync(cssPath, "utf-8");
  } catch (_error) {
    console.warn("Could not load CSS file, using inline styles");
    cssContent = "";
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Comprehensive benchmark performance report comparing production and map-based implementations">
  <title>Les Petit Plats - Benchmark Performance Report</title>
  <style>
    ${cssContent || ""}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Les Petit Plats</h1>
      <h2>Benchmark Performance Report</h2>
      <p class="report-date">
        ${getLucideIconSVG("Calendar", 16, "rgba(255, 255, 255, 0.9)", "icon-inline")}
        Generated: ${friendlyDate}
      </p>
    </header>

    ${skippedTestsNote}

    ${toc}

    <section id="executive-summary" class="section">
      <h2>Executive Summary</h2>
      ${keyFindings}
    </section>

    <section id="benchmark-data" class="section">
      <h2>Benchmark Data</h2>
      ${benchmarkDataStats}
    </section>

    <section id="test-coverage-summary" class="section">
      <h2>Test Coverage</h2>
      ${testCoverage}
    </section>

    <section id="quick-comparison" class="section">
      <h2>Quick Comparison</h2>
      ${generateChartSection(charts, "quickComparison", "Quick Comparison")}
    </section>

    <section id="performance-comparison" class="section">
      <h2>Performance by Category</h2>
      ${generateChartSection(charts, "performance", "Performance by Category")}
    </section>

    <section id="performance-ranking" class="section page-break-before">
      <h2>Ranking</h2>
      ${generateChartSection(charts, "ranking", "Performance Ranking")}
    </section>

    <section id="consistency-analysis" class="section page-break-before">
      <h2>Consistency (RME)</h2>
      ${generateChartSection(charts, "consistency", "Consistency Analysis")}
    </section>

    <section id="performance-improvement" class="section">
      <h2>Improvement Trend</h2>
      ${generateChartSection(charts, "improvement", "Performance Improvement")}
    </section>

    <div class="page-break"></div>
    <section id="detailed-test-results" class="section">
      <h2>Test Results</h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic; margin-bottom: var(--spacing-lg);">
        Test cases measure performance across various input scenarios, from empty queries to complex multi-filter operations.
      </p>
      ${generateDetailedTestResultsHTML(flattened, allResults)}
    </section>

    <section id="detailed-implementation-breakdown" class="section page-break-before">
      <h2>Implementation Breakdown</h2>
      ${generateImplementationBreakdown(flattened, summary)}
    </section>

    <section id="methodology-measurement-notes" class="section page-break-before">
      <h2>Methodology</h2>
      ${generateMethodologyNotes()}
    </section>

    <section id="key-insights-recommendations" class="section">
      <h2>Analysis</h2>
      ${generateInsightsAndRecommendations(flattened, summary)}
    </section>
  </div>
</body>
</html>
  `;

  // Beautify HTML output using js-beautify first, then Prettier for final formatting
  const beautifiedHtml = beautifyHtml(htmlContent, {
    indent_size: 2,
    indent_char: " ",
    max_preserve_newlines: 2,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "separate",
    brace_style: "collapse",
    space_before_conditional: true,
    unescape_strings: false,
    wrap_line_length: 0,
    wrap_attributes: "auto",
    wrap_attributes_indent_size: 2,
  });

  // Use Prettier for additional HTML formatting (built-in HTML support)
  try {
    return await prettier.format(beautifiedHtml, {
      parser: "html",
      printWidth: 120,
      tabWidth: 2,
      useTabs: false,
      htmlWhitespaceSensitivity: "css",
      endOfLine: "lf",
    });
  } catch (error) {
    // If Prettier fails, return the js-beautify result
    console.warn("Prettier HTML formatting failed, using js-beautify result:", error.message);
    return beautifiedHtml;
  }
}
