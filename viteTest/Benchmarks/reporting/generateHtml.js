// HTML generation utilities for benchmark reports
import jsBeautify from "js-beautify";
import prettier from "prettier";

const { html: beautifyHtml } = jsBeautify;

// Import helpers
import { formatFriendlyDate } from "@benchmarks-reporting-helpers/formatting.js";
import { loadCss } from "@benchmarks-reporting-helpers/loadCss.js";

// Import section generators
import { generateImplementationBreakdown } from "@benchmarks-reporting-sections/implementation.js";
import { generateInsightsAndRecommendations } from "@benchmarks-reporting-sections/insights.js";
import { generateKeyFindings } from "@benchmarks-reporting-sections/keyFindings.js";
import { generateMethodologyNotes } from "@benchmarks-reporting-sections/methodology.js";
import { generateBenchmarkDataStats, generateTestCoverage } from "@benchmarks-reporting-sections/stats.js";
import { generateDetailedTestResultsHTML } from "@benchmarks-reporting-sections/testResults.js";

// Icon helper functions (merged from helpers/icons.js)
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

// Helper for skipped tests note (merged from helpers/skippedTests.js)
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

// Chart section generator (merged from sections/chartSection.js)
function generateChartSection(charts, chartKey, chartName, pageBreakBefore = false) {
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

// Table of contents section generator (merged from sections/tableOfContents.js)
function generateTableOfContents() {
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

  // Load CSS from styles directory
  let cssContent = "";
  try {
    cssContent = loadCss();
  } catch (error) {
    console.warn("Could not load CSS files, using inline styles:", error.message);
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
