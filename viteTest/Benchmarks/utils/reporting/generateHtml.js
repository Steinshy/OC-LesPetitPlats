// HTML generation utilities for benchmark reports
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

// Generate table of contents HTML
export function generateTableOfContents() {
  return `
    <nav class="toc">
      <h2>Table of Contents</h2>
      <ul>
        <li><a href="#executive-summary">Executive Summary</a></li>
        <li><a href="#test-coverage-summary">Test Coverage Summary</a></li>
        <li><a href="#quick-comparison">Quick Comparison</a></li>
        <li><a href="#performance-comparison">Performance Comparison by Category</a></li>
        <li><a href="#performance-ranking">Performance Ranking</a></li>
        <li><a href="#consistency-analysis">Consistency Analysis (RME)</a></li>
        <li><a href="#performance-improvement">Performance Improvement Trend</a></li>
        <li><a href="#detailed-test-results">Detailed Test Results</a></li>
        <li><a href="#detailed-implementation-breakdown">Detailed Implementation Breakdown</a></li>
        <li><a href="#methodology-measurement-notes">Methodology & Measurement Notes</a></li>
        <li><a href="#key-insights-recommendations">Key Insights & Recommendations</a></li>
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
  const winPercentage = totalTests > 0 ? ((winnerWins / totalTests) * 100).toFixed(1) : "0.0";

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
        gap: gap.toFixed(1),
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
        ${
          gaps.length > 0
            ? `
        <div class="finding-card finding-card-wide">
          <h4>Significant Performance Gaps</h4>
          <ul>
            ${gaps.map(gap => `<li>${gap.from} → ${gap.to}: ${gap.gap}% slower</li>`).join("")}
          </ul>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

// Generate test coverage section
export function generateTestCoverage(flattened, _allResults) {
  const categoryResults = organizeByCategory(flattened);
  const coverage = getTestCoverage(categoryResults);
  const implementations = getImplementations(flattened);

  return `
    <div class="test-coverage">
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
    if (impl.includes("Production") || impl.includes("production filter")) return "Production";
    if (impl.includes("Loops") && impl.includes("filter-loops")) return "Loops";
    if (impl.includes("forEach")) return "forEach";
    if (impl.includes("reduce")) return "reduce";
    if (impl.includes("for (using for loops)")) return "for";
    if (impl.includes("while")) return "while";
    return impl.length > 20 ? `${impl.substring(0, 20)}...` : impl;
  };

  // Calculate detailed stats for each implementation
  const implDetails = implementations.map(impl => {
    const implResults = flattened.filter(r => r.implementation === impl);
    const avgTime = getAverageExecutionTime(flattened, impl);
    const avgRME = getAverageRME(flattened, impl);
    const wins = winCounts[impl] || 0;
    const winPercentage = totalTests > 0 ? ((wins / totalTests) * 100).toFixed(1) : "0.0";

    // Calculate min, max from all results
    const times = implResults.map(r => r.mean || r.executionTime || 0).filter(t => t > 0);
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
          <tr class="${index === 0 ? "fastest-row" : ""}">
            <td><strong>#${index + 1}</strong>${index === 0 ? ' <span class="badge">Fastest</span>' : ""}</td>
            <td title="${impl.name}"><strong>${impl.shortName}</strong></td>
            <td>${impl.avgTime.toFixed(4)}</td>
            <td>${impl.minTime.toFixed(4)}</td>
            <td>${impl.maxTime.toFixed(4)}</td>
            <td>${impl.avgRME.toFixed(2)}</td>
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

// Generate methodology and measurement notes section
export function generateMethodologyNotes() {
  return `
    <div class="methodology-notes">
      <h3>Benchmark Methodology</h3>
      <div class="methodology-content">
        <div class="methodology-grid">
          <div class="methodology-card">
            <h4>Measurement Framework</h4>
            <table class="methodology-table">
              <tr><td><strong>Tool:</strong></td><td>TinyBench</td></tr>
              <tr><td><strong>Duration:</strong></td><td>75ms per test</td></tr>
              <tr><td><strong>Warmup:</strong></td><td>15ms (2 iterations)</td></tr>
              <tr><td><strong>Max Iterations:</strong></td><td>25 per test</td></tr>
              <tr><td><strong>Time Unit:</strong></td><td>Milliseconds (ms)</td></tr>
            </table>
          </div>

          <div class="methodology-card">
            <h4>Key Metrics</h4>
            <ul class="compact-list">
              <li><strong>Mean:</strong> Average execution time</li>
              <li><strong>Min/Max:</strong> Best/worst case performance</li>
              <li><strong>RME:</strong> Relative Measurement Error (lower = more precise)</li>
            </ul>
          </div>

          <div class="methodology-card">
            <h4>Test Categories</h4>
            <ul class="compact-list">
              <li><strong>Search:</strong> Text-based recipe search</li>
              <li><strong>Ingredients:</strong> Filter by ingredients</li>
              <li><strong>Appliances:</strong> Filter by appliances</li>
              <li><strong>Ustensils:</strong> Filter by utensils</li>
              <li><strong>Combined:</strong> Multi-criteria filtering</li>
            </ul>
          </div>

          <div class="methodology-card">
            <h4>Implementations</h4>
            <ul class="compact-list">
              <li><strong>Production:</strong> Array methods (filter, map, etc.)</li>
              <li><strong>Loops:</strong> Optimized for loops</li>
              <li><strong>forEach:</strong> Array.forEach iteration</li>
              <li><strong>reduce:</strong> Array.reduce approach</li>
              <li><strong>for/while:</strong> Traditional loops</li>
            </ul>
          </div>
        </div>

        <div class="methodology-process-note">
          <div class="methodology-process">
            <h4>Process</h4>
            <p>Each implementation undergoes warmup (to eliminate JIT effects), then multiple timed iterations. Results are statistically analyzed to compute mean, min, max, and RME. Implementations are ranked by average execution time.</p>
          </div>

          <div class="methodology-note">
            <p><strong>Note:</strong> Benchmarks run in Node.js. Results may vary by system load, CPU architecture, and Node.js version. For production decisions, test on target deployment environments.</p>
          </div>
        </div>
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
      ? (((slowest.avgTime - fastest.avgTime) / fastest.avgTime) * 100).toFixed(1)
      : 0;

  // Generate recommendations
  const recommendations = [];

  if (
    fastest.name.includes("Loops") ||
    fastest.name.includes("for") ||
    fastest.name.includes("while")
  ) {
    recommendations.push({
      type: "performance",
      title: "Use Loop-Based Implementations for Performance-Critical Code",
      description: `The fastest implementation (${fastest.name}) uses traditional loops, showing ${performanceGap}% better performance than the slowest approach. Consider using loop-based implementations for performance-critical filtering operations.`,
    });
  }

  if (fastest.name.includes("Production") || fastest.name.includes("Maps")) {
    recommendations.push({
      type: "maintainability",
      title: "Functional Approach Provides Good Balance",
      description:
        "The production implementation offers competitive performance while maintaining code readability and maintainability. Consider this approach if performance differences are acceptable.",
    });
  }

  if (mostConsistent.avgRME < 5) {
    recommendations.push({
      type: "reliability",
      title: "High Consistency Achieved",
      description: `The ${mostConsistent.name} implementation shows excellent consistency (RME: ${mostConsistent.avgRME.toFixed(2)}%), making it reliable for production use.`,
    });
  }

  if (averageImprovement > 50) {
    recommendations.push({
      type: "optimization",
      title: "Significant Performance Gains Available",
      description: `Average improvement of ${averageImprovement.toFixed(1)}% suggests substantial optimization opportunities. Review slower implementations and consider adopting faster approaches where appropriate.`,
    });
  }

  recommendations.push({
    type: "general",
    title: "Consider Context-Specific Optimization",
    description:
      "Different filter types (ingredients, appliances, ustensils) may benefit from different optimization strategies. Profile your specific use cases to identify the best approach for each scenario.",
  });

  recommendations.push({
    type: "general",
    title: "Monitor Performance in Production",
    description:
      "Benchmark results provide guidance, but real-world performance can vary. Monitor actual application performance and adjust implementations based on production metrics and user experience.",
  });

  return `
    <div class="insights-recommendations">
      <h3>Key Insights</h3>
      <div class="insights-content">
        <div class="insight-card">
          <h4>Performance Leader</h4>
          <p><strong>${overallWinner}</strong> demonstrates superior performance, winning ${winCounts[overallWinner] || 0} out of ${summary.totalTests || 0} test cases.</p>
          <p>Average execution time: <strong>${fastest.avgTime.toFixed(4)} ms</strong></p>
        </div>

        <div class="insight-card">
          <h4>Performance Range</h4>
          <p>The fastest implementation (<strong>${fastest.name}</strong>) is <strong>${performanceGap}%</strong> faster than the slowest (<strong>${slowest.name}</strong>).</p>
          <p>Fastest: ${fastest.avgTime.toFixed(4)} ms | Slowest: ${slowest.avgTime.toFixed(4)} ms</p>
        </div>

        <div class="insight-card">
          <h4>Consistency Analysis</h4>
          <p><strong>${mostConsistent.name}</strong> shows the most consistent performance with an average RME of <strong>${mostConsistent.avgRME.toFixed(2)}%</strong>.</p>
          <p>Lower RME indicates more reliable and predictable performance measurements.</p>
        </div>

        <div class="insight-card">
          <h4>Overall Improvement Potential</h4>
          <p>Average performance improvement across all tests: <strong>${averageImprovement.toFixed(1)}%</strong></p>
          <p>This indicates significant optimization opportunities when choosing the right implementation approach.</p>
        </div>
      </div>

      <h3>Recommendations</h3>
      <div class="recommendations-content">
        ${recommendations
          .map(
            (rec, index) => `
          <div class="recommendation-card recommendation-${rec.type}">
            <h4>${index + 1}. ${rec.title}</h4>
            <p>${rec.description}</p>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="conclusion">
        <h4>Conclusion</h4>
        <p>Based on the comprehensive benchmark analysis, <strong>${overallWinner}</strong> emerges as the recommended implementation for production use, offering the best balance of performance, consistency, and reliability across all test scenarios.</p>
        <p>However, consider your specific requirements: if code maintainability is a priority, functional approaches may be preferable despite slightly lower performance. For maximum performance, loop-based implementations consistently outperform functional alternatives.</p>
      </div>
    </div>
  `;
}

// Generate the complete HTML report
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
  } catch (_error) {
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
    ${
      cssContent ||
      `
    body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
    .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    `
    }
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
    </section>

    <section id="test-coverage-summary" class="section">
      <h2>Test Coverage Summary</h2>
      ${testCoverage}
    </section>

    <section id="quick-comparison" class="section">
      <h2>Quick Comparison</h2>
      ${generateChartSection(charts, "quickComparison", "Quick Comparison")}
    </section>

    <section id="performance-comparison" class="section">
      <h2>Performance Comparison by Category</h2>
      ${generateChartSection(charts, "performance", "Performance Comparison by Category")}
    </section>

    <section id="performance-ranking" class="section page-break-before">
      <h2>Performance Ranking</h2>
      ${generateChartSection(charts, "ranking", "Performance Ranking")}
    </section>

    <section id="consistency-analysis" class="section page-break-before">
      <h2>Consistency Analysis (RME)</h2>
      ${generateChartSection(charts, "consistency", "Consistency Analysis (RME)")}
    </section>

    <section id="performance-improvement" class="section">
      <h2>Performance Improvement Trend</h2>
      ${generateChartSection(charts, "improvement", "Performance Improvement Trend")}
    </section>

    <div class="page-break"></div>
    <section id="detailed-test-results" class="section">
      <h2>Detailed Test Results</h2>
      ${
        flattened.length > 0
          ? (() => {
              const implementations = getImplementations(flattened);
              const categoryResults = organizeByCategory(flattened);

              // Create short labels for table headers (similar to chart labels)
              const getShortLabel = impl => {
                if (impl.includes("Production") || impl.includes("production filter"))
                  return "Production";
                if (impl.includes("Loops") && impl.includes("filter-loops")) return "Loops";
                if (impl.includes("forEach")) return "forEach";
                if (impl.includes("reduce")) return "reduce";
                if (impl.includes("for (using for loops)")) return "for";
                if (impl.includes("while")) return "while";
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
                      implResults.push(testImpls[impl].mean || testImpls[impl].executionTime || 0);
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
      <h3>Performance Summary by Category</h3>
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
                  return stats ? stats.avg.toFixed(4) : "N/A";
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
      <h3>Detailed Breakdown</h3>
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
                        existing[impl] = stats;
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
              <strong>Category Winner:</strong> <span class="winner-name">${getShortLabel(categoryWinner)}</span>
              <span class="win-count">(${categorySummaries[category].winners[categoryWinner]}/${testNames.length} wins)</span>
            </div>
            <div class="stat-item">
              <strong>Fastest Avg:</strong> ${getShortLabel(categoryWinner)} 
              (${categorySummaries[category].implementations[categoryWinner].avg.toFixed(4)} ms)
            </div>
          </div>
          <details class="test-details">
            <summary>View Individual Test Results (${testNames.length} tests)</summary>
            <div class="table-wrapper">
              <table class="compact-table">
                <tr>
                  <th>Test Case</th>
                  ${implementations.map(impl => `<th title="${impl}">${getShortLabel(impl)}</th>`).join("")}
                  <th>Winner</th>
                </tr>`;

                // Display each unique test case only once
                testNames.forEach(testName => {
                  const impls = uniqueTests.get(testName);
                  if (!impls) return;

                  const times = implementations.map(impl => {
                    const stats = impls[impl];
                    return stats ? (stats.mean || stats.executionTime || 0).toFixed(4) : "N/A";
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
                  ${times.map(time => `<td>${time}</td>`).join("")}
                  <td class="winner" title="${winner}">${getShortLabel(winner)}</td>
                </tr>`;
                });

                detailedHTML += `
              </table>
            </div>
          </details>
        </div>`;
              });

              detailedHTML += `
      </div>`;

              return summaryTableHTML + detailedHTML;
            })()
          : "<p>No benchmark results available. Please run the benchmark tests first.</p>"
      }
    </section>

    <section id="detailed-implementation-breakdown" class="section page-break-before">
      <h2>Detailed Implementation Breakdown</h2>
      ${generateImplementationBreakdown(flattened, summary)}
    </section>

    <section id="methodology-measurement-notes" class="section page-break-before">
      <h2>Methodology & Measurement Notes</h2>
      ${generateMethodologyNotes()}
    </section>

    <section id="key-insights-recommendations" class="section">
      <h2>Key Insights & Recommendations</h2>
      ${generateInsightsAndRecommendations(flattened, summary)}
    </section>
  </div>
</body>
</html>
  `;
}
