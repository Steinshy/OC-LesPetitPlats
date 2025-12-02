// Jsben benchmark generation utilities
import { resolve } from "node:path";
import { writeFile, ensureDirectory, readFile } from "@viteTest-helper/fileSystem.js";

// Normalize function code snippets for benchmarks
export const normalizeString = `const normalizeString = value =>
  String(value || "")
    .replace(/\\s*\\([^)]*\\)/g, "")
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .trim()
    .toLowerCase();`;

export const canonicalizeTerm = "const canonicalizeTerm = value => normalizeString(value);";

// Path to benchmark data file (public/api/data.json)
const getDataPath = () => {
  return resolve(process.cwd(), "public/api/data.json");
};


export function loadRecipes() {
  const dataPath = getDataPath();
  const content = readFile(dataPath);
  if (!content) {
    throw new Error(`Failed to load recipes from ${dataPath}`);
  }
  return JSON.parse(content);
}

export function getSampleRecipes(count = 50) {
  const recipes = loadRecipes();
  return recipes.slice(0, count);
}


export function writeBenchmarkFiles(outputDir, name, benchmark) {
  const benchmarkDir = resolve(outputDir, name);
  ensureDirectory(benchmarkDir);

  const setupFile = resolve(benchmarkDir, "setup.js");
  const testProductionFile = resolve(benchmarkDir, "test-production.js");
  const testForEachFile = resolve(benchmarkDir, "test-forEach.js");

  const eslintDisable = "/* eslint-disable */\n";

  writeFile(setupFile, eslintDisable + benchmark.setup);
  writeFile(testProductionFile, eslintDisable + benchmark.production);
  writeFile(testForEachFile, eslintDisable + benchmark.forEach);
}

