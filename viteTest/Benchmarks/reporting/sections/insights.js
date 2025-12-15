import numeral from "numeral";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "@benchmarks-data/results.js";
import { formatFriendlyTime, capitalize } from "@benchmarks-reporting-helpers/formatting.js";
import { renderMarkdown } from "@benchmarks-reporting-helpers/markdown.js";

function generateExecutiveSummaryMarkdown(summary, overallWinner, implementations = []) {
  const [impl1, impl2] = [implementations[0] || "production", implementations[1] || "forEach"];

  const markdownContent = `
### Executive Summary

Based on comprehensive performance analysis across **${summary.totalTests || 0}** test scenarios, **${capitalize(overallWinner)}** demonstrates superior performance characteristics and is recommended for production deployment. This implementation provides an optimal balance of execution speed, measurement consistency, and operational reliability.

#### Implementation Guidelines

- **${capitalize(impl1)}** (from \`${impl1}.js\`) — Implementation from the \`${impl1}.js\` file.

- **${capitalize(impl2)}** (from \`${impl2}.js\`) — Implementation from the \`${impl2}.js\` file.

> *These recommendations are based on quantitative analysis of execution times, relative measurement error (RME), and win rates across all benchmark categories. Consider specific use case requirements and performance targets when selecting an implementation strategy.*

#### Key Metrics

**Total Tests:** ${summary.totalTests || 0} • **Winner:** ${capitalize(overallWinner)} • **Performance Gap:** ${summary.averageImprovement ? numeral(summary.averageImprovement).format("0.0") : "N/A"}%

<small>*All metrics are calculated from actual benchmark execution data.*</small>
  `.trim();

  return renderMarkdown(markdownContent).replace(/undefined/g, "");
}

export function generateInsightsAndRecommendations(flattened, summary) {
  if (flattened.length === 0) {
    return "<p>No benchmark data available for analysis.</p>";
  }

  const implementations = getImplementations(flattened);
  const overallWinnerRaw = summary.overallWinner || "N/A";
  const overallWinner = capitalize(overallWinnerRaw);
  const averageImprovement = summary.averageImprovement || 0;
  const winCounts = summary.winCounts || {};

  const implStats = implementations.map(impl => ({
    name: impl,
    avgTime: getAverageExecutionTime(flattened, impl),
    avgRME: getAverageRME(flattened, impl),
    wins: winCounts[impl] || 0,
  }));

  const sortedByTime = [...implStats].sort((a, b) => a.avgTime - b.avgTime);
  const [fastest, slowest] = [sortedByTime[0], sortedByTime[sortedByTime.length - 1]];
  const mostConsistent = [...implStats].sort((a, b) => a.avgRME - b.avgRME)[0];
  const performanceGap =
    fastest.avgTime > 0
      ? numeral(((slowest.avgTime - fastest.avgTime) / fastest.avgTime) * 100).format("0.0")
      : 0;

  const recommendations = [];
  const lowerName = fastest.name.toLowerCase();
  const capitalizedFastest = capitalize(fastest.name);
  const capitalizedSlowest = capitalize(slowest.name);
  const capitalizedMostConsistent = capitalize(mostConsistent.name);

  // Only recommend the fastest if it's also the overall winner, or provide balanced recommendation
  if (fastest.name === overallWinnerRaw) {
    if (lowerName.includes("foreach")) {
      recommendations.push({
        type: "performance",
        title: "ForEach Implementation Recommended",
        description: `**${capitalizedFastest}** shows **${performanceGap}%** better performance and wins the most tests. Consider ForEach-based implementations for optimal speed and reliability.`,
      });
    }

    if (lowerName.includes("production")) {
      recommendations.push({
        type: "maintainability",
        title: "Production Implementation Recommended",
        description:
          "`.map()` and `.filter()`-based implementation provides the best overall balance of performance, consistency, and reliability. Recommended for production deployment.",
      });
    }
  } else {
    // Fastest is not the overall winner - provide balanced recommendation
    if (lowerName.includes("foreach")) {
      recommendations.push({
        type: "performance",
        title: "ForEach: Faster but Less Consistent",
        description: `**${capitalizedFastest}** shows **${performanceGap}%** better raw speed, but **${overallWinner}** wins more tests due to better consistency and reliability. Consider ForEach if raw speed is the primary concern.`,
      });
    }

    if (overallWinnerRaw.toLowerCase().includes("production")) {
      recommendations.push({
        type: "maintainability",
        title: "Production: Best Overall Balance",
        description:
          "**Production** wins the most tests by providing the best balance of speed, consistency, and reliability. While slightly slower in raw execution time, it offers more predictable performance.",
      });
    }
  }

  if (mostConsistent.avgRME < 5) {
    recommendations.push({
      type: "reliability",
      title: "High Consistency",
      description: `**${capitalizedMostConsistent}** shows excellent consistency (RME: **${numeral(mostConsistent.avgRME).format("0.00")}%**), making it highly reliable for production environments.`,
    });
  }

  if (averageImprovement > 50 && fastest.name !== overallWinnerRaw) {
    recommendations.push({
      type: "optimization",
      title: "Trade-off Analysis",
      description: `**${numeral(averageImprovement).format("0.0")}%** average speed improvement available with **${capitalizedFastest}**, but **${overallWinner}** provides better overall reliability. Evaluate your specific requirements to choose the best approach.`,
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
    title: "Monitor Performance in Production",
    description:
      "Benchmark results provide guidance, but **production performance** may differ. Monitor actual metrics and adjust your implementation strategy based on real-world usage patterns.",
  });

  // Get the winner's stats for accurate display
  const winnerStats = implStats.find(impl => impl.name === overallWinnerRaw) || implStats[0];
  const winnerAvgTime = winnerStats ? winnerStats.avgTime : 0;

  return `
    <div class="insights-recommendations">
      <h3>Summary</h3>
      <div class="insights-content">
        <div class="insight-card">
          <h4>Performance Leader</h4>
          <p><strong>${overallWinner}</strong> wins ${winCounts[overallWinnerRaw] || 0}/${summary.totalTests || 0} tests.</p>
          <p>Avg time: <strong>${formatFriendlyTime(winnerAvgTime, true)}</strong></p>
          <p><small>Based on composite scoring (speed + consistency + reliability)</small></p>
        </div>

        <div class="insight-card">
          <h4>Raw Speed Comparison</h4>
          <p><strong>${capitalizedFastest}</strong> is <strong>${performanceGap}%</strong> faster than <strong>${capitalizedSlowest}</strong> in average execution time.</p>
          <p><small>Pure speed metric (does not consider consistency)</small></p>
        </div>

        <div class="insight-card">
          <h4>Consistency</h4>
          <p><strong>${capitalizedMostConsistent}</strong> most consistent: RME <strong>${numeral(mostConsistent.avgRME).format("0.00")}%</strong>.</p>
        </div>

        <div class="insight-card">
          <h4>Performance Gap</h4>
          <p>Average performance gap: <strong>${numeral(averageImprovement).format("0.0")}%</strong></p>
          ${fastest.name !== overallWinnerRaw ? `<p><small>Note: ${capitalizedFastest} is faster, but ${overallWinner} wins more tests due to better overall balance.</small></p>` : ""}
        </div>
      </div>

      <h3>Analysis</h3>
      <div class="recommendations-content">
        ${recommendations
          .map((rec, index) => {
            const cleanedDescription = renderMarkdown(rec.description)
              .replace(/undefined/g, "")
              .replace(/^<p[^>]*>\s*/i, "")
              .replace(/\s*<\/p>\s*$/i, "")
              .trim();

            return `
          <div class="recommendation-card recommendation-${rec.type}">
            <h4>${index + 1}. ${rec.title}</h4>
            <p>${cleanedDescription}</p>
          </div>`;
          })
          .join("")}
      </div>

      <div class="conclusion">
        ${generateExecutiveSummaryMarkdown(summary, overallWinnerRaw, implementations)}
      </div>
    </div>
  `;
}

