import { cpus } from "os";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Get CPU count for optimal worker/thread configuration
const CPU_COUNT = cpus().length;

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["viteTest/**/*.test.js"],
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        useAtomics: true, // Enable shared memory for better performance
        minThreads: 1,
        maxThreads: CPU_COUNT, // Use all available CPU cores
      },
    },
    maxWorkers: CPU_COUNT, // Use all available CPU cores
    minWorkers: 1,
    teardownTimeout: 1000,
    testTimeout: 30000, // 30 seconds (increased for benchmark tests)
    // Setup file runs for all tests but uses atomic flag to only clear benchmark results once
    setupFiles: ["viteTest/Benchmarks/setup.js", "viteTest/LesPetitPlats/setup.js"],
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
        "src/components/dropdown/behavior.js",
        "src/components/dropdown/render.js",
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
