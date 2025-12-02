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
  timeoutMS: 60000, // Increased to 60 seconds for slower tests
  dryRunTimeoutMS: 600000, // 10 minutes for initial dry run (CI can be slow)
  concurrency: 4, // Reduced from 8 to avoid resource exhaustion
  maxTestRunnerReuse: 25, // Reuse test runners more to speed up execution
  ignoreStatic: true,
  logLevel: "info",
  plugins: ["@stryker-mutator/vitest-runner"],
};
