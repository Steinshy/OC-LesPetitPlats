// Benchmark-specific logging utilities
import { PRODUCTION_LABEL, MAPS_LABEL } from "@benchmarks-config/constants.js";
import { getAllResults } from "@benchmarks-data/collector.js";
import { colors, logSection } from "@viteTest-helper/message.js";

// Helper functions for benchmark logging
function logBenchmarkResult(label, value, unit = "ms", isWinner = false) {
  const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
  const color = isWinner ? colors.success : colors.dim;
  const winnerIcon = isWinner ? "✓ " : "  ";
  console.log(`  ${winnerIcon}${color(label.padEnd(18))} ${colors.bold(formattedValue)}${unit}`);
}

function logComparison(winner, improvement, faster, slower) {
  console.log(
    `\n  ${colors.success("✓ Winner:")} ${colors.bold(winner)} ${colors.dim("•")} ${colors.info(`+${improvement.toFixed(2)}%`)} ${colors.dim(`faster than ${slower}`)}`,
  );
}

function logMemory(label, value, unit = "MB") {
  console.log(`  ${colors.dim(label.padEnd(20))} ${colors.bold(value.toFixed(2))}${unit}`);
}

function _logCategorySummaryInternal(category, stats) {
  logSection(`${category} Summary`, "📈");
  console.log(`  ${colors.bold("Tests:")} ${stats.testCount}`);
  console.log(
    `  ${colors.bold("Winner:")} ${colors.success(stats.winner)} (${stats.wins}/${stats.testCount} wins)`,
  );
  console.log(`  ${colors.bold("Avg Time:")} ${stats.avgTime.toFixed(4)}ms`);
  if (stats.improvement) {
    console.log(
      `  ${colors.bold("Improvement:")} ${colors.success(stats.improvement.toFixed(2))}%`,
    );
  }
}

export function logBenchmarkComparison(productionStats, mapsStats, comparison) {
  const productionLabel = comparison.baselineResult?.name || comparison.result1?.name || PRODUCTION_LABEL;
  const mapsLabel = comparison.comparisonResult?.name || comparison.result2?.name || MAPS_LABEL;

  const prodTime = productionStats.avg || productionStats.mean || 0;
  const mapsTime = mapsStats.avg || mapsStats.mean || 0;
  const isProductionWinner = prodTime < mapsTime;

  logBenchmarkResult(productionLabel, prodTime, "ms", isProductionWinner);
  logBenchmarkResult(mapsLabel, mapsTime, "ms", !isProductionWinner);

  logComparison(
    comparison.faster,
    comparison.improvement,
    comparison.faster,
    comparison.slower || mapsLabel,
  );
}

export function logBenchmarkSection(
  title,
  productionStats,
  mapsStats,
  comparison,
  category = null,
) {
  const categoryLabel = category || "Benchmark";

  logSection(`${categoryLabel} - ${title}`);
  logBenchmarkComparison(productionStats, mapsStats, comparison);
}

export function logMemoryComparison(title, productionMemory, mapsMemory) {
  logSection(title);
  logMemory(PRODUCTION_LABEL, productionMemory);
  logMemory(MAPS_LABEL, mapsMemory);
}

export function logCategorySummary(category, categoryLabel, allLabel) {
  const isCoverageMode = process.argv.some(arg => arg.includes("--coverage") || arg.includes("coverage"));
  if (isCoverageMode) {
    return;
  }

  setTimeout(() => {
    let allResults;
    try {
      allResults = getAllResults();
    } catch (_error) {
      return;
    }

    if (!allResults || !allResults[category] || allResults[category].length === 0) {
      return;
    }

    const categoryTests = allResults[category];

    let productionTotal = 0;
    let mapsTotal = 0;
    let productionCount = 0;
    let mapsCount = 0;
    let productionWins = 0;
    let mapsWins = 0;

    categoryTests.forEach(result => {
      if (result.functionalStats) {
        const prodTime = result.functionalStats.avg || result.functionalStats.mean || 0;
        productionTotal += prodTime;
        productionCount++;
      }
      if (result.loopStats) {
        const mapsTime = result.loopStats.avg || result.loopStats.mean || 0;
        mapsTotal += mapsTime;
        mapsCount++;
      }

      if (result.comparison) {
        const winner = result.comparison.faster || "";
        if (winner.includes("Production") || winner.includes(PRODUCTION_LABEL)) {
          productionWins++;
        } else if (winner.includes("Maps") || winner.includes(MAPS_LABEL)) {
          mapsWins++;
        }
      }
    });

    const productionAvg = productionCount > 0 ? productionTotal / productionCount : 0;
    const mapsAvg = mapsCount > 0 ? mapsTotal / mapsCount : 0;
    const winner = productionAvg < mapsAvg ? PRODUCTION_LABEL : MAPS_LABEL;
    const improvement =
      productionAvg > 0 && mapsAvg > 0
        ? ((Math.max(productionAvg, mapsAvg) - Math.min(productionAvg, mapsAvg)) /
            Math.max(productionAvg, mapsAvg)) *
          100
        : 0;

    _logCategorySummaryInternal(allLabel, {
      testCount: categoryTests.length,
      winner,
      wins: winner === PRODUCTION_LABEL ? productionWins : mapsWins,
      avgTime: winner === PRODUCTION_LABEL ? productionAvg : mapsAvg,
      improvement,
    });
  }, 0);
}

