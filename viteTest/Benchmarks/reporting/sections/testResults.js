import numeral from "numeral";
import { getImplementations, organizeByCategory } from "@benchmarks-data/results.js";
import { formatFriendlyTime, getSafeNumber, getShortLabel } from "@benchmarks-reporting-helpers/formatting.js";

function calculateAverageQueryOrFilterCount(testNames, uniqueTests, implementations, tests) {
  const counts = testNames
    .map(testName => {
      const impls = uniqueTests.get(testName);
      if (!impls) return null;

      const count = implementations
        .map(impl => impls[impl]?.queryCount ?? impls[impl]?.filterCount)
        .find(val => val !== undefined && val !== null && val !== "N/A") ??
        Object.values(tests[testName] || {})[0]?.queryCount ??
        Object.values(tests[testName] || {})[0]?.filterCount;

      return count !== undefined && count !== null && count !== "N/A" ? Number(count) : null;
    })
    .filter(Boolean);

  return counts.length > 0 ? numeral(counts.reduce((a, b) => a + b, 0) / counts.length).format("0.0") : "-";
}

export function generateDetailedTestResultsHTML(flattened, allResults) {
  if (flattened.length === 0) {
    return "<p>No benchmark results available. Please run the benchmark tests first.</p>";
  }

  const implementations = getImplementations(flattened);
  const categoryResults = organizeByCategory(flattened);

  const categorySummaries = {};
  Object.entries(categoryResults).forEach(([category, tests]) => {
    const categoryData = {
      testCount: Object.keys(tests).length,
      implementations: {},
      winners: {},
    };

    implementations.forEach(impl => {
      const implResults = Object.values(tests)
        .map(testImpls => {
          const timeValue = testImpls[impl]?.mean || testImpls[impl]?.executionTime || 0;
          return typeof timeValue === "number" && !isNaN(timeValue) && isFinite(timeValue)
            ? timeValue
            : null;
        })
        .filter(Boolean);

      if (implResults.length > 0) {
        const avg = implResults.reduce((a, b) => a + b, 0) / implResults.length;
        const min = Math.min(...implResults);
        const max = Math.max(...implResults);
        categoryData.implementations[impl] = {
          avg: typeof avg === "number" && !isNaN(avg) && isFinite(avg) ? avg : 0,
          min: typeof min === "number" && !isNaN(min) && isFinite(min) ? min : 0,
          max: typeof max === "number" && !isNaN(max) && isFinite(max) ? max : 0,
          count: implResults.length,
        };
      }
    });

    // Calculate category winners using the same composite scoring as getSummary()
    // This ensures consistency between category winners and overall winner
    Object.values(tests).forEach(testImpls => {
      const getScore = (impl) => {
        const stats = testImpls[impl];
        if (!stats) return Infinity;

        const time = getSafeNumber(stats.mean || stats.executionTime || 0);
        const rme = getSafeNumber(stats.rme || 0);
        const stdDev = getSafeNumber(stats.stdDev || 0);
        const maxTime = getSafeNumber(stats.max || 0);
        const minTime = getSafeNumber(stats.min || 0);
        const range = maxTime > minTime ? maxTime - minTime : 0;

        // Same composite scoring as collector.js getSummary()
        // Weight: time (100%), RME (10%), stdDev (5%), maxTime (5%), range (2%)
        const rmeWeight = time > 0 ? (rme / 100) * time * 0.1 : 0;
        const stdDevWeight = stdDev * 0.05;
        const maxTimeWeight = maxTime > time ? (maxTime - time) * 0.05 : 0;
        const rangeWeight = range * 0.02;

        return time + rmeWeight + stdDevWeight + maxTimeWeight + rangeWeight;
      };

      const winner = implementations.reduce((prev, current) => {
        const prevScore = getScore(prev);
        const currentScore = getScore(current);

        // If scores are very close (within 1%), use tiebreakers
        if (Math.abs(prevScore - currentScore) / Math.max(prevScore, currentScore, 0.0001) < 0.01) {
          const prevStats = testImpls[prev];
          const currentStats = testImpls[current];
          if (prevStats && currentStats) {
            const prevRME = getSafeNumber(prevStats.rme || 0);
            const currentRME = getSafeNumber(currentStats.rme || 0);
            if (Math.abs(prevRME - currentRME) > 0.01) {
              return prevRME < currentRME ? prev : current;
            }
            const prevStdDev = getSafeNumber(prevStats.stdDev || 0);
            const currentStdDev = getSafeNumber(currentStats.stdDev || 0);
            if (Math.abs(prevStdDev - currentStdDev) > 0.0001) {
              return prevStdDev < currentStdDev ? prev : current;
            }
          }
        }

        return currentScore < prevScore ? current : prev;
      }, implementations[0]);

      categoryData.winners[winner] = (categoryData.winners[winner] || 0) + 1;
    });

    categorySummaries[category] = categoryData;
  });

  const summaryTableHTML = `
      <h3>Summary by Category</h3>
      <div class="table-wrapper">
        <table class="summary-table">
          <tr>
            <th>Category</th>
            <th>Tests</th>
            ${implementations.map(impl => `<th title="${impl}">${getShortLabel(impl)}<br/>Avg (ms)</th>`).join("")}
            <th>Category Winner</th>
          </tr>
          ${Object.entries(categorySummaries)
            .map(([category, data]) => {
              const avgTimes = implementations.map(impl => {
                const stats = data.implementations[impl];
                const avgValue = stats?.avg;
                return stats && typeof avgValue === "number" && !isNaN(avgValue) && isFinite(avgValue)
                  ? formatFriendlyTime(avgValue, false)
                  : "N/A";
              });
              const categoryWinner = Object.entries(data.winners).reduce(
                (prev, current) => (current[1] > prev[1] ? current : prev),
                [implementations[0], 0],
              )[0];

              return `
          <tr>
            <td><strong>${category}</strong></td>
            <td>${data.testCount}</td>
            ${avgTimes.map(time => `<td>${time}</td>`).join("")}
            <td class="winner" title="${categoryWinner}">${getShortLabel(categoryWinner)}<br/><small>(${data.winners[categoryWinner]}/${data.testCount})</small></td>
          </tr>`;
            })
            .join("")}
        </table>
      </div>`;

  const detailedHTML = `
      <h3>Breakdown</h3>
      <div class="detailed-results">
        ${Object.entries(categoryResults)
          .map(([category, tests]) => {
            const uniqueTests = new Map();
            Object.entries(tests).forEach(([testName, impls]) => {
              const normalizedName = testName.trim();
              if (!uniqueTests.has(normalizedName)) {
                uniqueTests.set(normalizedName, impls);
              } else {
                const existing = uniqueTests.get(normalizedName);
                Object.entries(impls).forEach(([impl, stats]) => {
                  const existingTime = existing[impl]?.mean || existing[impl]?.executionTime || Infinity;
                  const newTime = stats.mean || stats.executionTime || 0;
                  if (!existing[impl] || newTime < existingTime) {
                    existing[impl] = {
                      ...stats,
                      queryCount: stats.queryCount ?? existing[impl]?.queryCount,
                      filterCount: stats.filterCount ?? existing[impl]?.filterCount,
                    };
                  }
                });
              }
            });

            const testNames = [...uniqueTests.keys()];
            const categorySummary = categorySummaries[category];
            const categoryWinner = Object.entries(categorySummary.winners).reduce(
              (prev, current) => (current[1] > prev[1] ? current : prev),
              [implementations[0], 0],
            )[0];
            const winnerStats = categorySummary.implementations[categoryWinner];

            return `
        <div class="category-group">
          <h4>${category} <span class="test-count">(${testNames.length} tests)</span></h4>
          <div class="category-stats">
            <div class="stat-item">
              <strong>Winner:</strong> <span class="winner-name">${getShortLabel(categoryWinner)}</span>
              <span class="win-count">(${categorySummary.winners[categoryWinner]}/${testNames.length})</span>
            </div>
            <div class="stat-item">
              <strong>Avg:</strong> ${winnerStats ? formatFriendlyTime(winnerStats.avg, true) : "N/A"}
            </div>
          </div>
          <details class="test-details">
            <summary>View Test Results (${testNames.length})</summary>
            <div class="table-wrapper">
              <table class="compact-table">
                <tr>
                  <th>${category === "Search" ? "Test Case input" : "Test Case"}</th>
                  ${category === "Search" ? "<th>Query Count</th>" : "<th>Filter Count</th>"}
                  ${implementations.map(impl => `<th title="${impl}">${getShortLabel(impl)}</th>`).join("")}
                  <th>Winner</th>
                </tr>
                ${testNames
                  .map(testName => {
                    const impls = uniqueTests.get(testName);
                    if (!impls) return "";

                    const firstImpl = implementations.find(impl => impls[impl]);
                    const queryOrFilterCount = firstImpl
                      ? impls[firstImpl].queryCount ?? impls[firstImpl].filterCount ?? "N/A"
                      : "N/A";

                    const times = implementations.map(impl => {
                      const stats = impls[impl];
                      return stats
                        ? formatFriendlyTime(getSafeNumber(stats.mean || stats.executionTime || 0), false)
                        : "N/A";
                    });

                    const winner = implementations.reduce((prev, current) => {
                      const prevTime = getSafeNumber(impls[prev]?.mean || impls[prev]?.executionTime || Infinity);
                      const currentTime = getSafeNumber(
                        impls[current]?.mean || impls[current]?.executionTime || Infinity,
                      );
                      return currentTime < prevTime ? current : prev;
                    }, implementations[0]);

                    return `
                <tr>
                  <td>${testName}</td>
                  <td>${queryOrFilterCount}</td>
                  ${times.map(time => `<td>${time}</td>`).join("")}
                  <td class="winner" title="${winner}">${getShortLabel(winner)}</td>
                </tr>`;
                  })
                  .join("")}

                ${(() => {
                  const allCategoryTimes = implementations.map(impl => {
                    const stats = categorySummary.implementations[impl];
                    return stats ? formatFriendlyTime(getSafeNumber(stats.avg), false) : "N/A";
                  });
                  const avgQueryOrFilterCount = calculateAverageQueryOrFilterCount(
                    testNames,
                    uniqueTests,
                    implementations,
                    tests,
                  );
                  const allLabelMap = {
                    Search: "All query",
                    Ingredients: "All ingredient",
                    Appliances: "All appliance",
                    utensils: "All ustensil",
                    Combined: "All combined",
                  };
                  const allLabel = allLabelMap[category] || `All ${category.toLowerCase()}`;
                  const wasAllTestSkipped =
                    ["Ingredients", "Appliances", "utensils"].includes(category) &&
                    allResults.runAllTests === false;
                  const allTestExists = testNames.some(
                    name => name.toLowerCase().includes("all") || name.toLowerCase().startsWith("all "),
                  );

                  if (wasAllTestSkipped && !allTestExists) {
                    return `
                <tr class="summary-row skipped-row" style="opacity: 0.6;">
                  <td><strong>${allLabel}</strong> <span style="color: #2563eb; font-size: 0.85em;">(Skipped)</span></td>
                  <td><strong>-</strong></td>
                  ${implementations.map(() => "<td><strong>-</strong></td>").join("")}
                  <td><strong>-</strong></td>
                </tr>`;
                  }

                  return `
                <tr class="summary-row">
                  <td><strong>${allLabel}</strong></td>
                  <td><strong>${avgQueryOrFilterCount}</strong></td>
                  ${allCategoryTimes.map(time => `<td><strong>${time}</strong></td>`).join("")}
                  <td class="winner" title="${categoryWinner}"><strong>${getShortLabel(categoryWinner)}</strong></td>
                </tr>`;
                })()}
              </table>
            </div>
          </details>
        </div>`;
          })
          .join("")}
      </div>`;

  return summaryTableHTML + detailedHTML;
}

