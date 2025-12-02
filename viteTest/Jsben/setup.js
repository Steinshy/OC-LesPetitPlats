// Setup jsben.ch benchmark code snippets
import { generateAppliancesBenchmark } from "@jsben/benchmarks/appliances.js";
import { generateIngredientsBenchmark } from "@jsben/benchmarks/ingredients.js";
import { generateSearchBenchmark } from "@jsben/benchmarks/search.js";
import { generateUtensilsBenchmark } from "@jsben/benchmarks/utensils.js";
import { cleanJsben } from "@viteTest-helper/cleanup.js";
import { getSampleRecipes, writeBenchmarkFiles } from "@viteTest-helper/jsben.js";
import { logHeader, logSuccess, logJsbenNextSteps } from "@viteTest-helper/message.js";
import { getJsbenDir } from "@viteTest-helper/paths.js";

function main() {
  const outputDir = getJsbenDir();
  logHeader("jsben.ch Benchmark Code Generator", 80);

  cleanJsben();

  const sampleRecipes = getSampleRecipes(50);

  const benchmarks = {
    search: generateSearchBenchmark(sampleRecipes),
    ingredients: generateIngredientsBenchmark(sampleRecipes),
    appliances: generateAppliancesBenchmark(sampleRecipes),
    utensils: generateUtensilsBenchmark(sampleRecipes),
  };
  Object.entries(benchmarks).forEach(([name, benchmark]) => {
    writeBenchmarkFiles(outputDir, name, benchmark);
    logSuccess(`Generated: ${name}/`);
  });

  logSuccess("All benchmarks generated! Check the 'benchmark-results/Jsben' folder.");

  logJsbenNextSteps();
}

main();
