// Detailed test results section generator
import numeral from "numeral";
import { getImplementations, organizeByCategory } from "../../data/results.js";
import { formatFriendlyTime, getSafeNumber } from "../helpers/formatting.js";

// Calculate average query/filter count for summary row
function calculateAverageQueryOrFilterCount(testNames, uniqueTests, implementations, tests) {
  let avgQueryOrFilterCount = "-";
  const queryOrFilterCounts = [];

  testNames.forEach(testName => {
    const impls = uniqueTests.get(testName);
    if (!impls) return;

    // Try to find queryCount/filterCount from any implementation
    let count = null;
    for (const impl of implementations) {
      if (impls[impl]) {
        count = impls[impl].queryCount ?? impls[impl].filterCount;
        if (count !== undefined && count !== null && count !== "N/A") {
          break;
        }
      }
    }
    // If still not found, check the original test data
    if (count === null || count === undefined) {
      const testData = tests[testName];
      if (testData) {
        const firstImplData = Object.values(testData)[0];
        if (firstImplData) {
          count = firstImplData.queryCount ?? firstImplData.filterCount;
        }
      }
    }
    if (count !== undefined && count !== null && count !== "N/A") {
      queryOrFilterCounts.push(Number(count));
    }
  });

  if (queryOrFilterCounts.length > 0) {
    const avg = queryOrFilterCounts.reduce((a, b) => a + b, 0) / queryOrFilterCounts.length;
    avgQueryOrFilterCount = numeral(avg).format("0.0");
  }

  return avgQueryOrFilterCount;
}

export function generateDetailedTestResultsHTML(flattened, allResults) {
  if (flattened.length === 0) {
    return "<p>No benchmark results available. Please run the benchmark tests first.</p>";
  }

  const implementations = getImplementations(flattened);
  const categoryResults = organizeByCategory(flattened);

  // Create short labels for table headers (similar to chart labels)
  const getShortLabel = impl => {
    if (impl.includes("Production") || impl.includes("forEach")) return "Production";
    if (impl.includes("Maps") || impl.includes("map/filter")) return "Maps";
    return impl.length > 15 ? `${impl.substring(0, 15)}...` : impl;
  };

  // Calculate summary statistics per category
  const categorySummaries = {};
  Object.entries(categoryResults).forEach(([category, tests]) => {
    const categoryData = {
      testCount: Object.keys(tests).length,
      implementations: {},
      winners: {},
    };

    // Calculate averages per implementation for this category
    implementations.forEach(impl => {
      const implResults = [];
      Object.values(tests).forEach(testImpls => {
        if (testImpls[impl]) {
          const timeValue = testImpls[impl].mean || testImpls[impl].executionTime || 0;
          // Filter out NaN and invalid values
          if (typeof timeValue === "number" && !isNaN(timeValue) && isFinite(timeValue)) {
            implResults.push(timeValue);
          }
        }
      });

      if (implResults.length > 0) {
        const avg = implResults.reduce((a, b) => a + b, 0) / implResults.length;
        const min = Math.min(...implResults);
        const max = Math.max(...implResults);
        categoryData.implementations[impl] = {
          avg,
          min,
          max,
          count: implResults.length,
        };
      }
    });

    // Count winners per implementation in this category
    Object.values(tests).forEach(testImpls => {
      const winner = implementations.reduce((prev, current) => {
        const prevTime = testImpls[prev]
          ? testImpls[prev].mean || testImpls[prev].executionTime || Infinity
          : Infinity;
        const currentTime = testImpls[current]
          ? testImpls[current].mean || testImpls[current].executionTime || Infinity
          : Infinity;
        return currentTime < prevTime ? current : prev;
      }, implementations[0]);
      categoryData.winners[winner] = (categoryData.winners[winner] || 0) + 1;
    });

    categorySummaries[category] = categoryData;
  });

  // Generate summary table by category
  let summaryTableHTML = `
      <h3>Summary by Category</h3>
      <div class="table-wrapper">
        <table class="summary-table">
          <tr>
            <th>Category</th>
            <th>Tests</th>
            ${implementations.map(impl => `<th title="${impl}">${getShortLabel(impl)}<br/>Avg (ms)</th>`).join("")}
            <th>Category Winner</th>
          </tr>`;

  Object.entries(categorySummaries).forEach(([category, data]) => {
    const avgTimes = implementations.map(impl => {
      const stats = data.implementations[impl];
      if (!stats) return "N/A";
      const avgValue = stats.avg;
      // Check for NaN or invalid values
      if (typeof avgValue !== "number" || isNaN(avgValue) || !isFinite(avgValue)) {
        return "N/A";
      }
      return numeral(avgValue).format("0.0000");
    });

    // Find category winner (implementation with most wins)
    const categoryWinner = Object.entries(data.winners).reduce(
      (prev, current) => (current[1] > prev[1] ? current : prev),
      [implementations[0], 0],
    )[0];

    summaryTableHTML += `
          <tr>
            <td><strong>${category}</strong></td>
            <td>${data.testCount}</td>
            ${avgTimes.map(time => `<td>${time}</td>`).join("")}
            <td class="winner" title="${categoryWinner}">${getShortLabel(categoryWinner)}<br/><small>(${data.winners[categoryWinner]}/${data.testCount})</small></td>
          </tr>`;
  });

  summaryTableHTML += `
        </table>
      </div>`;

  // Generate detailed breakdown (collapsible or compact)
  let detailedHTML = `
      <h3>Breakdown</h3>
      <div class="detailed-results">`;

  Object.entries(categoryResults).forEach(([category, tests]) => {
    // Deduplicate test names - normalize and ensure each test appears only once
    // Use Map to preserve the first occurrence and merge any duplicates
    const uniqueTests = new Map();
    Object.entries(tests).forEach(([testName, impls]) => {
      const normalizedName = testName.trim();
      // If we haven't seen this test name, add it
      // If we have, merge implementations (in case of duplicates)
      if (!uniqueTests.has(normalizedName)) {
        uniqueTests.set(normalizedName, impls);
      } else {
        // Merge implementations if duplicate found
        const existing = uniqueTests.get(normalizedName);
        Object.entries(impls).forEach(([impl, stats]) => {
          if (
            !existing[impl] ||
            (stats.mean || stats.executionTime || 0) <
              (existing[impl].mean || existing[impl].executionTime || Infinity)
          ) {
            // Preserve queryCount and filterCount when merging
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
    const categoryWinner = Object.entries(categorySummaries[category].winners).reduce(
      (prev, current) => (current[1] > prev[1] ? current : prev),
      [implementations[0], 0],
    )[0];

    detailedHTML += `
        <div class="category-group">
          <h4>${category} <span class="test-count">(${testNames.length} tests)</span></h4>
          <div class="category-stats">
            <div class="stat-item">
              <strong>Winner:</strong> <span class="winner-name">${getShortLabel(categoryWinner)}</span>
              <span class="win-count">(${categorySummaries[category].winners[categoryWinner]}/${testNames.length})</span>
            </div>
            <div class="stat-item">
              <strong>Avg:</strong> ${(() => {
                const winnerStats = categorySummaries[category].implementations[categoryWinner];
                if (!winnerStats) return "N/A";
                const avgValue = winnerStats.avg;
                return formatFriendlyTime(avgValue, true);
              })()}
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
                </tr>`;

    // Display each unique test case only once
    testNames.forEach(testName => {
      const impls = uniqueTests.get(testName);
      if (!impls) return;

      // Get query/filter count from first available implementation
      const firstImpl = implementations.find(impl => impls[impl]);
      const queryOrFilterCount = firstImpl
        ? (impls[firstImpl].queryCount ?? impls[firstImpl].filterCount ?? "N/A")
        : "N/A";

      const times = implementations.map(impl => {
        const stats = impls[impl];
        if (!stats) return "N/A";
        const timeValue = getSafeNumber(stats.mean || stats.executionTime || 0);
        return formatFriendlyTime(timeValue, false);
      });
      const winner = implementations.reduce((prev, current) => {
        const prevTime = impls[prev]
          ? impls[prev].mean || impls[prev].executionTime || Infinity
          : Infinity;
        const currentTime = impls[current]
          ? impls[current].mean || impls[current].executionTime || Infinity
          : Infinity;
        return currentTime < prevTime ? current : prev;
      }, implementations[0]);

      detailedHTML += `
                <tr>
                  <td>${testName}</td>
                  <td>${queryOrFilterCount}</td>
                  ${times.map(time => `<td>${time}</td>`).join("")}
                  <td class="winner" title="${winner}">${getShortLabel(winner)}</td>
                </tr>`;
    });

    // Add summary row for all tests in this category
    const categorySummaryData = categorySummaries[category];
    const allCategoryTimes = implementations.map(impl => {
      const stats = categorySummaryData.implementations[impl];
      if (!stats) return "N/A";
      const avgValue = getSafeNumber(stats.avg);
      return formatFriendlyTime(avgValue, false);
    });
    const allCategoryWinner = categoryWinner;

    // Calculate average query/filter count for summary row
    const avgQueryOrFilterCount = calculateAverageQueryOrFilterCount(
      testNames,
      uniqueTests,
      implementations,
      tests,
    );

    // Create label for "All" row based on category
    const allLabelMap = {
      Search: "All query",
      Ingredients: "All ingredient",
      Appliances: "All appliance",
      Ustensils: "All ustensil",
      Combined: "All combined",
    };
    const allLabel = allLabelMap[category] || `All ${category.toLowerCase()}`;

    // Check if "All" tests were skipped for this category
    const categoriesWithAllTests = ["Ingredients", "Appliances", "Ustensils"];
    const wasAllTestSkipped =
      categoriesWithAllTests.includes(category) && allResults.runAllTests === false;

    // Check if "All" test actually exists in the results
    const allTestExists = testNames.some(
      name => name.toLowerCase().includes("all") || name.toLowerCase().startsWith("all "),
    );

    if (wasAllTestSkipped && !allTestExists) {
      // Show skipped status for "All" test
      detailedHTML += `
                <tr class="summary-row skipped-row" style="opacity: 0.6;">
                  <td><strong>${allLabel}</strong> <span style="color: #2563eb; font-size: 0.85em;">(Skipped)</span></td>
                  <td><strong>-</strong></td>
                  ${implementations.map(() => "<td><strong>-</strong></td>").join("")}
                  <td><strong>-</strong></td>
                </tr>`;
    } else {
      // Show normal summary row
      detailedHTML += `
                <tr class="summary-row">
                  <td><strong>${allLabel}</strong></td>
                  <td><strong>${avgQueryOrFilterCount}</strong></td>
                  ${allCategoryTimes.map(time => `<td><strong>${time}</strong></td>`).join("")}
                  <td class="winner" title="${allCategoryWinner}"><strong>${getShortLabel(allCategoryWinner)}</strong></td>
                </tr>`;
    }

    detailedHTML += `
              </table>
            </div>
          </details>
        </div>`;
  });

  detailedHTML += `
      </div>`;

  return summaryTableHTML + detailedHTML;
}

