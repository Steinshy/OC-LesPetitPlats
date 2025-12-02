import numeral from "numeral";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "@benchmarks-data/results.js";
import { formatFriendlyTime, getSafeNumber, getShortLabel, capitalize } from "@benchmarks-reporting-helpers/formatting.js";

export function generateImplementationBreakdown(flattened, summary) {
  if (flattened.length === 0) {
    return "<p>No benchmark data available.</p>";
  }

  const implementations = getImplementations(flattened);
  const winCounts = summary.winCounts || {};
  const totalTests = summary.totalTests || 0;

  const implDetails = implementations
    .map(impl => {
      const implResults = flattened.filter(r => r.implementation === impl);
      const times = implResults
        .map(r => getSafeNumber(r.mean || r.executionTime || 0))
        .filter(t => t > 0);
      const wins = winCounts[impl] || 0;

      return {
        name: impl,
        shortName: getShortLabel(impl, 20),
        avgTime: getAverageExecutionTime(flattened, impl),
        avgRME: getAverageRME(flattened, impl),
        wins,
        winPercentage: totalTests > 0 ? numeral((wins / totalTests) * 100).format("0.0") : "0.0",
        minTime: times.length > 0 ? Math.min(...times) : 0,
        maxTime: times.length > 0 ? Math.max(...times) : 0,
        totalRuns: implResults.length,
      };
    })
    .sort((a, b) => {
      // Primary sort: by wins (descending) - more wins = better rank
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      // Secondary sort: by average time (ascending) - faster = better rank
      return a.avgTime - b.avgTime;
    });

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
            .map((impl, index) => {
              const rowClass = index === 0 ? "fastest-row" : index === 1 ? "second-row" : "";
              const badge = index === 0 ? ' <span class="badge">Fastest</span>' : index === 1 ? ' <span class="badge badge-second">Second</span>' : "";
              return `
          <tr class="${rowClass}">
            <td><strong>#${index + 1}</strong>${badge}</td>
            <td title="${capitalize(impl.name)}"><strong>${impl.shortName}</strong></td>
            <td>${formatFriendlyTime(getSafeNumber(impl.avgTime), false)}</td>
            <td>${formatFriendlyTime(getSafeNumber(impl.minTime), false)}</td>
            <td>${formatFriendlyTime(getSafeNumber(impl.maxTime), false)}</td>
            <td>${numeral(getSafeNumber(impl.avgRME)).format("0.00")}%</td>
            <td>${impl.wins}/${totalTests}</td>
            <td>${impl.winPercentage}%</td>
          </tr>`;
            })
            .join("")}
        </table>
      </div>
    </div>
  `;
}

