import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

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
    exclude: ["viteTest/reference/**"],
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },
    teardownTimeout: 1000,
    testTimeout: 30000, // 30 seconds for benchmark tests
    setupFiles: ["viteTest/Benchmarks/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "*.config.js",
        "viteTest/**",
        "**/*.test.js",
        "**/*.spec.js",
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
