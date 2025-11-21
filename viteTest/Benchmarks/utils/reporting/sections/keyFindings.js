// Key findings section generator
import numeral from "numeral";
import { getAverageExecutionTime, getAverageRME, getImplementations } from "../../data/results.js";

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
  const winPercentage =
    totalTests > 0 ? numeral((winnerWins / totalTests) * 100).format("0.0") : "0.0";

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
        gap: numeral(gap).format("0.0"),
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
          <h4>Avg Improvement</h4>
          <p class="finding-value">${numeral(averageImprovement).format("0.0")}%</p>
          <p class="finding-detail">${fastest.name} vs ${slowest.name}</p>
        </div>
        <div class="finding-card">
          <h4>Most Consistent</h4>
          <p class="finding-value">${mostConsistent.name}</p>
          <p class="finding-detail">RME: ${numeral(mostConsistent.avgRME).format("0.00")}%</p>
        </div>
        <div class="finding-card">
          <h4>Fastest</h4>
          <p class="finding-value">${fastest.name}</p>
          <p class="finding-detail">${numeral(fastest.avgTime).format("0.00")}ms avg</p>
        </div>
        ${
          gaps.length > 0
            ? `
        <div class="finding-card finding-card-wide">
          <h4>Performance Gaps</h4>
          <ul>
            ${gaps.map(gap => `<li>${gap.from} → ${gap.to}: +${gap.gap}%</li>`).join("")}
          </ul>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

