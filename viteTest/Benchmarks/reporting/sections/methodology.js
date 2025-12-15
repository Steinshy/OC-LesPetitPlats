import { readFileSync } from "node:fs";
import { join } from "node:path";
import si from "systeminformation";
import { renderMarked } from "@benchmarks-reporting-helpers/markdown.js";
import { BENCHMARK_TIME, MAX_ITERATIONS, WARMUP_TIME, WARMUP_ITERATIONS } from "@benchmarks-utils/measurement.js";

export async function generateMethodologyNotes() {
  const [osInfo, cpuInfo, memInfo] = await Promise.all([
    si.osInfo(),
    si.cpu(),
    si.mem(),
  ]);

  const memoryMatch = (process.env.NODE_OPTIONS || "").match(/--max-old-space-size=(\d+)/);
  const memoryLimit = memoryMatch ? `${parseInt(memoryMatch[1]) / 1024}GB` : "Default";

  let vitestVersion = "N/A";
  try {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"));
    vitestVersion = (packageJson.devDependencies?.vitest || packageJson.dependencies?.vitest || "N/A").replace(/^[\^~]/, "");
  } catch (_error) {
    // Keep N/A if can't read package.json
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
- **Node.js Version:** ${process.version}
- **Operating System:** ${osInfo.distro} ${osInfo.release || ""} (${osInfo.platform})
- **CPU:** ${cpuInfo.manufacturer} ${cpuInfo.brand} (${cpuInfo.cores} cores, ${cpuInfo.physicalCores} physical)
- **CPU Architecture:** ${cpuInfo.architecture || process.arch}
- **Total Memory:** ${(memInfo.total / (1024 ** 3)).toFixed(2)}GB
- **Memory Limit:** ${memoryLimit}

### Metrics

- **Mean:** Average execution time across all iterations
- **Min/Max:** Best and worst case execution times
- **RME:** Relative Measurement Error

### Categories

- **Search:** Text-based recipe search functionality
- **Ingredients:** Filtering recipes by ingredient criteria
- **Appliances:** Filtering recipes by appliance requirements
- **utensils:** Filtering recipes by utensil needs

### Implementations

This benchmark compares two implementation approaches:

- **Production:** Implementation from \`production.js\` using \`.map()\` and \`.filter()\` array methods for functional programming patterns
- **ForEach:** Implementation from \`forEach.js\` using \`forEach\` loops for iteration and filtering operations

### Process

Each benchmark follows a standardized measurement protocol:

1. **Warmup Phase:** ${WARMUP_ITERATIONS} iterations are executed over ${WARMUP_TIME}ms to eliminate JIT compilation effects and ensure consistent performance measurements.

2. **Execution Phase:** Multiple timed iterations (up to ${MAX_ITERATIONS} per test) are executed over ${BENCHMARK_TIME}ms to collect statistically significant performance data.

3. **Analysis:** Results are analyzed to calculate mean execution time, minimum/maximum values, and Relative Measurement Error (RME) to assess consistency and reliability.

4. **Ranking:** Implementations are ranked using a composite scoring system that considers execution time (primary), Relative Measurement Error (RME) for consistency, standard deviation for variance, and worst-case performance for stability. The implementation with the best composite score wins each test scenario.

> **Note:** Results may vary based on system load, CPU architecture, and Node.js version. Always test on target production environments before making implementation decisions.
  `.trim();

  return `
    <div class="methodology-notes">
      <div class="methodology-content markdown-content">
        ${renderMarked(markdownContent)}
      </div>
    </div>
  `;
}

