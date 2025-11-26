// Implementation breakdown section generator
import numeral from "numeral";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "../../data/results.js";
import { formatFriendlyTime, getSafeNumber } from "../helpers/formatting.js";

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

