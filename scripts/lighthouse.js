/**
 * Lighthouse audit script
 * Runs Lighthouse audits and saves reports to the lighthouse folder
 */

import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const LIGHTHOUSE_DIR = join(PROJECT_ROOT, "lighthouse");
const BASE_PATH = "/OC-LesPetitPlats/";
const DEFAULT_PORT = 5173;
const DEFAULT_URL = `http://localhost:${DEFAULT_PORT}${BASE_PATH}`;
const CHROME_FLAGS = ["--headless", "--no-sandbox", "--disable-gpu"];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

/**
 * Cleans the lighthouse directory by removing it entirely, then recreates it
 */
const cleanLighthouseDir = () => {
  try {
    rmSync(LIGHTHOUSE_DIR, { recursive: true, force: true });
    console.log(`Cleaned lighthouse directory: ${LIGHTHOUSE_DIR}`);
  } catch (error) {
    // Directory might not exist yet, which is fine
    if (error.code !== "ENOENT") {
      console.warn(`Warning: Could not clean lighthouse directory: ${error.message}`);
    }
  }
};

/**
 * Ensures the lighthouse directory exists
 */
const ensureLighthouseDir = () => {
  mkdirSync(LIGHTHOUSE_DIR, { recursive: true });
};

/**
 * Gets the URL to audit from command line arguments or uses default
 * @returns {string} URL to audit
 */
const getAuditUrl = () => {
  return process.argv[2] || DEFAULT_URL;
};

/**
 * Creates output file paths for HTML and JSON reports
 * @returns {{html: string, json: string}} Object with HTML and JSON file paths
 */
const createOutputPaths = () => {
  const timestamp = Date.now();
  const basePath = join(LIGHTHOUSE_DIR, `report-${timestamp}`);
  return {
    html: `${basePath}.html`,
    json: `${basePath}.json`,
  };
};

/**
 * Launches Chrome instance for Lighthouse
 * @returns {Promise<import('chrome-launcher').LaunchedChrome>} Launched Chrome instance
 */
const launchChrome = async () => {
  return launch({
    chromeFlags: CHROME_FLAGS,
  });
};

/**
 * Creates Lighthouse options configuration
 * @param {number} port - Chrome DevTools Protocol port
 * @returns {import('lighthouse').Flags} Lighthouse options
 */
const createLighthouseOptions = port => ({
  logLevel: "info",
  output: ["html", "json"],
  onlyCategories: CATEGORIES,
  port,
});

/**
 * Saves Lighthouse reports to disk
 * @param {Array<string>} reports - Array of report strings (HTML and JSON)
 * @param {{html: string, json: string}} paths - File paths for reports
 */
const saveReports = (reports, paths) => {
  const [htmlReport, jsonReport] = reports;

  writeFileSync(paths.html, htmlReport);
  console.log(`HTML report saved to: ${paths.html}`);

  writeFileSync(paths.json, jsonReport);
  console.log(`JSON report saved to: ${paths.json}`);
};

/**
 * Displays Lighthouse scores to console
 * @param {import('lighthouse').LighthouseResult} result - Lighthouse result object
 */
const displayScores = result => {
  const scores = result.lhr.categories;
  console.log("\n=== Lighthouse Scores ===");
  console.log(`Performance: ${Math.round(scores.performance.score * 100)}`);
  console.log(`Accessibility: ${Math.round(scores.accessibility.score * 100)}`);
  console.log(`Best Practices: ${Math.round(scores["best-practices"].score * 100)}`);
  console.log(`SEO: ${Math.round(scores.seo.score * 100)}`);
};

/**
 * Runs Lighthouse audit for the given URL
 * @param {string} url - URL to audit
 * @returns {Promise<void>}
 */
const runAudit = async url => {
  let chrome = null;

  try {
    console.log(`Running Lighthouse audit for: ${url}`);
    console.log(`Output directory: ${LIGHTHOUSE_DIR}`);

    chrome = await launchChrome();
    const options = createLighthouseOptions(chrome.port);
    const result = await lighthouse(url, options);

    const paths = createOutputPaths();
    saveReports(result.report, paths);
    displayScores(result);
  } catch (error) {
    console.error("Error running Lighthouse:", error);
    process.exit(1);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
};

/**
 * Main execution function
 */
const main = () => {
  cleanLighthouseDir();
  ensureLighthouseDir();
  const url = getAuditUrl();
  runAudit(url);
};

main();
