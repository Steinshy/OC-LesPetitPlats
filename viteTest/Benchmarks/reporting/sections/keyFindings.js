import numeral from "numeral";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "@benchmarks-data/results.js";
import { formatFriendlyTime, capitalize } from "@benchmarks-reporting-helpers/formatting.js";

export function generateKeyFindings(flattened, summary) {
  if (flattened.length === 0) {
    return '<div class="key-findings"><p>No benchmark data available.</p></div>';
  }

  const implementations = getImplementations(flattened);
  const totalTests = summary.totalTests || 0;
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

  const mostConsistent = implStats.reduce((prev, current) =>
    prev.avgRME < current.avgRME ? prev : current,
  );
  const fastest = implStats.reduce((prev, current) => {
    const prevTime = typeof prev.avgTime === "number" && !isNaN(prev.avgTime) && isFinite(prev.avgTime) ? prev.avgTime : Infinity;
    const currentTime = typeof current.avgTime === "number" && !isNaN(current.avgTime) && isFinite(current.avgTime) ? current.avgTime : Infinity;
    return currentTime < prevTime ? current : prev;
  });
  const sortedByTime = [...implStats].sort((a, b) => {
    const aTime = typeof a.avgTime === "number" && !isNaN(a.avgTime) && isFinite(a.avgTime) ? a.avgTime : Infinity;
    const bTime = typeof b.avgTime === "number" && !isNaN(b.avgTime) && isFinite(b.avgTime) ? b.avgTime : Infinity;
    return aTime - bTime;
  });
  const slowest = sortedByTime[sortedByTime.length - 1];
  const winnerWins = winCounts[overallWinnerRaw] || 0;
  const winPercentage = totalTests > 0 ? numeral((winnerWins / totalTests) * 100).format("0.0") : "0.0";
  const capitalizedFastest = capitalize(fastest.name);
  const capitalizedSlowest = capitalize(slowest.name);

  const gaps = sortedByTime
    .slice(0, -1)
    .map((current, i) => {
      const next = sortedByTime[i + 1];
      const gap = current.avgTime > 0 ? ((next.avgTime - current.avgTime) / current.avgTime) * 100 : 0;
      return gap > 20 ? { from: current.name, to: next.name, gap: numeral(gap).format("0.0") } : null;
    })
    .filter(Boolean);

  return `
    <div class="key-findings">
      <div class="findings-grid">
        <div class="finding-card">
          <h4>Overall Winner</h4>
          <p class="finding-value">${overallWinner}</p>
          <p class="finding-detail">Wins ${winnerWins} of ${totalTests} tests (${winPercentage}%)</p>
        </div>
        <div class="finding-card">
          <h4>Avg Improvement</h4>
          <p class="finding-value">${numeral(averageImprovement).format("0.0")}%</p>
          <p class="finding-detail">${capitalizedFastest} vs ${capitalizedSlowest}</p>
        </div>
        <div class="finding-card">
          <h4>Most Consistent</h4>
          <p class="finding-value">${capitalize(mostConsistent.name)}</p>
          <p class="finding-detail">RME: ${typeof mostConsistent.avgRME === "number" && !isNaN(mostConsistent.avgRME) && isFinite(mostConsistent.avgRME) ? `${numeral(mostConsistent.avgRME).format("0.00")  }%` : "N/A"}</p>
        </div>
        <div class="finding-card">
          <h4>Fastest</h4>
          <p class="finding-value">${capitalizedFastest}</p>
          <p class="finding-detail">${typeof fastest.avgTime === "number" && !isNaN(fastest.avgTime) && isFinite(fastest.avgTime) ? `${formatFriendlyTime(fastest.avgTime, true)  } avg` : "N/A"}</p>
        </div>
        ${
          gaps.length > 0
            ? `
        <div class="finding-card finding-card-wide">
          <h4>Performance Gaps</h4>
          <ul>
            ${gaps.map(gap => `<li>${capitalize(gap.from)} → ${capitalize(gap.to)}: +${gap.gap}%</li>`).join("")}
          </ul>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

