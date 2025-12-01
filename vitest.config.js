import { cpus } from "node:os";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Get CPU count for optimal worker/thread configuration
const CPU_COUNT = cpus().length;

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
    teardownTimeout: 1000,
    testTimeout: 30000,
    // Setup file runs for all tests but uses atomic flag to only clear benchmark results once
    setupFiles: ["viteTest/Benchmarks/config/setup.js", "viteTest/Unit/setup.js"],
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
      reportsDirectory: "coverage",
      include: ["src/**/*.js"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "temp/",
        "**/*.config.js",
        "stryker.conf.js",
        "viteTest/**/*.test.js",
        "**/*.test.js",
        "**/*.spec.js",
        "scripts/**",
        "public/**",
        "**/index.html",
        "**/README.md",
        "**/robots.txt",
        "**/sitemap.xml",
        // DOM manipulation and entry point files (not unit tested)
        "src/App.js",
        "src/card.js",
        "src/errorHandler.js",
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
