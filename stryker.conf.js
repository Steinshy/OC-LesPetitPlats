/**
 * Stryker Mutation Testing Configuration
 * Run mutation tests to verify test quality
 */

export default {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  reportDir: "reports",
  testRunner: "vitest",
  testRunnerNodeArgs: ["--no-watch"],
  coverageAnalysis: "perTest",
  mutate: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!**/viteTest/**",
    "!**/*.config.js",
    // Exclude DOM manipulation and entry point files (not unit tested)
    "!src/App.js",
    "!src/card.js",
    "!src/errorHandler.js",
    "!src/components/dropdown.js",
    "!src/components/headerImage.js",
    "!src/components/scrollToTop.js",
    "!src/components/skeletons.js",
    "!src/components/dropdown/behavior.js",
    "!src/components/dropdown/render.js",
  ],
  thresholds: {
    high: 80,
    low: 70,
    break: 60,
  },
  timeoutMS: 60000,
  concurrency: 2,
  logLevel: "info",
  plugins: ["@stryker-mutator/vitest-runner"],
};
