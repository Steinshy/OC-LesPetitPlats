// HTML generation utilities for benchmark reports
import jsBeautify from "js-beautify";
import prettier from "prettier";

const { html: beautifyHtml } = jsBeautify;

// Import helpers
import { formatFriendlyDate } from "./helpers/formatting.js";
import { getLucideIconSVG } from "./helpers/icons.js";
import { loadCss } from "./helpers/loadCss.js";
import { generateSkippedTestsNote } from "./helpers/skippedTests.js";

// Import section generators
import { generateTableOfContents } from "./sections/tableOfContents.js";
import { generateKeyFindings } from "./sections/keyFindings.js";
import { generateBenchmarkDataStats } from "./sections/benchmarkDataStats.js";
import { generateTestCoverage } from "./sections/testCoverage.js";
import { generateChartSection } from "./sections/chartSection.js";
import { generateImplementationBreakdown } from "./sections/implementationBreakdown.js";
import { generateMethodologyNotes } from "./sections/methodology.js";
import { generateInsightsAndRecommendations } from "./sections/insights.js";
import { generateDetailedTestResultsHTML } from "./sections/detailedTestResults.js";

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
