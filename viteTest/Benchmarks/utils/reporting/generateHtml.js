/**
 * HTML generation utilities for benchmark reports
 * Creates the complete HTML report with TOC, charts, and detailed sections
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  getAverageExecutionTime,
  getAverageRME,
  getImplementations,
  organizeByCategory,
  getTestCoverage,
} from "../data/results.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate table of contents HTML
 * @returns {string} HTML string for table of contents
 */
export function generateTableOfContents() {
  return `
    <nav class="toc">
      <h2>Table of Contents</h2>
      <ul>
        <li><a href="#executive-summary">Executive Summary</a></li>
        <li><a href="#performance-analysis">Performance Analysis</a></li>
        <li><a href="#detailed-test-results">Detailed Test Results</a></li>
        <li><a href="#detailed-implementation-breakdown">Detailed Implementation Breakdown</a></li>
        <li><a href="#methodology-measurement-notes">Methodology & Measurement Notes</a></li>
        <li><a href="#key-insights-recommendations">Key Insights & Recommendations</a></li>
      </ul>
    </nav>
  `;
}

/**
 * Generate key findings section
 * @param {Array} flattened - Flattened results array
 * @param {Object} summary - Summary statistics
 * @returns {string} HTML string for key findings
 */
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
    prev.avgRME < current.avgRME ? prev : current
  );

  // Find fastest overall
  const fastest = implStats.reduce((prev, current) =>
    prev.avgTime < current.avgTime ? prev : current
  );

  // Calculate win percentage
  const winnerWins = winCounts[overallWinner] || 0;
  const winPercentage = totalTests > 0 ? ((winnerWins / totalTests) * 100).toFixed(1) : "0.0";

  // Find significant performance gaps
  const sortedByTime = [...implStats].sort((a, b) => a.avgTime - b.avgTime);
  const gaps = [];
  for (let i = 0; i < sortedByTime.length - 1; i++) {
    const current = sortedByTime[i];
    const next = sortedByTime[i + 1];
    const gap = current.avgTime > 0 ? ((next.avgTime - current.avgTime) / current.avgTime) * 100 : 0;
    if (gap > 20) {
      gaps.push({
        from: current.name,
        to: next.name,
        gap: gap.toFixed(1),
      });
    }
  }

  const slowest = sortedByTime[sortedByTime.length - 1];

  return `
    <div class="key-findings">
      <h3>Key Findings</h3>
      <div class="findings-grid">
        <div class="finding-card">
          <h4>Overall Winner</h4>
          <p class="finding-value">${overallWinner}</p>
          <p class="finding-detail">Wins ${winnerWins} of ${totalTests} tests (${winPercentage}%)</p>
        </div>
        <div class="finding-card">
          <h4>Average Performance Improvement</h4>
          <p class="finding-value">${averageImprovement.toFixed(1)}%</p>
          <p class="finding-detail">Fastest vs Slowest: ${fastest.name} vs ${slowest.name}</p>
        </div>
        <div class="finding-card">
          <h4>Most Consistent</h4>
          <p class="finding-value">${mostConsistent.name}</p>
          <p class="finding-detail">Lowest average RME: ${mostConsistent.avgRME.toFixed(2)}%</p>
        </div>
        <div class="finding-card">
          <h4>Fastest Overall</h4>
          <p class="finding-value">${fastest.name}</p>
          <p class="finding-detail">Average time: ${fastest.avgTime.toFixed(2)}ms</p>
        </div>
        ${gaps.length > 0 ? `
        <div class="finding-card finding-card-wide">
          <h4>Significant Performance Gaps</h4>
          <ul>
            ${gaps.map(gap => `<li>${gap.from} → ${gap.to}: ${gap.gap}% slower</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Generate test coverage section
 * @param {Array} flattened - Flattened results array
 * @param {Object} allResults - All results organized by category
 * @returns {string} HTML string for test coverage
 */
export function generateTestCoverage(flattened, allResults) {
  const categoryResults = organizeByCategory(flattened);
  const coverage = getTestCoverage(categoryResults);
  const implementations = getImplementations(flattened);
  const totalScenarios = flattened.length; // Each flattened entry is a scenario (test × implementation)

  return `
    <div class="test-coverage">
      <h3>Test Coverage Summary</h3>
      <div class="coverage-grid">
        <div class="coverage-card">
          <h4>Total Test Cases</h4>
          <p class="coverage-value">${coverage.totalTests}</p>
        </div>
        <div class="coverage-card">
          <h4>Total Scenarios</h4>
          <p class="coverage-value">${coverage.totalScenarios}</p>
        </div>
        <div class="coverage-card">
          <h4>Implementations</h4>
          <p class="coverage-value">${implementations.length}</p>
        </div>
        <div class="coverage-card coverage-card-wide">
          <h4>Breakdown by Category</h4>
          <ul class="category-list">
            ${Object.entries(coverage.categoryBreakdown)
              .map(([category, count]) => `<li><strong>${category}:</strong> ${count} tests</li>`)
              .join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate chart HTML section
 * @param {Object} charts - Chart image buffers
 * @param {string} chartKey - Key of the chart in charts object
 * @param {string} chartName - Display name for the chart
 * @returns {string} HTML string for a chart section
 */
export function generateChartSection(charts, chartKey, chartName) {
  if (!charts[chartKey]) {
    return "";
  }

  return `
    <div class="chart-section">
      <h3>${chartName}</h3>
      <div class="chart">
        <img src="data:image/png;base64,${charts[chartKey].toString("base64")}" alt="${chartName}" />
      </div>
    </div>
  `;
}

/**
 * Generate the complete HTML report
 * @param {Object} results - Benchmark results
 * @param {Object} charts - Chart image buffers
 * @returns {string} Complete HTML report string
 */
export function generateHtmlReport(results, charts) {
  const flattened = results.flattened || [];
  const summary = results.summary || {};
  const allResults = results.all || {};

  const keyFindings = generateKeyFindings(flattened, summary);
  const testCoverage = generateTestCoverage(flattened, allResults);
  const toc = generateTableOfContents();

  // Load CSS
  const cssPath = join(__dirname, "generate.css");
  let cssContent = "";
  try {
    cssContent = readFileSync(cssPath, "utf-8");
  } catch (error) {
    console.warn("Could not load CSS file, using inline styles");
    cssContent = "";
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benchmark Report</title>
  <style>
    ${cssContent || `
    body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
    .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    `}
  </style>
  <link rel="stylesheet" href="generate.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Benchmark Performance Report</h1>
      <p class="report-date">Generated: ${results.timestamp || new Date().toISOString()}</p>
    </header>

    ${toc}

    <section id="executive-summary" class="section">
      <h2>Executive Summary</h2>
      ${keyFindings}
      ${testCoverage}
      ${generateChartSection(charts, "quickComparison", "Quick Comparison")}
    </section>

    <section id="performance-analysis" class="section">
      <h2>Performance Analysis</h2>
      ${generateChartSection(charts, "performance", "Performance Comparison by Category")}
      ${generateChartSection(charts, "ranking", "Performance Ranking")}
      ${generateChartSection(charts, "consistency", "Consistency Analysis (RME)")}
      ${generateChartSection(charts, "heatmap", "Speed Comparison Heatmap")}
      ${generateChartSection(charts, "improvement", "Performance Improvement Trend")}
    </section>

    <section id="detailed-test-results" class="section">
      <h2>Detailed Test Results</h2>
      ${
        flattened.length > 0
          ? (() => {
              const implementations = getImplementations(flattened);
              const categoryResults = organizeByCategory(flattened);
              let tableHTML = `
      <table>
        <tr>
          <th>Category</th>
          <th>Test Case</th>
          ${implementations.map(impl => `<th>${impl} (ms)</th>`).join("")}
          <th>Winner</th>
        </tr>`;
              
              Object.entries(categoryResults).forEach(([category, tests]) => {
                Object.entries(tests).forEach(([testName, impls]) => {
                  const times = implementations.map(impl => {
                    const stats = impls[impl];
                    return stats ? (stats.mean || stats.executionTime || 0).toFixed(4) : "N/A";
                  });
                  const winner = implementations.reduce((prev, current) => {
                    const prevTime = impls[prev] ? (impls[prev].mean || impls[prev].executionTime || Infinity) : Infinity;
                    const currentTime = impls[current] ? (impls[current].mean || impls[current].executionTime || Infinity) : Infinity;
                    return currentTime < prevTime ? current : prev;
                  }, implementations[0]);
                  
                  tableHTML += `
        <tr>
          <td>${category}</td>
          <td>${testName}</td>
          ${times.map(time => `<td>${time}</td>`).join("")}
          <td class="winner">${winner}</td>
        </tr>`;
                });
              });
              
              tableHTML += `
      </table>`;
              return tableHTML;
            })()
          : "<p>No benchmark results available. Please run the benchmark tests first.</p>"
      }
    </section>

    <section id="detailed-implementation-breakdown" class="section">
      <h2>Detailed Implementation Breakdown</h2>
      <p>Implementation details and performance characteristics will be displayed here.</p>
    </section>

    <section id="methodology-measurement-notes" class="section">
      <h2>Methodology & Measurement Notes</h2>
      <p>Methodology and measurement details will be displayed here.</p>
    </section>

    <section id="key-insights-recommendations" class="section">
      <h2>Key Insights & Recommendations</h2>
      <p>Key insights and recommendations will be displayed here.</p>
    </section>
  </div>
</body>
</html>
  `;
}
