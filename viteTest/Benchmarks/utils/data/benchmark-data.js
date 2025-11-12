import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const benchmarkDataPath = resolve(__dirname, "../../../../public/api/data-benchmark.json");
export const benchmarkData = JSON.parse(readFileSync(benchmarkDataPath, "utf-8"));
export const benchmarkDir = resolve(__dirname, "../../../../Benchmark");

export const getDataSubset = (data, size) => {
  return data.slice(0, Math.min(size, data.length));
};
