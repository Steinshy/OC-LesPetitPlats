// Comparison utilities for benchmark results
import { calculateImprovement } from "./measurement.js";

export function compareResults(
  result1,
  result2,
  name1 = "Implementation 1",
  name2 = "Implementation 2",
) {
  const improvement = calculateImprovement(result1.avg, result2.avg);
  const faster = result1.avg < result2.avg ? name1 : name2;
  const slower = result1.avg < result2.avg ? name2 : name1;

  return {
    faster,
    slower,
    improvement: Math.abs(improvement),
    isFaster: result1.avg < result2.avg,
    result1: {
      name: name1,
      ...result1,
    },
    result2: {
      name: name2,
      ...result2,
    },
  };
}
