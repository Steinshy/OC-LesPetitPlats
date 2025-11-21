// Methodology section generator
import { readFileSync } from "fs";
import { cpus } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  BENCHMARK_TIME,
  MAX_ITERATIONS,
  WARMUP_TIME,
  WARMUP_ITERATIONS,
} from "../../measurement/measurement.js";
import { renderMarked } from "../helpers/markdown.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function generateMethodologyNotes() {
  // Get system information
  const nodeVersion = process.version;
  const platform = process.platform;
  const arch = process.arch;
  const cpuCount = cpus().length;

  // Format OS name nicely
  const osNames = {
    darwin: "macOS",
    linux: "Linux",
    win32: "Windows",
  };
  const osName = osNames[platform] || platform;

  // Get memory limit from NODE_OPTIONS
  const nodeOptions = process.env.NODE_OPTIONS || "";
  const memoryMatch = nodeOptions.match(/--max-old-space-size=(\d+)/);
  const memoryLimit = memoryMatch ? `${parseInt(memoryMatch[1]) / 1024}GB` : "Default";

  // Get Vitest version from package.json
  let vitestVersion = "N/A";
  try {
    const packageJsonPath = join(dirname(__filename), "../../../../../package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    vitestVersion =
      packageJson.devDependencies?.vitest || packageJson.dependencies?.vitest || "N/A";
    // Remove ^ or ~ prefix if present
    vitestVersion = vitestVersion.replace(/^[\^~]/, "");
  } catch (_error) {
    // If we can't read package.json, keep N/A
  }

  const markdownContent = `
## Benchmark Methodology

### Framework

- **Framework:** Vite
- **Test Runner:** Vitest ${vitestVersion}
- **Tool:** TinyBench
- **Duration:** ${BENCHMARK_TIME}ms/test
- **Warmup:** ${WARMUP_TIME}ms (${WARMUP_ITERATIONS} iter)
- **Max Iter:** ${MAX_ITERATIONS}/test
- **Unit:** ms
- **Node.js Version:** ${nodeVersion}
- **Operating System:** ${osName}
- **CPU Cores:** ${cpuCount}
- **CPU Architecture:** ${arch}
- **Memory Limit:** ${memoryLimit}

### Metrics

- **Mean:** Average execution time across all iterations
- **Min/Max:** Best and worst case execution times
- **RME:** Relative Measurement Error

### Categories

- **Search:** Text-based recipe search functionality
- **Ingredients:** Filtering recipes by ingredient criteria
- **Appliances:** Filtering recipes by appliance requirements
- **Ustensils:** Filtering recipes by utensil needs

### Implementations

This benchmark compares two implementation approaches:

- **Production:** A traditional implementation using \`forEach\` loops for iteration and filtering operations
- **Maps:** A modern implementation leveraging \`map\` and \`filter\` array methods for functional programming patterns

### Process

Each benchmark follows a standardized measurement protocol:

1. **Warmup Phase:** ${WARMUP_ITERATIONS} iterations are executed over ${WARMUP_TIME}ms to eliminate JIT compilation effects and ensure consistent performance measurements.

2. **Execution Phase:** Multiple timed iterations (up to ${MAX_ITERATIONS} per test) are executed over ${BENCHMARK_TIME}ms to collect statistically significant performance data.

3. **Analysis:** Results are analyzed to calculate mean execution time, minimum/maximum values, and Relative Measurement Error (RME) to assess consistency and reliability.

4. **Ranking:** Implementations are ranked by their average execution time, with the fastest implementation identified as the winner for each test scenario.

> **Note:** Results may vary based on system load, CPU architecture, and Node.js version. Always test on target production environments before making implementation decisions.
  `.trim();

  // Convert markdown to HTML using marked
  const htmlContent = renderMarked(markdownContent);

  return `
    <div class="methodology-notes">
      <div class="methodology-content markdown-content">
        ${htmlContent}
      </div>
    </div>
  `;
}

