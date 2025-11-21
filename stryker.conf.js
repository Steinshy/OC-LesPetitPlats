/**
 * Stryker Mutation Testing Configuration
 * Run mutation tests to verify test quality
 */

export default {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation.html",
  },
  testRunner: "vitest",
  testRunnerNodeArgs: ["--no-watch"],
  coverageAnalysis: "perTest",
  mutate: [
    "src/**/*.js",
    "!**/viteTest/**",
    "!**/*.config.js",
    // Exclude DOM manipulation and entry point files (not unit tested)
    "!src/App.js",
    "!src/errorHandler.js",
    "!src/components/scrollToTop.js",
    "!src/components/skeletons.js",
    "!src/components/dropdown/render.js",
  ],
  thresholds: {
    high: 80,
    low: 70,
    break: 60,
  },
  timeoutMS: 30000,
  concurrency: 8,
  ignoreStatic: true,
  logLevel: "info",
  plugins: ["@stryker-mutator/vitest-runner"],
};
