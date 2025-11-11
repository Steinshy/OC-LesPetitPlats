/**
 * Stryker Mutation Testing Configuration
 * Run mutation tests to verify test quality
 */

export default {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
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
