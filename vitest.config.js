import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

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
      include: ["src/**/*.js"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.config.js",
        "stryker.conf.js",
        "viteTest/**",
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
        "src/mobileMenu.js",
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
