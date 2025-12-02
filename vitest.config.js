import { tmpdir } from "node:os";
import { join } from "node:path";
import si from "systeminformation";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const cpuInfo = await si.cpu();
const CPU_COUNT = cpuInfo.cores || cpuInfo.physicalCores || 1;

// Use system temp directory for coverage when using forks to avoid temp files in benchmark-results
const isForksPool = process.argv.includes("--pool=forks");
const coverageReportsDir = isForksPool
  ? join(tmpdir(), "lespetitplats-coverage")
  : "benchmark-results/Unit";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["viteTest/**/*.test.js"],
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        useAtomics: true,
        minThreads: 1,
        maxThreads: CPU_COUNT,
      },
    },
    maxWorkers: CPU_COUNT,
    minWorkers: 1,
    teardownTimeout: 30000,
    testTimeout: 30000,
    globalSetup: ["viteTest/Benchmarks/setup.js"],
    setupFiles: ["viteTest/Unit/setup.js"],
    reporters: [
      [
        "default",
        {
          summary: false,
        },
      ],
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: coverageReportsDir,
      all: false,
      skipFull: true,
      include: ["src/**/*.js"],
      exclude: [
        "node_modules/",
        "dist/",
        "benchmark-results/Unit/",
        "temp/",
        "**/*.config.js",
        "stryker.conf.js",
        "viteTest/**/*.test.js",
        "viteTest/Benchmarks/**",
        "**/*.test.js",
        "**/*.spec.js",
        "scripts/**",
        "public/**",
        "**/index.html",
        "**/README.md",
        "**/robots.txt",
        "**/sitemap.xml",
        "src/App.js",
        "src/card.js",
        "src/utils/toast.js",
        "src/components/dropdown.js",
        "src/components/headerImage.js",
        "src/components/scrollToTop.js",
        "src/components/skeletons.js",
        "src/components/dropdowns/behavior.js",
        "src/components/dropdowns/render.js",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
    },
  },
});
