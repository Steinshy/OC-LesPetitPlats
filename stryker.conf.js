/**
 * Stryker Mutation Testing Configuration
 * Run mutation tests to verify test quality
 */

export default {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "json"],
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
    "!src/App.js",
    "!src/utils/toast.js",
    "!src/components/scrollToTop.js",
    "!src/components/dropdowns/render.js",
  ],
  thresholds: {
    high: 80,
    low: 70,
    break: 60,
  },
  timeoutMS: 60000,
  concurrency: 4,
  maxTestRunnerReuse: 25,
  ignoreStatic: true,
  logLevel: "info",
  plugins: ["@stryker-mutator/vitest-runner"],
};
