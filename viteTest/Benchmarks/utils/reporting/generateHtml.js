/**
 * HTML generation utilities for benchmark reports
 * Creates the complete HTML report with TOC, charts, and detailed sections
 */

import { generateAllCharts } from "./generateReport.js";
import {
  flattenCategoryResults,
  getAverageExecutionTime,
  getAverageRME,
  getImplementations,
  getTestCoverage,
} from "../data/results.js";

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
 * @param {Object} categoryResults - Results organized by category
 * @returns {string} HTML string for key findings
 */
export function generateKeyFindings(categoryResults) {
  const flattened = flattenCategoryResults(categoryResults);
  const implementations = getImplementations(flattened);

  if (implementations.length === 0) {
    return '<div class="key-findings"><p>No benchmark data available.</p></div>';
  }

  // Calculate averages for each implementation
  const implStats = implementations.map((impl) => ({
    name: impl,
    avgTime: getAverageExecutionTime(flattened, impl),
    avgRME: getAverageRME(flattened, impl),
  }));

  // Find overall winner (fastest average)
  const winner = implStats.reduce((prev, current) =>
    prev.avgTime < current.avgTime ? prev : current
  );

  // Calculate win percentage (how many tests this implementation won)
  const testCases = {};
  for (const result of flattened) {
    const key = `${result.category} - ${result.testName}`;
    if (!testCases[key]) {
      testCases[key] = [];
    }
    testCases[key].push({
      impl: result.implementation,
      time: result.mean || result.executionTime || 0,
    });
  }

  const winCounts = {};
  for (const testResults of Object.values(testCases)) {
    const fastest = testResults.reduce((prev, current) =>
      prev.time < current.time ? prev : current
    );
    winCounts[fastest.impl] = (winCounts[fastest.impl] || 0) + 1;
  }

  const totalTests = Object.keys(testCases).length;
  const winPercentage = ((winCounts[winner.name] || 0) / totalTests) * 100;

  // Find most consistent (lowest RME)
  const mostConsistent = implStats.reduce((prev, current) =>
    prev.avgRME < current.avgRME ? prev : current
  );

  // Calculate average performance improvement
  const sortedByTime = [...implStats].sort((a, b) => a.avgTime - b.avgTime);
  const fastest = sortedByTime[0];
  const slowest = sortedByTime[sortedByTime.length - 1];
  const improvement = ((slowest.avgTime - fastest.avgTime) / slowest.avgTime) * 100;

  // Find significant performance gaps
  const gaps = [];
  for (let i = 0; i < sortedByTime.length - 1; i++) {
    const current = sortedByTime[i];
    const next = sortedByTime[i + 1];
    const gap = ((next.avgTime - current.avgTime) / current.avgTime) * 100;
    if (gap > 20) {
      gaps.push({
        from: current.name,
        to: next.name,
        gap: gap.toFixed(1),
      });
    }
  }

  return `
    <div class="key-findings">
      <h3>Key Findings</h3>
      <div class="findings-grid">
        <div class="finding-card">
          <h4>Overall Winner</h4>
          <p class="finding-value">${winner.name}</p>
          <p class="finding-detail">Wins ${winCounts[winner.name] || 0} of ${totalTests} tests (${winPercentage.toFixed(1)}%)</p>
        </div>
        <div class="finding-card">
          <h4>Average Performance Improvement</h4>
          <p class="finding-value">${improvement.toFixed(1)}%</p>
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
 * @param {Object} categoryResults - Results organized by category
 * @returns {string} HTML string for test coverage
 */
export function generateTestCoverage(categoryResults) {
  const coverage = getTestCoverage(categoryResults);

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
 * @param {Object} charts - Chart configurations
 * @param {string} chartId - ID of the chart to generate
 * @param {string} chartName - Display name for the chart
 * @returns {string} HTML string for a chart section
 */
export function generateChartSection(charts, chartId, chartName) {
  if (!charts[chartId]) {
    return "";
  }

  return `
    <div class="chart-section">
      <h3>${chartName}</h3>
      <div class="chart-container">
        <canvas id="chart-${chartId}"></canvas>
      </div>
    </div>
  `;
}

/**
 * Generate the complete HTML report
 * @param {Object} categoryResults - Results organized by category
 * @param {Object} options - Additional options for report generation
 * @returns {string} Complete HTML report string
 */
export function generateHtmlReport(categoryResults, options = {}) {
  const charts = generateAllCharts(categoryResults);
  const keyFindings = generateKeyFindings(categoryResults);
  const testCoverage = generateTestCoverage(categoryResults);
  const toc = generateTableOfContents();

  // Serialize charts for embedding in HTML
  const chartsJson = JSON.stringify(charts);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benchmark Report</title>
  <link rel="stylesheet" href="generate.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
  <header>
    <h1>Benchmark Performance Report</h1>
    <p class="report-date">Generated: ${new Date().toLocaleString()}</p>
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
    ${generateChartSection(charts, "ranking", "Performance Ranking")}
    ${generateChartSection(charts, "consistency", "Consistency Analysis (RME)")}
    ${generateChartSection(charts, "heatmap", "Speed Comparison Heatmap")}
  </section>

  <section id="detailed-test-results" class="section">
    <h2>Detailed Test Results</h2>
    <!-- Detailed results will be inserted here -->
  </section>

  <section id="detailed-implementation-breakdown" class="section">
    <h2>Detailed Implementation Breakdown</h2>
    <!-- Implementation breakdown will be inserted here -->
  </section>

  <section id="methodology-measurement-notes" class="section">
    <h2>Methodology & Measurement Notes</h2>
    <!-- Methodology notes will be inserted here -->
  </section>

  <section id="key-insights-recommendations" class="section">
    <h2>Key Insights & Recommendations</h2>
    <!-- Insights and recommendations will be inserted here -->
  </section>

  <script>
    // Initialize charts
    const chartsData = ${chartsJson};
    
    // Quick Comparison Chart
    if (chartsData.quickComparison) {
      const ctx1 = document.getElementById('chart-quickComparison');
      if (ctx1) {
        new Chart(ctx1, chartsData.quickComparison);
      }
    }
    
    // Ranking Chart
    if (chartsData.ranking) {
      const ctx2 = document.getElementById('chart-ranking');
      if (ctx2) {
        new Chart(ctx2, chartsData.ranking);
      }
    }
    
    // Consistency Chart
    if (chartsData.consistency) {
      const ctx3 = document.getElementById('chart-consistency');
      if (ctx3) {
        new Chart(ctx3, chartsData.consistency);
      }
    }
    
    // Heatmap Chart
    if (chartsData.heatmap) {
      const ctx4 = document.getElementById('chart-heatmap');
      if (ctx4) {
        new Chart(ctx4, chartsData.heatmap);
      }
    }
  </script>
</body>
</html>
  `;
}
