// Calculation utilities for benchmark measurements

export function calculateImprovement(baselineTime, comparisonTime) {
  if (baselineTime === 0) {
    return comparisonTime === 0 ? 0 : -Infinity;
  }
  return ((baselineTime - comparisonTime) / baselineTime) * 100;
}
