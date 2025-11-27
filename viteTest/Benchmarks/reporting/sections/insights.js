// Insights and recommendations section generator
import numeral from "numeral";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "@benchmarks-data/results.js";
import { formatFriendlyTime } from "@benchmarks-reporting-helpers/formatting.js";
import { renderMarkdown } from "@benchmarks-reporting-helpers/markdown.js";

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

