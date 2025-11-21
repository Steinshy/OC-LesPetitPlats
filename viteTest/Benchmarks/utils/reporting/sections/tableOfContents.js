// Table of contents section generator
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

